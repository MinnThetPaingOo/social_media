import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "../contexts/AuthContext.jsx";
import AppRouter from "./routes/index.jsx"; // Adjust import based on your directory structure

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AppRouter />
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
