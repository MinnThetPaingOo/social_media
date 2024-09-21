import { Outlet } from "react-router-dom";
import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { user } = useContext(AuthContext);
  // console.log(user);
  // Run the query only if user is available
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      if (!user) return; // Exit if no user is available
      try {
        const response = await axios.get("/api/auth/me");
        // const data = response.data;
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch user data");
      }
    },
    // Refetch when user changes
    enabled: !!user,
  });

  // Render loading state
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Render error state
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="flex mx-auto max-w-6xl">
      {user && <Sidebar data={data} user={user} />}
      <Outlet />
      {user && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
