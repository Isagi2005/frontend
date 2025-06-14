import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, [isAuthenticated]); // Rafraîchir le rôle quand l'authentification change

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

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
