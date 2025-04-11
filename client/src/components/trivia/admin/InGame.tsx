import OpenAI from "openai";

interface Params {
  topic: string;
  endGame: () => void;
}
const InGame = ({ topic, endGame }: Params) => {
  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI,
    dangerouslyAllowBrowser: true,
  });
  const createQuestion = async () => {
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `You are going to be used for a pizza parlor's trivia night.
                    You will be given a prompt and you are to generate a JSON of 6 keys.
                    The first key is 'question' and will be a randomly generated trivia question about the topic you are given.
                    The next 4 keys will be 'A', 'B', 'C', and 'D'. They will generate 4 possible responses to the previously created trivia question but ONLY ONE OF THEM WILL BE RIGHT.
                    The last key will be 'answer' and is the Capitalized Letter of the correct option.
                    With that being said, the prompt is ${topic}.
                    `,
    });
    console.log(response.output_text);
  };
  return (
    <div className="bg-[#B9C0DA] h-[95vh] flex flex-col items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md">
        <h1 className="text-5xl font-bold text-center text-[#FE7F2D] mb-6">
          Game Started!
        </h1>
        <h2>Topic: {topic}</h2>
        <button
          className="w-full bg-[#FE7F2D] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#ED6E1C] transition"
          onClick={(e) => {
            e.preventDefault();
            endGame();
          }}
        >
          End Game
        </button>
      </div>
      <h2>Participants</h2>
    </div>
  );
};

export default InGame;
