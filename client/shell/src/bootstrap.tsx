import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@workout-tracker/api";
import { AuthProvider } from "@workout-tracker/auth-state";
import { App } from "./App";

// One client and one auth state for the whole app; remotes reach both
// through the shared singletons.
const apolloClient = createApolloClient(GATEWAY_URL);

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
