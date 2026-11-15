import { mountApp } from "@workout-tracker/api";
import { App } from "./App";

// Standalone serve only; inside the shell, the shell provides the data layer.
mountApp(<App />);
