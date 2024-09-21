import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// const [isModalOpen, setIsModalOpen] = useState(false);
const editProfile = async (formData) => {
  try {
    const response = await axios.post("/api/user/updateprofile", formData, {
      withCredentials: true,
    });
    const user = response.data;
    return user;
  } catch (error) {
    let errorMessage = error.response.data.error;
    throw new Error(errorMessage);
  }
};
const EditProfileModal = () => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(true);

  const mutation = useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      toast.success("Edit Profile Successfully");
      localStorage.setItem("user", JSON.stringify(data));
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error - ", error);
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => {
          document.getElementById("edit_profile_modal").showModal();
        }}
      >
        Edit profile
      </button>
      {isModalOpen && (
        <dialog id="edit_profile_modal" className="modal">
          <div className="modal-box border rounded-md border-gray-700 shadow-md">
            <h3 className="font-bold text-lg my-3">Update Profile</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.userName}
                  name="userName"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                />
                <textarea
                  placeholder="Bio"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.bio}
                  name="bio"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.currentPassword}
                  name="currentPassword"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.newPassword}
                  name="newPassword"
                  onChange={handleInputChange}
                />
              </div>
              <input
                type="text"
                placeholder="Link"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.link}
                name="link"
                onChange={handleInputChange}
              />
              <button className="btn btn-primary rounded-full btn-sm text-white">
                Update
              </button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className="outline-none">close</button>
          </form>
        </dialog>
      )}
    </>
  );
};
export default EditProfileModal;
