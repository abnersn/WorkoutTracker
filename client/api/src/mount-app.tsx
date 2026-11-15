import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "@workout-tracker/auth-state";
import { createApolloClient } from "./apollo-client";

/** The gateway `nx serve` starts (PORT in server/gateway/.env.serve). */
export const LOCAL_GATEWAY_URL = "http://localhost:3000";

/**
 * Renders `app` into #root inside the auth state and the GraphQL client every
 * screen's data hooks need. The shell's bootstrap calls it once for the whole
 * app; each remote's bootstrap calls it only when served standalone. A
 * standalone origin must be in the gateway's CORS_ORIGINS, and has its own
 * localStorage, so it starts signed out.
 */
export function mountApp(app: ReactNode, gatewayUrl = LOCAL_GATEWAY_URL): void {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("#root element not found");
  }
  const client = createApolloClient(gatewayUrl);
  createRoot(container).render(
    <StrictMode>
      <AuthProvider>
        <ApolloProvider client={client}>{app}</ApolloProvider>
      </AuthProvider>
    </StrictMode>,
  );
}
