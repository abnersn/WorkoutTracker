import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@workout-tracker/api";
import { AuthProvider } from "@workout-tracker/auth-state";
import { App } from "./App";

// Standalone serve only; inside the shell, the shell provides both. The
// gateway must list this origin in CORS_ORIGINS for requests to succeed.
const apolloClient = createApolloClient("http://localhost:3000");

const container = document.getElementById("root");
if (!container) {
  throw new Error("#root element not found");
}

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>,
);
