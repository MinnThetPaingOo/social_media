import React, { useContext } from "react";
import XSvg from "../svgs/x";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../../contexts/AuthContext";
import pp from "../../assets/images/pp.jpg";

const postLogout = async () => {
  try {
    const response = await axios.post(
      "/api/auth/logout",
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return response.data;
    }
    throw new Error("Logout failed");
  } catch (error) {
    console.error(error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Logout failed");
  }
};

const Sidebar = ({ data }) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      dispatch({ type: "LOGOUT" });
      navigate("/login");
      toast.success("Logout successful!");
    },
    onError: (error) => {
      console.error("Error during logout:", error);
      toast.error(error.message || "An error occurred during logout.");
    },
  });

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/` + user.userName}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {data && (
          <div
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
            onClick={handleLogout}
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={pp || data?.profileImg || "/avatar-placeholder.png"}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {data.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{data.userName}</p>
              </div>
              <BiLogOut className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
