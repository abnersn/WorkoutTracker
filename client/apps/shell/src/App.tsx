import {
  Button,
  CardListSkeleton,
  Container,
  WorkoutScreenSkeleton,
} from "@workout-tracker/ui";
import { Component, Suspense, useEffect, type ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  type Location,
} from "react-router";
import { type AuthScreen, useAuth } from "@workout-tracker/auth-state";
import { lazyProvider } from "./mf";
import { RequireAuth } from "./require-auth";
import { SignOutButton } from "./sign-out-button";
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
  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }
  componentDidCatch(error: Error): void {
    // The technical detail is for developers; people get a way forward.
    console.error(`Remote "${this.props.name}" failed to load`, error);
  }
  render(): React.JSX.Element {
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
  auth: "Sign-in",
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

// A page-owning remote places the shell's account actions in its title row.
interface TitleActionProps {
  titleAction?: ReactNode;
}

const ProviderWorkoutView = lazyProvider<
  { id: string; finished?: boolean } & NavigateProps & TitleActionProps
>("workoutView", "App");
const ProviderWorkoutHistory = lazyProvider<NavigateProps>(
  "workoutHistory",
  "App",
);
const ProviderWorkoutList = lazyProvider<NavigateProps & TitleActionProps>(
  "workoutList",
  "App",
);
const ProviderWorkoutNew = lazyProvider<
  { id?: string; fromLogs?: boolean } & NavigateProps & TitleActionProps
>("workoutNew", "App");
const ProviderAuth = lazyProvider<
  { screen: AuthScreen; redirectTo: string } & NavigateProps
>("auth", "App");

// The route RequireAuth turned away (its `state.from`), or home when the
// visitor came here directly.
function returnPath(state: unknown): string {
  const from = (state as { from?: Location } | null)?.from;
  return from ? from.pathname + from.search + from.hash : "/";
}

const AUTH_TITLES: Record<AuthScreen, string> = {
  "sign-in": "Sign in",
  "sign-up": "Sign up",
};

// auth/sign-in and auth/sign-up: once signed in, go back to the route the
// guard turned away. Someone already signed in goes there directly.
function AuthRoute({ screen }: { screen: AuthScreen }): React.JSX.Element {
  const { token } = useAuth();
  const routerNavigate = useNavigate();
  const { state } = useLocation();
  const redirectTo = returnPath(state);
  // Keep `state.from` when moving between sign-in and sign-up, so the
  // return route survives the switch.
  const navigate = (to: string): void => {
    void routerNavigate(to, { state });
  };
  useEffect(() => {
    document.title = `${AUTH_TITLES[screen]} · Workout Tracker`;
  }, [screen]);
  if (token) {
    return <Navigate to={redirectTo} replace />;
  }
  return (
    <ProviderBoundary name="auth">
      <ProviderAuth
        screen={screen}
        redirectTo={redirectTo}
        navigate={navigate}
      />
    </ProviderBoundary>
  );
}

// "/": the saved workouts above the history.
function HomeRoute(): React.JSX.Element {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Workout Tracker";
  }, []);
  return (
    // The two sections are flex items of one column, so the space between them
    // comes from `gap`, not from margins on either remote.
    <div className="flex flex-1 flex-col gap-6 pb-8">
      <ProviderBoundary name="workoutList">
        <ProviderWorkoutList
          navigate={navigate}
          titleAction={<SignOutButton />}
        />
      </ProviderBoundary>
      <ProviderBoundary name="workoutHistory">
        <ProviderWorkoutHistory navigate={navigate} />
      </ProviderBoundary>
    </div>
  );
}

// workouts/new?id=<saved workout, or log key with fromLogs=true> -> run mode.
function WorkoutNewRoute(): React.JSX.Element {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  return (
    <ProviderBoundary name="workoutNew">
      <ProviderWorkoutNew
        id={params.get("id") ?? ""}
        fromLogs={params.get("fromLogs") === "true"}
        navigate={navigate}
        titleAction={<SignOutButton />}
      />
    </ProviderBoundary>
  );
}

// workouts/:id -> view mode. The id comes from the path and is handed to the
// workoutView remote.
// workouts/:id?finished=true -> the session that was just finished.
function WorkoutViewRoute(): React.JSX.Element {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  return (
    <ProviderBoundary name="workoutView">
      <ProviderWorkoutView
        id={id}
        finished={params.get("finished") === "true"}
        navigate={navigate}
        titleAction={<SignOutButton />}
      />
    </ProviderBoundary>
  );
}

export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Container>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
          <Routes>
            <Route element={<RequireAuth />}>
              <Route index element={<HomeRoute />} />
              <Route path="workouts/new" element={<WorkoutNewRoute />} />
              <Route path="workouts/:id" element={<WorkoutViewRoute />} />
            </Route>
            <Route
              path="auth/sign-in"
              element={<AuthRoute screen="sign-in" />}
            />
            <Route
              path="auth/sign-up"
              element={<AuthRoute screen="sign-up" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Container>
    </BrowserRouter>
  );
}

export default App;
