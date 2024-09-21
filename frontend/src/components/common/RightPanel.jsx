import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useEffect, useState } from "react";
import axios from "axios";
import pp from "../../assets/images/pp.jpg";

const RightPanel = () => {
  const [suggestUser, setSuggestUser] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [buttonTexts, setButtonTexts] = useState({});
  useEffect(() => {
    const fetchSuggestUser = async () => {
      try {
        const response = await axios.get("/api/user/suggest");
        setSuggestUser(response.data);
        setIsloading(false);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchSuggestUser();
  }, []);
  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Suggest User</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestUser &&
            suggestUser.map((user) => (
              <Link
                to={`/profile/${user.userName}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || pp} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.userName}
                    </span>
                  </div>
                </div>
                <div>
                  <button className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm">
                    View Profile
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
    // <></>
  );
};
export default RightPanel;
