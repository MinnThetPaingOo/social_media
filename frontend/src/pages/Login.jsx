import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import XSvg from "../components/svgs/x";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext.jsx"; // Import AuthContext

const postSingIn = async (formData) => {
  try {
    const response = await axios.post("/api/auth/login", formData, {
      withCredentials: true,
    });

    const { user, token } = response.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    return { user, token };
  } catch (error) {
    console.log(error.response?.data?.error || error.message);
    let errorMessage = error.response?.data?.error || "Invalid Field";
    throw new Error(errorMessage);
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { dispatch } = useContext(AuthContext); // Access dispatch from AuthContext

  const mutation = useMutation({
    mutationFn: postSingIn,
    onSuccess: (data) => {
      dispatch({ type: "LOGIN", payload: data.user }); // Update context on successful login
      toast.success("Login successful!");
    },
    onError: (error) => {
      console.error("Error in login:", error);
      toast.error(error.message || "An error occurred.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = mutation.isError; // Update error state based on mutation

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            Login
          </button>
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
