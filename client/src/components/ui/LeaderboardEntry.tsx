import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LeaderboardEntry(props: {
  id: number;
  placing: number;
  username: string;
  points: number;
  pfp_path: string;
}) {
  // const id = props.id; // to be used later if we want users to click on a player to view their profile
  const placing = props.placing;
  const username = props.username;
  const points = props.points;
  const user_pfp = props.pfp_path;

  let backgroundColor = "";
  if (placing === 1) {
    backgroundColor = "bg-yellow-400";
  } else if (placing === 2) {
    backgroundColor = "bg-gray-400";
  } else if (placing === 3) {
    backgroundColor = "bg-amber-600";
  } else {
    backgroundColor = "bg-[#E0E7FE]";
  }

  return (
    <div
      className={`flex w-full px-4 py-3 border border-white shadow-xl rounded-2xl ${backgroundColor}`}
    >
      <div className="flex flex-col justify-center items-center text-2xl">
        {placing}
      </div>

      <img
        src={user_pfp}
        className={"w-10 h-10 lg:w-12 lg:h-12 rounded-full ml-3 mr-2"}
      ></img>

      {localStorage.getItem("username") === username && (
        <FontAwesomeIcon icon={faStar} className="my-auto text-orange-500" />
      )}
      <div
        className={`flex flex-col w-9/12 mr-2 justify-center px-2 text-lg lg:text-xl`}
      >
        {username}
      </div>

      <div className="flex flex-col justify-center text-center text-lg lg:text-xl">
        {points}
      </div>
    </div>
  );
}

export { LeaderboardEntry };
