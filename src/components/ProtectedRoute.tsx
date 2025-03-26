import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export interface ChildrenTypeProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ChildrenTypeProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const nav = useNavigate();
  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    nav("/login");
  }
};

export default ProtectedRoute;
