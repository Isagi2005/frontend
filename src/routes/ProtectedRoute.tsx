import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const auth = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [auth?.isAuthenticated]); // Rafraîchir le rôle quand l'authentification change

  // Initialiser le rôle depuis localStorage immédiatement
  if (!userRole) {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const { isAuthenticated, isLoading } = auth;

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
