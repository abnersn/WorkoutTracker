// Exposed by the federation plugin as 'auth/App'.
// Consumers render it lazily via `lazyProvider('auth', 'App')` and pick the
// screen with `screen`.
import type { AuthScreen } from "@workout-tracker/auth-state";
import { SignInScreen } from "./screens/sign-in-screen";
import { SignUpScreen } from "./screens/sign-up-screen";
import "./styles.css";

export interface AppProps {
  screen?: AuthScreen;
  /** Where to go once signed in: the route the shell's guard turned away. */
  redirectTo?: string;
  navigate?: (to: string) => void;
}

// Standalone (no shell), there is no router to hand us, so fall back to a
// full page load.
function assignLocation(to: string): void {
  window.location.assign(to);
}

const SCREENS = { "sign-in": SignInScreen, "sign-up": SignUpScreen };

export function App({
  screen = "sign-in",
  redirectTo = "/",
  navigate = assignLocation,
}: AppProps): React.JSX.Element {
  const Screen = SCREENS[screen];
  return <Screen navigate={navigate} redirectTo={redirectTo} />;
}

export default App;
