import { useState } from "react";
import { trpc } from "../api";
import { Link } from "react-router-dom";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState<string>();
  const [disabled, setDisabled] = useState<boolean>(true);


  return (
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-center w-[90vw] lg:w-[35vw] p-5 items-center bg-white rounded-lg mt-20">
        <form className="w-full space-y-5">
          <h1 className="text-4xl font-bold text-center mt-[1.5rem]">Reset Password</h1>
  
          <div>
            <p className="text-[1.5rem] font-bold mt-[2rem]">Email</p>
            <input
              className="w-full border focus:outline-none mt-[0.5rem] p-2"
              type="email"
              required
              value={email}
              placeholder="Email to Send Code"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div className="flex">
            <input
              className="w-full border focus:outline-none mr-[0.5rem] p-2"
              type="email"
              required
              value={code}
              placeholder="Enter 6-Digit Code"
              onChange={(e) => setCode(e.target.value)}
            ></input>
            <button 
              className="bg-[#FE7F2D] hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg"
              onClick={(e) => {
                e.preventDefault();
              }}>Send</button>
          </div>


          <div>
            <p className="text-[1.5rem] font-bold mt-[1rem]">New Password</p>
            <input
              className="w-full border focus:outline-none mt-[0.5rem] p-2"
              type="email"
              required
              disabled={disabled}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
  
          <div className="flex flex-col justify-center mt-[2rem] gap-3 mx-[2rem]">
            <button
              type="button"
              className="bg-[#FE7F2D] hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Change Password
            </button>
            <Link
              to="/login"
              className="text-purple-500 text-center"
            >
              Back to Login
            </Link>
          </div>
        </form>
        </div>
      </div>
    );
};


export default ForgotPassword;
