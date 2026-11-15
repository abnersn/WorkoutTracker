import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { SetContextLink } from "@apollo/client/link/context";
import { TOKEN_KEY } from "@workout-tracker/auth-state";

export function createApolloClient(gatewayUrl: string): ApolloClient {
  const authLink = new SetContextLink((prevContext) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const authorization = token ? `Bearer ${token}` : "";
    return { headers: { ...prevContext.headers, authorization } };
  });

  const httpLink = new HttpLink({ uri: `${gatewayUrl}/graphql` });
  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}
