import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { profileef, useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import ProfileHeaderSkeleton from "../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "../Modal/EditProfileModal";
import { FaArrowLeft } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { useParams } from "react-router-dom";
import Posts from "../components/common/Posts";
import cover from "../../src/assets/images/cover.jpg";
import pp from "../../src/assets/images/pp.jpg";

const ProfilePage = () => {
  const { userName } = useParams();
  const { user } = useContext(AuthContext);
  const [refetch, setRefetch] = useState(false);
  const isLoading = false;

  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const [profile, setProfile] = useState(null); //user profile
  // const [buttonText, setButtonText] = useState("Follow");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const postDeleted = (_id) => {
    setPosts((pre) => pre.filter((post) => post._id !== _id));
  };

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "coverImg") {
          setCoverImg(reader.result);
        } else if (state === "profileImg") {
          setProfileImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchPosts = async () => {
    let response;
    if (feedType == "posts") {
      response = await axios.get(`/api/posts/user/${userName}`);
    }
    if (feedType == "likes") {
      response = await axios.get(`/api/posts/likedpost/${userName}`);
    }
    return response.data;
  };

  const fetchProfile = async () => {
    const response = await axios.get(`/api/user/profile/${userName}`);
    return response.data;
  };
  const {
    data: posts,
    error: postsError,
    isLoading: postsLoading,
    isError: postsIsError,
  } = useQuery({
    queryKey: ["posts", userName, feedType],
    queryFn: fetchPosts,
    onError: (err) => {
      console.error("Error fetching posts:", err);
      toast.error("Failed to fetch posts.");
    },
    onSuccess: () => {
      toast.success("Posts fetched successfully!");
    },
  });

  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
    isError: profileIsError,
  } = useQuery({
    queryKey: ["profile", userName],
    queryFn: fetchProfile,
    onError: (err) => {
      console.error("Error fetching profile:", err);
      toast.error("Failed to fetch profile.");
    },
    onSuccess: () => {
      toast.success("Profile fetched successfully!");
    },
  });

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  if (profileLoading || postsLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (profileIsError || postsIsError) {
    return <div>Error: {profileError?.message || postsError?.message}</div>;
  }

  if (!profile) {
    return <p className="text-center text-lg mt-4">profile not found</p>;
  }
  const isMyProfile = user._id == profile._id;

  const handleFollow = async () => {
    try {
      await axios.post(`/api/user/follow/${profile.userName}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      <div className="relative group/cover">
        <img
          src={coverImg || profile.coverImg || cover}
          className="h-52 w-full object-cover"
          alt="cover image"
        />
        {true && ( // Assuming `isMyProfile` is always true here
          <div
            className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
            onClick={() => coverImgRef.current.click()}
          >
            <MdEdit className="w-5 h-5 text-white" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          hidden
          ref={coverImgRef}
          onChange={(e) => handleImgChange(e, "coverImg")}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={profileImgRef}
          onChange={(e) => handleImgChange(e, "profileImg")}
        />
        {/* profile AVATAR */}
        <div className="avatar absolute -bottom-16 left-4">
          <div className="w-32 rounded-full relative group/avatar">
            <img
              src={profileImg || profile.profileImg || pp}
              alt="profile avatar"
            />
            <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
              {true && ( // Assuming `isMyProfile` is always true here
                <MdEdit
                  className="w-4 h-4 text-white"
                  onClick={() => profileImgRef.current.click()}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 mt-5">
        <div className="flex gap-10 items-center">
          <Link to="/">
            <FaArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex flex-col">
            <p className="font-bold text-lg">{profile.fullName}</p>
            <span className="text-sm text-slate-500">{posts.length} posts</span>
          </div>
        </div>

        <div className="flex justify-end">
          {isMyProfile && <EditProfileModal />}
          {!isMyProfile && (
            <button
              className="btn btn-outline rounded-full btn-sm"
              onClick={(e) => {
                e.preventDefault();
                handleFollow();
              }}
            >
              {profile.followres.includes(user.userName) && (
                <span>Unfollow</span>
              )}
              {!profile.followres.includes(user.userName) && (
                <span>Follow</span>
              )}
            </button>
          )}
          {(coverImg || profileImg) && (
            <button
              className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
              onClick={() => alert("Profile updated successfully")}
            >
              Update
            </button>
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-lg">{profile.fullName}</span>
          <span className="text-sm text-slate-500">@{profile.userName}</span>
          <span className="text-sm my-1">{profile.bio}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {profile.link && (
            <div className="flex gap-1 items-center">
              <FaLink className="w-3 h-3 text-slate-500" />
              <a
                href={profile.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {profile.link}
              </a>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <IoCalendarOutline className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-500">
              Joined {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <span className="font-bold text-xs">
              {profile.following.length}
            </span>
            <span className="text-slate-500 text-xs">Following</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="font-bold text-xs">
              {profile.followres.length}
            </span>
            <span className="text-slate-500 text-xs">Followers</span>
          </div>
        </div>
      </div>

      <div className="flex w-full border-b border-gray-700 mt-4">
        <div
          className={`flex justify-center flex-1 p-3 cursor-pointer ${
            feedType === "posts"
              ? "bg-primary text-white"
              : "text-slate-500 hover:bg-secondary"
          }`}
          onClick={() => setFeedType("posts")}
        >
          Posts
          {feedType === "posts" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
          )}
        </div>
        <div
          className={`flex justify-center flex-1 p-3 cursor-pointer ${
            feedType === "likes"
              ? "bg-primary text-white"
              : "text-slate-500 hover:bg-secondary"
          }`}
          onClick={() => setFeedType("likes")}
        >
          Likes
          {feedType === "likes" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
          )}
        </div>
      </div>

      <div className="px-4 mt-4">
        {feedType === "posts" && (
          // <ul>
          //   {posts.map((post) => (
          //     <li key={post.id} className="border-b border-gray-700 py-2">
          //       {post.text}
          //     </li>
          //   ))}
          // </ul>
          <Posts
            posts={posts}
            isLoading={isLoading}
            refetch={refetch}
            postDeleted={postDeleted}
          />
        )}
        {feedType === "likes" && (
          <Posts
            posts={posts}
            isLoading={isLoading}
            refetch={refetch}
            postDeleted={postDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
