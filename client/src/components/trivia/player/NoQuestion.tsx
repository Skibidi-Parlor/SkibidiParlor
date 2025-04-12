import { LeaderboardModel } from "../../../../../shared/src/models";

interface Params {
  overallLeaderboard: LeaderboardModel | undefined;
  roundLeaderboard: LeaderboardModel | undefined;
}

const NoQuestion = ({ overallLeaderboard, roundLeaderboard }: Params) => {
  console.log(overallLeaderboard, roundLeaderboard);
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md max-h-[85vh] overflow-scroll">
      <h1>Recap</h1>
      {roundLeaderboard && (
        <div>
          Your Score from last round:{" "}
          {roundLeaderboard[localStorage.getItem("nickname")!]}
        </div>
      )}
      <div className="flex flex-col">
        {roundLeaderboard && (
          <div className="bg-white p-4">
            <h1>Round Leaderboard:</h1>
            {Object.entries(roundLeaderboard).map(([key, value], index) => (
              <div key={key}>
                {index + 1}. {key}: {value}
              </div>
            ))}
          </div>
        )}
        {overallLeaderboard && (
          <div className="bg-white p-4">
            <h1>Session Leaderboard:</h1>
            {Object.entries(overallLeaderboard).map(([key, value], index) => (
              <div key={key}>
                {index + 1}. {key}: {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoQuestion;
