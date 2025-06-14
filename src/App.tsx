import { RouterProvider } from "react-router-dom";
import AppRoute from "./routes/route";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";

const App: React.FC = () => {
  const router = AppRoute();
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
