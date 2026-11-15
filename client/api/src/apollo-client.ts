import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { expireToken, readToken } from "@workout-tracker/auth-state";

export function createApolloClient(gatewayUrl: string): ApolloClient {
  const authLink = new SetContextLink((prevContext) => {
    const token = readToken();
    const authorization = token ? `Bearer ${token}` : "";
    return { headers: { ...prevContext["headers"], authorization } };
  });

  // The gateway refused the token this request carried: sign out, and the
  // shell's guard sends the person to sign in. A request sent without a token
  // (e.g. a wrong password on sign-in, also UNAUTHENTICATED) changes nothing.
  const expiredLink = new ErrorLink(({ error, operation }) => {
    const rejected =
      CombinedGraphQLErrors.is(error) &&
      error.errors.some((e) => e.extensions?.["code"] === "UNAUTHENTICATED");
    const sent = String(operation.getContext()["headers"]?.authorization ?? "");
    if (
      rejected &&
      sent.startsWith("Bearer ") &&
      expireToken(sent.slice("Bearer ".length))
    ) {
      // Whoever signs in next mustn't see this person's cached data. Deferred:
      // clearing cancels in-flight requests, this one included.
      setTimeout(() => void client.clearStore());
    }
  });

  const httpLink = new HttpLink({ uri: `${gatewayUrl}/graphql` });
  const client = new ApolloClient({
    link: ApolloLink.from([authLink, expiredLink, httpLink]),
    cache: new InMemoryCache(),
  });
  return client;
}
