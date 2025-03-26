import { RouterProvider } from "react-router-dom";
import AppRoute from "./routes/route";

// import AppRouteLogin from "./routes/routeLogin";

const App: React.FC = () => {
  const router = AppRoute();
  return <RouterProvider router={router} />;
};

export default App;
