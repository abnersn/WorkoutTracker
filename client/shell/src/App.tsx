import { Component, Suspense, type ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { Container } from "@workout-tracker/ui";
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
  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <p>
            Provider &quot;{this.props.name}&quot; unavailable:{" "}
            {this.state.error.message}
          </p>
        </div>
      );
    }
    return (
      <Suspense fallback={<p>Loading {this.props.name}...</p>}>
        {this.props.children}
      </Suspense>
    );
  }
}

// Every remote receives `navigate`, so its links move within the SPA instead of reloading.
interface NavigateProps {
  navigate: (to: string) => void;
}

const ProviderWorkoutView = lazyProvider<{ id: string } & NavigateProps>(
  "workoutView",
  "App",
);
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
  return (
    <>
      <ProviderBoundary name="workoutList">
        <ProviderWorkoutList navigate={navigate} />
      </ProviderBoundary>
      <ProviderBoundary name="workoutHistory">
        <ProviderWorkoutHistory navigate={navigate} />
      </ProviderBoundary>
    </>
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
function WorkoutViewRoute() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  return (
    <ProviderBoundary name="workoutView">
      <ProviderWorkoutView id={id} navigate={navigate} />
    </ProviderBoundary>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route index element={<HomeRoute />} />
          <Route path="workouts/new" element={<WorkoutNewRoute />} />
          <Route path="workouts/:id" element={<WorkoutViewRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
