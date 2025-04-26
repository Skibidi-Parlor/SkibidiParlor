import { useState } from "react";
import { trpc } from "../api";
import { Link } from "react-router-dom";
import { TRPCClientError } from "@trpc/client";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState<string>();
  const [codeErrorMessage, setCodeErrorMessage] = useState("");
  const [passwordErrorMessage, setpasswordErrorMessage] = useState("");

  const isChangePasswordDisabled = !code?.trim() || !password.trim();


  const changePassword = async() => {
    
    if (!validateInputs()) {
      console.log("errors with user inputs");
      return;
    }



  }

  const validateInputs = () => {
    let valid = true;

    if (!code || code.trim() === "") {
      setCodeErrorMessage("Please enter your reset code");
      valid = false;
    } else if (!/^[0-9]+$/.test(code)) {
      setCodeErrorMessage("Code must only be numbers");
      valid = false;
    } else {
      setCodeErrorMessage("");
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setpasswordErrorMessage(
        "Must be at least 8 characters long, contain 1 uppercase letter, and 1 digit"
      );
      valid = false;
    } else {
      setpasswordErrorMessage("");
    }
    return valid;
  };


  const getResetToken = async() => {

    try {
      const tokenID = await trpc.auth.sendResetToken.query(email);
      alert("NOTHING BROKE");

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
    }
  
  }


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

          <div>
            <div className="flex">
              <input
                className="w-full border focus:outline-none mr-[0.5rem] p-2"
                required
                value={code}
                placeholder="Enter 6-Digit Code"
                onChange={(e) => setCode(e.target.value)}
              ></input>
              <button 
                className="bg-[#FE7F2D] hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  getResetToken();
                }}>Send</button>
            </div>
            <span
              className={`block text-red-600 text-xs font-semibold ml-auto ${
                codeErrorMessage ? "visible" : "invisible"
              }`}
            >{codeErrorMessage}
            </span>
          </div>


          <div>
            <p className="text-[1.5rem] font-bold mt-[1rem]">New Password</p>
            <input
              className="w-full border focus:outline-none mt-[0.5rem] p-2"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>

            <span
              className={`block text-red-600 text-xs font-semibold ml-auto ${
                passwordErrorMessage ? "visible" : "invisible"
              }`}
            >{passwordErrorMessage}
            </span>

          </div>
  
          <div className="flex flex-col justify-center mt-[2rem] gap-3 mx-[2rem]">
            <button
              type="button"
              className={`${isChangePasswordDisabled ? "bg-[#B1551A]" : "bg-[#FE7F2D]" }  hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer`}
              disabled={isChangePasswordDisabled}
              onClick={(e) => {
                e.preventDefault();
                changePassword();
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
