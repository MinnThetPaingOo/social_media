import React, { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Signup from "../pages/Singup.jsx"; // Fixed typo: Singup -> Signup
import Login from "../pages/Login.jsx";
import Noti from "../pages/Notifications.jsx";
import ProfilePage from "../pages/Profile.jsx";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function AppRouter() {
  const { user } = useContext(AuthContext);
  // console.log("user is " + user.userName);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: user ? <Home /> : <Navigate to={"/login"} />,
        },
        {
          path: "/signup",
          element: !user ? <Signup /> : <Navigate to={"/"} />, // Fixed typo
        },
        {
          path: "/login",
          element: !user ? <Login /> : <Navigate to={"/"} />,
        },
        {
          path: "/notifications",
          element: user ? <Noti /> : <Navigate to={"/login"} />,
        },
        {
          path: "/profile/:userName",
          element: user ? <ProfilePage /> : <Navigate to={"/login"} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRouter;
