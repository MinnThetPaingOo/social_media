import { Link, useAsyncError } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import axios from "axios";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { useEffect, useState } from "react";

const NotificationPage = () => {
  const isLoading = false;
  // const notifications = [
  //   {
  //     _id: "1",
  //     from: {
  //       _id: "1",
  //       username: "johndoe",
  //       profileImg: "/avatars/boy2.png",
  //     },
  //     type: "follow",
  //   },
  //   {
  //     _id: "2",
  //     from: {
  //       _id: "2",
  //       username: "janedoe",
  //       profileImg: "/avatars/girl1.png",
  //     },
  //     type: "like",
  //   },
  // ];

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/notitications/all");
        setNotifications(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const deleteNotifications = async () => {
    try {
      const response = await axios.delete("/api/notitications/delete");
      setNotifications([]);
      console.log(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "Comment" && (
                <FaRegCommentDots className="w-7 h-7 text-primary" />
              )}
              {notification.type === "Like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.userName}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.userName}
                  </span>{" "}
                  {notification.type === "Comment"
                    ? "commented on your post" + " - " + notification.PostText
                    : "liked your post" + " - " + notification.PostText}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
