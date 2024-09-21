import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaTrash,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDistanceToNow, differenceInSeconds } from "date-fns";
import pp from "../../assets/images/pp.jpg";

const Post = ({ post, postDeleted }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const postOwner = post.user._id === user._id;
  const commentUserIds = post.comments.map((comment) => comment.user._id);
  const [isCommented, setIsCommented] = useState(
    commentUserIds.includes(user._id)
  );

  const now = new Date();
  const postDate = new Date(post.createdAt);
  const secondsAgo = differenceInSeconds(now, postDate);
  const formattedDate =
    secondsAgo < 60
      ? "just now"
      : formatDistanceToNow(postDate, { addSuffix: true });

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/posts/delete/${post._id}`);
      postDeleted(post._id);
      toast.success("Post Deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Error deleting post:", error);
    }
  };

  const handlePostComment = async (e, id) => {
    e.preventDefault();
    setIsCommenting(true);
    try {
      const res = await axios.post(`/api/posts/comment/${id}`, { commentText });
      const commentsFromApi = res.data.post.comments;
      setCommentCount(commentsFromApi.length);
      setComments(commentsFromApi);
      setCommentText("");
      setIsCommented(
        commentsFromApi.some((comment) => comment.user._id === user._id)
      );
      document.getElementById(`comments_modal${id}`)?.close();
    } catch (err) {
      console.error(err.response.data);
      toast.error("Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleLikePost = async (_id) => {
    try {
      const res = await axios.post(`/api/posts/like/${_id}`);
      const like_post = res.data.post;
      setLikeCount(like_post.likes.length);
      setIsLiked(like_post.likes.includes(user._id));
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to like post");
    }
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <Link to={`/profile/`} className="w-8 rounded-full overflow-hidden">
          <img src={pp} alt={`${post.user.fullName}'s profile`} />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/`} className="font-bold">
            {post.user.fullName}
          </Link>
          <span className="flex gap-1 text-sm">
            <Link to={`/profile/`}>@{post.user.userName}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {postOwner && (
            <span className="flex justify-end flex-1">
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={handleDeletePost}
              />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img &&
            post.img.map((i, index) => (
              <div key={index} className="relative w-full">
                {i.contentType.startsWith("image/") ? (
                  <img
                    src={`http://localhost:5000/${i.data}`}
                    className="h-80 object-contain rounded-lg border border-gray-700"
                    alt={`Post image ${index}`}
                  />
                ) : i.contentType.startsWith("video/") ? (
                  <video
                    src={`http://localhost:5000/${i.data}`}
                    className="h-80 object-contain rounded-lg border border-gray-700"
                    controls
                    alt={`Post video ${index}`}
                  />
                ) : null}
              </div>
            ))}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() =>
                document
                  .getElementById(`comments_modal${post._id}`)
                  ?.showModal()
              }
            >
              <FaRegComment
                className={`w-4 h-4 ${
                  isCommented ? "text-sky-400" : "text-slate-500"
                } group-hover:text-sky-400`}
              />
              <span
                className={`text-sm ${
                  isCommented ? "text-sky-400" : "text-slate-500"
                } group-hover:text-sky-400`}
              >
                {commentCount}
              </span>
            </div>
            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {comments.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={"/avatar-placeholder.png"}
                            alt={`${comment.fullName}'s avatar`}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{comment.fullName}</span>
                          <span className="text-gray-700 text-sm">
                            @{comment.userName}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={(e) => handlePostComment(e, post._id)}
                >
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      "Comment"
                    )}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">Close</button>
              </form>
            </dialog>
            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">
                0
              </span>
            </div>
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={() => handleLikePost(post._id)}
            >
              <FaRegHeart
                className={`w-4 h-4 cursor-pointer ${
                  isLiked ? "text-pink-500" : "text-slate-500"
                } group-hover:text-pink-500`}
              />
              <span
                className={`text-sm ${
                  isLiked ? "text-pink-500" : "text-slate-500"
                } group-hover:text-pink-500`}
              >
                {likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
