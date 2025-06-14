import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./api/AuthContext";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
);
