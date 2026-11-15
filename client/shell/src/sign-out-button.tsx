import { useApolloClient } from "@apollo/client/react";
import { LogOut } from "lucide-react";
import { useAuth } from "@workout-tracker/auth-state";
import { Button } from "@workout-tracker/ui";
import { clearActiveSession } from "@workout-tracker/utils";

/**
 * Forgets the token, which is all signing out takes: the gateway keeps no
 * session, so there is nothing to tell it. Everything cached for this person
 * goes too, so the next one to sign in on this device sees none of it.
 */
export function SignOutButton(): React.JSX.Element {
  const { signOut } = useAuth();
  const client = useApolloClient();
  return (
    <Button
      variant="ghost"
      icon={<LogOut size={20} />}
      onClick={() => {
        // The token first: RequireAuth then leaves for sign-in at once, so no
        // screen is left querying while the cache empties.
        signOut();
        clearActiveSession();
        // clearStore, not resetStore: refetching now would only be refused.
        void client.clearStore();
      }}
    >
      Sign out
    </Button>
  );
}
