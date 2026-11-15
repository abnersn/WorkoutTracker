import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const TOKEN_KEY = "workout-tracker.token";

export interface Auth {
  token: string | null;
  signIn(token: string): void;
  signOut(): void;
}

const AuthContext = createContext<Auth | null>(null);
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const auth = useMemo<Auth>(
    () => ({
      token,
      signIn(next) {
        localStorage.setItem(TOKEN_KEY, next);
        setToken(next);
      },
      signOut() {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
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
