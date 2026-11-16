import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export const TOKEN_KEY = "workout-tracker.token";

export interface Auth {
  token: string | null;
  /** Signed out because the gateway refused the token, not by choice. */
  expired: boolean;
  signIn(token: string): void;
  signOut(): void;
}

// The token lives outside React so the Apollo client, which is created
// before any component, can sign someone out. This module is a federation
// singleton, so the shell and every remote share one store.
const listeners = new Set<() => void>();
let expired = false;

/** The stored token, or `null` when signed out. */
export function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function writeToken(token: string | null, wasExpired = false): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  expired = wasExpired;
  listeners.forEach((listener) => listener());
}

/**
 * Signs out because the gateway refused `rejected` (expired, or signed with a
 * secret it no longer has). Only if it's still the stored token: a request
 * sent before signing in again mustn't throw away the new one. Returns
 * whether it signed out.
 */
export function expireToken(rejected: string): boolean {
  if (readToken() !== rejected) {
    return false;
  }
  writeToken(null, true);
  return true;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Signing in or out in another tab applies here too.
  const onStorage = (event: StorageEvent): void => {
    if (event.key === TOKEN_KEY || event.key === null) {
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const AuthContext = createContext<Auth | null>(null);
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const token = useSyncExternalStore(subscribe, readToken);
  const auth = useMemo<Auth>(
    () => ({
      token,
      expired: !token && expired,
      signIn(next) {
        writeToken(next);
      },
      signOut() {
        writeToken(null);
      },
    }),
    [token],
  );
  return <AuthContext value={auth}>{children}</AuthContext>;
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return auth;
}
