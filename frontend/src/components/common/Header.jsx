import React from "react";

export default function Header({ feedType, setFeedType }) {
  return (
    <div>
      <div className="flex w-full border-b border-gray-700">
        <div
          className={
            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
          }
          onClick={() => setFeedType("forYou")}
        >
          For you
          {feedType === "forYou" && (
            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
          )}
        </div>
        <div
          className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
          onClick={() => setFeedType("following")}
        >
          Following
          {feedType === "following" && (
            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
          )}
        </div>
      </div>
    </div>
  );
}
