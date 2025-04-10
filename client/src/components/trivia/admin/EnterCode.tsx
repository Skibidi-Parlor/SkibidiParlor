import { useState } from "react";

interface Params {
  confirmCode: (number: number) => void;
}
const EnterCode = ({ confirmCode }: Params) => {
  const [code, setCode] = useState<number>();
  const [codeMessage, setCodeMessage] = useState("");

  const diplayMessage = (code: number) => {
    if (code != 1738) {
      setCodeMessage("Incorrect Code");
      return;
    }
  };
  return (
    <div className="bg-[#B9C0DA] h-[95vh] flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md">
        <h1 className="text-5xl font-bold text-center text-[#FE7F2D] mb-6">
          Admin Trivia
        </h1>
        <label className="text-lg font-medium mb-2 text-gray-700">
          Enter Access Code:
        </label>
        <span className="text-center text-red-500">{codeMessage}</span>
        <input
          type="number"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FE7F2D] mb-4"
          placeholder="Access Code"
          value={code}
          onChange={(e) => setCode(e.target.value as unknown as number)}
        />
        <button
          className="w-full bg-[#FE7F2D] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#ED6E1C] transition"
          onClick={(e) => {
            e.preventDefault();
            diplayMessage(code!);
            confirmCode(code!);
          }}
        >
          Access Trivia Page
        </button>
      </div>
    </div>
  );
};

export default EnterCode;
