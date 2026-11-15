import { mountApp } from "@workout-tracker/api";
import { App } from "./App";

// One client and one auth state for the whole app; remotes reach both
// through the shared singletons.
mountApp(<App />, GATEWAY_URL);
