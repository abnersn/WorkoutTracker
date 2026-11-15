/**
 * @jest-environment jsdom
 */
import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import {
  type Auth,
  AuthProvider,
  expireToken,
  readToken,
  TOKEN_KEY,
  useAuth,
} from "./auth-context";

function renderAuth(): RenderHookResult<Auth, unknown> {
  return renderHook(() => useAuth(), { wrapper: AuthProvider });
}

describe("auth state", () => {
  beforeEach(() => localStorage.clear());

  it("starts from the stored token", () => {
    localStorage.setItem(TOKEN_KEY, "stored");
    expect(renderAuth().result.current.token).toBe("stored");
  });

  it("stores the token on sign-in and drops it on sign-out", () => {
    const { result } = renderAuth();

    act(() => result.current.signIn("abc"));
    expect(readToken()).toBe("abc");
    expect(result.current.token).toBe("abc");

    act(() => result.current.signOut());
    expect(readToken()).toBeNull();
    expect(result.current).toMatchObject({ token: null, expired: false });
  });

  it("marks a sign-out caused by a rejected token as expired", () => {
    const { result } = renderAuth();
    act(() => result.current.signIn("old"));

    let signedOut = false;
    act(() => {
      signedOut = expireToken("old");
    });

    expect(signedOut).toBe(true);
    expect(readToken()).toBeNull();
    expect(result.current).toMatchObject({ token: null, expired: true });
  });

  it("keeps a newer token when a request sent with an older one fails", () => {
    const { result } = renderAuth();
    act(() => result.current.signIn("new"));

    let signedOut = true;
    act(() => {
      signedOut = expireToken("old");
    });

    expect(signedOut).toBe(false);
    expect(result.current.token).toBe("new");
  });

  it("follows sign-in in another tab", () => {
    const { result } = renderAuth();
    act(() => {
      localStorage.setItem(TOKEN_KEY, "other-tab");
      window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_KEY }));
    });
    expect(result.current.token).toBe("other-tab");
  });

  it("refuses useAuth outside the provider", () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => renderHook(() => useAuth())).toThrow(/inside <AuthProvider>/);
  });
});
