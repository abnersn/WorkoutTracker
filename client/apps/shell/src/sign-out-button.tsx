import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { LogOut } from "lucide-react";
import { useAuth } from "@workout-tracker/auth-state";
import { Button, Dialog } from "@workout-tracker/ui";
import { clearActiveSession, loadActiveSession } from "@workout-tracker/utils";

/**
 * Forgets the token, which is all signing out takes: the gateway keeps no
 * session, so there is nothing to tell it. Everything cached for this person
 * goes too, so the next one to sign in on this device sees none of it.
 */
export function SignOutButton(): React.JSX.Element {
  const { signOut } = useAuth();
  const client = useApolloClient();
  // The workout left running, when signing out would throw it away.
  const [discarding, setDiscarding] = useState<string | null>(null);

  const leave = (): void => {
    setDiscarding(null);
    // The token first: RequireAuth then leaves for sign-in at once, so no
    // screen is left querying while the cache empties.
    signOut();
    clearActiveSession();
    // clearStore, not resetStore: refetching now would only be refused.
    void client.clearStore();
  };

  return (
    <>
      <Button
        variant="ghost"
        icon={<LogOut size={20} />}
        className="shrink-0"
        onClick={() => {
          // It sits in every title row, next to Edit mid-workout: a stray tap
          // mustn't cost a run.
          const running = loadActiveSession();
          if (running) {
            setDiscarding(running.workout.name);
          } else {
            leave();
          }
        }}
      >
        {/* Icon only on phones, where the title row is tight. */}
        <span className="sr-only sm:not-sr-only">Sign out</span>
      </Button>
      <Dialog
        open={discarding !== null}
        title="Sign out?"
        onClose={() => setDiscarding(null)}
        actions={
          <>
            <Button
              variant="ghost"
              data-autofocus
              onClick={() => setDiscarding(null)}
            >
              Stay signed in
            </Button>
            <Button tone="danger" onClick={leave}>
              Sign out
            </Button>
          </>
        }
      >
        {discarding} is still in progress. Signing out discards it.
      </Dialog>
    </>
  );
}
