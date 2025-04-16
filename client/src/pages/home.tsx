
import { Link, useNavigate } from "react-router-dom";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import { useState } from "react";
import Modal from "../components/ui/Modal";

const home = () => {
  ShouldBeLoggedIn(false);
  const navigate = useNavigate();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestNickname, setGuestNickname] = useState("");
  const [guestErrorMessage, setGuestErrorMessage] = useState("");

  return (
    <div className="bg-linear-to-b from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-center w-full p-5 mt-[2rem] items-center rounded-lg gap-y-5 my-auto">
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

        <div
          className="bg-white hover:bg-[#e35a01] font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointe text-[#3D1C77]"
          onClick={() => setShowGuestModal(true)}
        >
          Play as Guest
        </div>
      </div>
      {showGuestModal && (
        <Modal
          isOpen={showGuestModal}
          onClose={() => {
            setShowGuestModal(false);
          }}
        >
          <div className="text-center flex flex-col">
            <h1 className="text-7xl">Sign in as guest</h1>
            <h2>
              Note: By playing as a guest, you will NOT be able to keep track of
              your all time leaderboards
            </h2>
            <input
              value={guestNickname}
              placeholder="Enter Nickname"
              className="text-center bg-gray-300 mx-15"
              onChange={(e) => {
                setGuestNickname(e.target.value);
              }}
            ></input>
            <span className="text-red-500">{guestErrorMessage}</span>
            <button
              className="text-center bg-[#7134DD] mx-15 mt-1"
              onClick={() => {
                if (guestNickname === "") {
                  setGuestErrorMessage("*Must enter a username");
                }
                localStorage.clear();
                localStorage.setItem("nickname", guestNickname);
                navigate("/games");
              }}
            >
              Sign In
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
