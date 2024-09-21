import { useCallback, useEffect, useState } from "react";
import Posts from "../components/common/Posts";
import CreatePost from "../components/common/CreatePosts";
import Header from "../components/common/Header";
import axios from "axios";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0); // Track page number or offset

  // Function to fetch posts
  const fetchPosts = async (start = 0, limit = 5) => {
    setLoading(true);
    try {
      const getPostEndPoint = () => {
        switch (feedType) {
          case "forYou":
            return `/api/posts/getallpost?start=${start}&limit=${limit}`;
          case "following":
            return `/api/posts/following?start=${start}&limit=${limit}`;
          default:
            return `/api/posts/getallpost?start=${start}&limit=${limit}`;
        }
      };
      const POST_END_POINT = getPostEndPoint();
      const response = await axios.get(POST_END_POINT);
      const newPosts = response.data;
      if (newPosts.length < limit) {
        setHasMore(false);
      }
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  // Fetch posts whenever feedType or page changes
  useEffect(() => {
    setPosts([]); // Clear posts when feedType changes
    setHasMore(true); // Reset hasMore when feedType changes
    setPage(0); // Reset page or start position
    fetchPosts(0); // Fetch the first page of posts
  }, [feedType]);

  // Function to handle scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.offsetHeight
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchPosts(nextPage * 5); // Fetch next page
          return nextPage;
        });
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle creation of a new post
  const createNewPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  // Handle deletion of a post
  const postDeleted = (_id) => {
    setPosts((prev) => prev.filter((post) => post._id !== _id));
  };

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* Header */}
      <Header feedType={feedType} setFeedType={setFeedType} />

      {/* CREATE POST INPUT */}
      <CreatePost createNewPost={createNewPost} />

      {/* POSTS */}
      <Posts
        posts={posts}
        isLoading={loading} // Corrected to use `loading`
        postDeleted={postDeleted}
      />
      {loading && <p className="text-center">Loading...</p>}
      {!hasMore && <p className="text-center">No more posts to load.</p>}
    </div>
  );
};

export default HomePage;
