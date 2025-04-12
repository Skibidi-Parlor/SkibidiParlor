import { LeaderboardModel } from "../../../../../shared/src/models";

interface Params {
  overallLeaderboard: LeaderboardModel | undefined;
  roundLeaderboard: LeaderboardModel | undefined;
}

const NoQuestion = ({ overallLeaderboard, roundLeaderboard }: Params) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md max-h-[85vh] overflow-scroll">
      Your Score: tbd
    </div>
  );
};

export default NoQuestion;
