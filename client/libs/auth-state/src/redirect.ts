export type AuthScreen = "sign-in" | "sign-up";

/** Where the shell serves each auth screen. */
export function authPath(screen: AuthScreen): string {
  return `/auth/${screen}`;
}
