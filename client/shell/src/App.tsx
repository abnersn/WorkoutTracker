import { Component, Suspense, useEffect, type ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import {
  Button,
  CardListSkeleton,
  Container,
  WorkoutScreenSkeleton,
} from "@workout-tracker/ui";
import { lazyProvider } from "./mf";
import "./styles.css";

// ProviderBoundary catches the lazy() rejection that fires when a provider's
// remoteEntry.js can't be fetched (provider not running, network error,
// etc.). Without it any one missing provider unmounts the whole consumer
// tree. React has no built-in functional error boundary so this is a class.
// Wrap each <ProviderBoundary> in your router of choice if you need routing.
class ProviderBoundary extends Component<
  { children: ReactNode; name: string },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    // The technical detail is for developers; people get a way forward.
    console.error(`Remote "${this.props.name}" failed to load`, error);
  }
  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="flex flex-col items-start gap-3 px-4 py-6">
          <p className="text-base text-indigo-800">
            {SECTION_LABELS[this.props.name] ?? "This section"} couldn&apos;t
            load. Check your connection, then try again.
          </p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      );
    }
    return (
      <Suspense fallback={PLACEHOLDERS[this.props.name] ?? null}>
        {this.props.children}
      </Suspense>
    );
  }
}

// What each remote is, in words a lifter would use.
const SECTION_LABELS: Record<string, string> = {
  workoutList: "Your workouts",
  workoutHistory: "Your history",
  workoutNew: "This workout",
  workoutView: "This session",
};

// Shaped like each remote's loaded screen, so nothing jumps when it arrives.
const PLACEHOLDERS: Record<string, ReactNode> = {
  workoutList: <CardListSkeleton label="Loading your workouts" withHeading />,
  workoutHistory: (
    <CardListSkeleton label="Loading your history" tone="primary" withHeading />
  ),
  workoutNew: <WorkoutScreenSkeleton label="Loading this workout" />,
  workoutView: <WorkoutScreenSkeleton label="Loading this session" />,
};

// Every remote receives `navigate`, so its links move within the SPA instead of reloading.
interface NavigateProps {
  navigate: (to: string) => void;
}

const ProviderWorkoutView = lazyProvider<
  { id: string; finished?: boolean } & NavigateProps
>("workoutView", "App");
const ProviderWorkoutHistory = lazyProvider<NavigateProps>(
  "workoutHistory",
  "App",
);
const ProviderWorkoutList = lazyProvider<NavigateProps>("workoutList", "App");
const ProviderWorkoutNew = lazyProvider<
  { id?: string; fromLogs?: boolean } & NavigateProps
>("workoutNew", "App");

// "/": the saved workouts above the history.
function HomeRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Workout Tracker";
  }, []);
  return (
    // The two sections are flex items of one column, so the space between them
    // comes from `gap`, not from margins on either remote.
    <div className="flex flex-1 flex-col gap-6 pb-8">
      <ProviderBoundary name="workoutList">
        <ProviderWorkoutList navigate={navigate} />
      </ProviderBoundary>
      <ProviderBoundary name="workoutHistory">
        <ProviderWorkoutHistory navigate={navigate} />
      </ProviderBoundary>
    </div>
  );
}

// workouts/new?id=<saved workout, or log key with fromLogs=true> -> run mode.
function WorkoutNewRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  return (
    <ProviderBoundary name="workoutNew">
      <ProviderWorkoutNew
        id={params.get("id") ?? ""}
        fromLogs={params.get("fromLogs") === "true"}
        navigate={navigate}
      />
    </ProviderBoundary>
  );
}

// workouts/:id -> view mode. The id comes from the path and is handed to the
// workoutView remote.
// workouts/:id?finished=true -> the session that was just finished.
function WorkoutViewRoute() {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  return (
    <ProviderBoundary name="workoutView">
      <ProviderWorkoutView
        id={id}
        finished={params.get("finished") === "true"}
        navigate={navigate}
      />
    </ProviderBoundary>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Container>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
          <Routes>
            <Route index element={<HomeRoute />} />
            <Route path="workouts/new" element={<WorkoutNewRoute />} />
            <Route path="workouts/:id" element={<WorkoutViewRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Container>
    </BrowserRouter>
  );
}

export default App;
