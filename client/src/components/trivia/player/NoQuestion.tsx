import { LeaderboardModel, QuestionModel } from "../../../../shared/src/models";

interface Params {
  overallLeaderboard: LeaderboardModel | undefined;
  roundLeaderboard: LeaderboardModel | undefined;
  question: QuestionModel | undefined;
}

const NoQuestion = ({
  overallLeaderboard,
  roundLeaderboard,
  question,
}: Params) => {
  const nickname = localStorage.getItem("nickname");
  if (overallLeaderboard && nickname) {
    const order = Object.keys(overallLeaderboard).findIndex(
      (key) => key === nickname
    );
    console.log(order);
  }

  const ordinal_suffix_of = (i: number) => {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md max-h-[85vh] text-white text-center border-3 ${
          roundLeaderboard && roundLeaderboard[nickname!]
            ? "bg-[#2dcc62]"
            : "bg-[#eb5449]"
        } `}
      >
        <div className="flex flex-col">
          <h1 className="text-6xl">
            {roundLeaderboard && roundLeaderboard[nickname!]
              ? "Correct!"
              : "Womp Womp :("}
          </h1>
          {question && (
            <h2>
              The correct answer was:{" "}
              {`(${question.answer}) ${
                question[question.answer as "A" | "B" | "C" | "D"]
              }`}
            </h2>
          )}
          {roundLeaderboard ? (
            <div className="mt-10">
              Your Score from last round:{" "}
              {roundLeaderboard[nickname!] ? roundLeaderboard[nickname!] : "0"}
            </div>
          ) : (
            <div>Selecting a Question...</div>
          )}
          {overallLeaderboard && (
            <div className="flex flex-col text-lg">
              You are currently in {ordinal_suffix_of(1)} place with{" "}
              {overallLeaderboard[nickname!]} point(s)
            </div>
          )}
        </div>
      </div>
      <img
        className="w-[50vw] h-auto"
        src={
          !roundLeaderboard![nickname!]
            ? "/trivia/SadPizza.gif"
            : "/trivia/DancingPizza.gif"
        }
      ></img>
    </div>
  );
};

export default NoQuestion;
