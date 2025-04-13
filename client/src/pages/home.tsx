import { Link } from "react-router-dom";

const home = () => {
  return (
    <div className="bg-linear-to-b from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center ">
      <div className="flex flex-col justify-center w-full p-5 mt-[2rem] items-center rounded-lg gap-y-5">
        <img src="./HomeMiniLogo.png" className="h-15 w-auto"></img>
        <h1 className="text-5xl text-white">Skibidi Parlor</h1>
        <img src="./HomeLogo.png" className="h-50 w-auto"></img>
        <div className="bg-white hover:bg-[#e35a01] font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer">
          <Link to="./login" className="text-[#3D1C77] px-5 py-5">
            Login
          </Link>
        </div>

        <div className="bg-white hover:bg-[#e35a01] font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer">
          <Link to="./createAcc" className="text-[#3D1C77] px-5 py-5">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default home;
