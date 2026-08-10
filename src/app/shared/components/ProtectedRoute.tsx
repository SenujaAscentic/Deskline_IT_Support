// src/app/shared/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSession } from "../../features/auth/useSession";
import type { Role } from "../types";

type Props = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const session = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    const fallback = session.role === "requester" ? "/my-requests" : "/queue";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}