import { useAuth } from "@workout-tracker/auth-state";
import { Navigate, Outlet, useLocation } from "react-router";

export function RequireAuth(): React.ReactNode {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/auth/sign-in" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
