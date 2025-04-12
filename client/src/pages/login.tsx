import { useState } from "react";
import { trpc } from "../api";
import { TRPCClientError } from '@trpc/client';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userData = await trpc.auth.login.mutate({
        email: email,
        password: password
      });
      alert("successfully logged in!");
      console.log("fetched user ID after logging in: ", userData);

      // temp for testing
      localStorage.setItem('userID', userData.id);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('nickname', userData.nickname);
    } catch (error) {
      console.log("couldnt log in");

      if (error instanceof TRPCClientError) {
        if (error.data?.code === 'NOT_FOUND') {
          alert("no user with that email found");
        } else if (error.data?.code === 'UNAUTHORIZED') {
          alert("incorrect password");
        } else {
          alert("other tRPC server error: " + error.message);
        }
      } else {
        alert("error logging")
        console.log("error:", error);
      }
    }
  }


  return (
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center ">
      <div className="flex flex-col justify-center w-[90vw] lg:w-[35vw] p-5 mt-[2rem] items-center bg-white rounded-lg">

        <form onSubmit={handleLogin} className="w-full space-y-5">
          <h1 className="text-4xl font-bold text-center mt-[1.5rem]">
            Login
          </h1>

          <div>
            <p className="text-[1.5rem] font-bold mt-[2rem]">email</p>
            <input 
              className="w-full border-b-1 focus:outline-none mt-[0.5rem]" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}></input>
          </div>

          <div>
            <p className="text-[1.5rem] font-bold mt-[1rem]">password</p>
            <input 
              className="w-full border-b-1 focus:outline-none mt-[0.5rem]" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}></input>
          </div>

          <div className="flex justify-center mt-[2rem]">
            <button 
              type="submit"
              className="bg-[#FE7F2D] hover:bg-[#e35a01] text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer">Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
