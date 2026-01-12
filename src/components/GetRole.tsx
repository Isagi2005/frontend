// components/RedirectToDashboard.tsx
import { Navigate } from "react-router-dom";

const RedirectToDashboard = () => {
  const role = localStorage.getItem("role");

  switch (role) {
    case "direction":
      return <Navigate to="dashboard1" />;
    case "finance":
      return <Navigate to="dashboardF" />;
    case "enseignant":
      return <Navigate to="dashboardE" />;
    case "parent":
      return <Navigate to="dashboardP" />;
    default:
      return <Navigate to="/unauthorized" />;
  }
};

export default RedirectToDashboard;
