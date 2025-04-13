import { useState } from "react";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <header className="absolute flex justify-center bg-[#050517] w-full h-[5vh] z-2">
        {showMenu ? (
          <FontAwesomeIcon
            icon={faX}
            className="text-[#B9C0DA] my-auto mr-auto ml-3"
            onClick={() => {
              setShowMenu(false);
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faBars}
            className="text-[#B9C0DA] my-auto mr-auto ml-3"
            onClick={() => {
              setShowMenu(true);
            }}
          />
        )}
        <Link
          to="/"
          className="text-[#B9C0DA] text-3xl"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          SkibidiParlor
        </Link>
        <div className="flex flex-col text-[#B9C0DA] text-xs text-center my-auto ml-auto mr-3 ">
          <h2>Score: </h2>
          <h2>0</h2>
        </div>
      </header>
      {/* Sidebar */}
      <div
        className="absolute flex flex-col justify-start bg-[#050517] h-full w-[60vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[20vw] transition-all duration-500 z-1"
        style={{ transform: showMenu ? `translate(0)` : `translate(-60vw)` }}
      >
        <Link
          to="/games"
          className="text-[#B9C0DA] mt-10 ml-3 text-2xl"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          Games
        </Link>
        <Link
          to="/trivia/player"
          className="text-[#B9C0DA] mt-1 ml-3 text-2xl"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          Trivia Night
        </Link>
        <Link
          to="/profile"
          className="text-[#B9C0DA] mt-1 ml-3 text-2xl"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          Profile
        </Link>
        <Link
          to="/leaderboard"
          className="text-[#B9C0DA] mt-1 ml-3 text-2xl"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          LeaderBoard
        </Link>
        <div className="flex flex-col mt-auto ml-3 mb-3">
          <hr className="text-[#B9C0DA] mr-3" />
          <Link
            to="/about"
            className="text-[#B9C0DA] mt-1 text-2xl"
            onClick={() => {
              setShowMenu(false);
              localStorage.clear();
            }}
          >
            About
          </Link>
          <Link
            to="/"
            className="text-[#B9C0DA] mt-1 text-2xl"
            onClick={() => {
              setShowMenu(false);
              localStorage.clear();
            }}
          >
            Sign Out
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
