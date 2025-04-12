import { Link } from "react-router-dom";

const home = () => {

  return (
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center ">
      <div className="flex flex-col justify-center w-full p-5 mt-[2rem] items-center rounded-lg gap-y-5">
        <img ></img>
        <div className="bg-[#FE7F2D] hover:bg-[#e35a01] text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer">
          <Link to="./login" className="text-white px-5 py-5">Login</Link>
        </div>

        <div className="bg-[#FE7F2D] hover:bg-[#e35a01] text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer">
          <Link to="./createAcc" className="text-white px-5 py-5">Create Account</Link>
        </div>
      </div>

    </div>

  );
};

export default home;
