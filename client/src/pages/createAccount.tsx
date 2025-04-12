import { useState } from "react";
import { trpc } from "../api";

const CreateAccount = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");

  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setpasswordErrorMessage] = useState("");

  const createAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      console.log("errors with user inputs");
      return;
    }

    try {
      const newUser = await trpc.user.create.mutate({
        username: username,
        nickname: nickname,
        email: email,
        password: password,
        pfp_path: "https://avatars.pfptown.com/202/lebron-pfp-5200.png"
      });
      alert("successfully created new user!");
      console.log("created user: ", newUser.rows[0].id);
      
    } catch (error) {
      console.log("unable to create new user: ", error)
    }
  }

  const validateInputs = () => {
    let valid = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailErrorMessage("Must be a valid email address");
      valid = false;
    }

    if (username.length < 3) {
      setUsernameErrorMessage("Must be at least 3 characters long");
      valid = false;
    }

    if (password != password2) {
      setpasswordErrorMessage("Passwords don't match!");
      valid = false;
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setpasswordErrorMessage(
        "Must be at least 8 characters long, contain 1 uppercase letter, and 1 digit"
      );
      valid = false;
    }
    return valid;
  };

  const onUsernameChange = (usernameText: string) => {
    setUsername(usernameText);
    setUsernameErrorMessage("");
  };

  const onEmailChange = (emailText: string) => {
    setEmail(emailText);
    setEmailErrorMessage("");
  };

  const onPasswordChange = (passwordText: string) => {
    setPassword(passwordText);
    setpasswordErrorMessage("");
  };

  const onPassword2Change = (passwordText: string) => {
    setPassword2(passwordText);
    setpasswordErrorMessage("");
  };


  return(
  <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center ">
    <div className="flex flex-col justify-center w-[90vw] lg:w-[35vw] p-5 mt-[2rem] items-center bg-white rounded-lg">

      <form onSubmit={createAccount} className="w-full space-y-5">

        <h1 className="text-4xl font-bold text-center mt-[1.5rem]">
          Create Account
        </h1>

        <div>
          <p className="text-[1.5rem] font-bold mt-[2rem]">email</p>
          <input 
            className="w-full border-b-1 focus:outline-none mt-[0.5rem]" 
            type="email" 
            required
            onChange={(e) => onEmailChange(e.target.value)}></input>
          <span className={`block text-red-600 text-xs font-semibold ml-auto 
            ${emailErrorMessage ? "visible" : "invisible"}`}>{emailErrorMessage}
          </span>
        </div>

        <div>
          <p className="text-[1.5rem] font-bold mt-[1rem]">password</p>
          <input 
            className="w-full border-b-1 focus:outline-none mt-[0.5rem]" 
            type="password" 
            required
            onChange={(e) => onPasswordChange(e.target.value)}></input>
        </div>

        <div>
          <p className="text-[1.5rem] font-bold mt-[1rem]">re-enter password</p>
          <input 
            className="w-full border-b-1 focus:outline-none mt-[0.5rem]" 
            type="password" 
            required
            onChange={(e) => onPassword2Change(e.target.value)}></input>
          <span className={`block text-red-600 text-xs font-semibold ml-auto ${
            passwordErrorMessage ? "visible" : "invisible"}`}>{passwordErrorMessage}
          </span>
        </div>

        <div>
          <p className="text-[1.5rem] font-bold mt-[1rem]">username</p>
          <input 
            className="w-full border-b-1 focus:outline-none mt-[0.5rem]" 
            required 
            onChange={(e) => onUsernameChange(e.target.value)}></input>
          <span className={`block text-red-600 text-xs font-semibold ml-auto 
            ${usernameErrorMessage ? "visible" : "invisible"}`}>{usernameErrorMessage}
          </span>
        </div>

        <div>
          <p className="text-[1.5rem] font-bold mt-[1rem]">nickname</p>
          <input 
            className="w-full border-b-1 focus:outline-none mt-[0.5rem]"
            onChange={(e) => setNickname(e.target.value)}></input>
        </div>

        <div className="flex justify-center mt-[2rem]">
          <button 
            type="submit"
            className="bg-[#FE7F2D] hover:bg-[#e35a01] text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer">Create
          </button>
        </div>
      </form>
    </div>
  </div>);
};

export default CreateAccount;