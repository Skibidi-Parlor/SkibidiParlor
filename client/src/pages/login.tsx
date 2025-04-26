import { useState } from "react";
import { trpc } from "../api";
import { TRPCClientError } from "@trpc/client";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import Spinner from "../components/ui/Spinner";

const Login = () => {
  ShouldBeLoggedIn(false);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestNickname, setGuestNickname] = useState("");
  const [guestErrorMessage, setGuestErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const userData = await trpc.auth.login.mutate({
        email: email,
        password: password,
      });
      alert("successfully logged in!");

      // temp for testing
      localStorage.setItem("userID", userData.id);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("nickname", userData.nickname);
      if (userData.isAdmin) {
        localStorage.setItem("isAdmin", "true");
      }
      navigate("/games");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        if (error.data?.code === "NOT_FOUND") {
          alert("no user with that email found");
        } else if (error.data?.code === "UNAUTHORIZED") {
          alert("incorrect password");
        } else {
          alert("other tRPC server error: " + error.message);
        }
      } else {
        alert("error logging");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-center w-[90vw] lg:w-[35vw] p-5 items-center bg-white rounded-lg mt-20">
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <h1 className="text-4xl font-bold text-center mt-[1.5rem]">Login</h1>

          <div>
            <p className="text-[1.5rem] font-bold mt-[2rem]">email</p>
            <input
              className="w-full border-b-1 focus:outline-none mt-[0.5rem]"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div>
            <p className="text-[1.5rem] font-bold mt-[1rem]">password</p>
            <input
              className="w-full border-b-1 focus:outline-none mt-[0.5rem]"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div className="flex flex-col justify-center mt-[2rem] gap-3">
            <button
              type="submit"
              className="bg-[#FE7F2D] hover:bg-[#e35a01] text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer text-center"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                "Login"
              )}
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setShowGuestModal(true);
              }}
            >
              Sign in as Guest
            </button>
            <Link
              to="/createAcc"
              className="text-purple-500 text-center text-xs underline"
            >
              Create an Account Here!
            </Link>
            <Link
              to="/forgotPassword"
              className="text-purple-500 text-center text-xs underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
      {showGuestModal && (
        <Modal
          isOpen={showGuestModal}
          onClose={() => {
            setShowGuestModal(false);
          }}
        >
          <div className="text-center flex flex-col">
            <h1 className="text-5xl">Sign in as guest</h1>
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
              className="text-center bg-[#FE7F2D] mx-15 mt-1"
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

export default Login;
