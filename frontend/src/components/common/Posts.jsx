import Post from "./Post";
import PostSkeleton from "../skeletons/PostsSkeleton";
import { v4 as uuidv4 } from "uuid";

const Posts = ({ posts, isLoading, refetch, postDeleted }) => {
  return (
    <>
      {(isLoading || refetch) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} postDeleted={postDeleted} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
