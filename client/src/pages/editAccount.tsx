import { useEffect, useState } from "react";
import { trpc } from "../api";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "../components/ui/Spinner";
import { UserModel } from "../../shared/src/models";

const EditAccount = () => {
  ShouldBeLoggedIn(true);

  const [user, setUser] = useState<UserModel>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");

  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setpasswordErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const pfps = [
    "https://i.etsystatic.com/40533556/r/il/fa1960/5548177526/il_fullxfull.5548177526_ht4r.jpg",
    "https://i.etsystatic.com/27713397/r/il/b82145/4266698419/il_fullxfull.4266698419_7xfm.jpg",
    "https://static.vecteezy.com/system/resources/previews/043/415/203/non_2x/cartoon-hamburger-vintage-fast-food-mascot-1930s-style-illustration-vector.jpg",
    "https://thumbs.dreamstime.com/z/cute-cartoon-french-fries-big-eyes-generative-ai-274942939.jpg",
    "https://img.stablecog.com/insecure/1920w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vYmFiMjVhZTItMDJjMy00N2VmLTg5YTUtNDYwMTQxNDIyNzhmLmpwZWc.webp",
  ];
  const [pfpIndex, setPfpIndex] = useState<number>(0);
  const [ogPFP, setOgPFP] = useState<string>();

  useEffect(() => {
    const getUser = async () => {
      const user = await trpc.user.byID.query(
        Number(localStorage.getItem("userID"))
      );

      setUser(user.rows[0]);
      setOgPFP(user.rows[0].pfp_path);
    };
    getUser();
  }, []);

  useEffect(() => {
    const pfps2 = [
      "https://i.etsystatic.com/40533556/r/il/fa1960/5548177526/il_fullxfull.5548177526_ht4r.jpg",
      "https://i.etsystatic.com/27713397/r/il/b82145/4266698419/il_fullxfull.4266698419_7xfm.jpg",
      "https://static.vecteezy.com/system/resources/previews/043/415/203/non_2x/cartoon-hamburger-vintage-fast-food-mascot-1930s-style-illustration-vector.jpg",
      "https://thumbs.dreamstime.com/z/cute-cartoon-french-fries-big-eyes-generative-ai-274942939.jpg",
      "https://img.stablecog.com/insecure/1920w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vYmFiMjVhZTItMDJjMy00N2VmLTg5YTUtNDYwMTQxNDIyNzhmLmpwZWc.webp",
    ];
    if (user && user.email && user.username && user.nickname && user.pfp_path) {
      setEmail(user?.email);
      setUsername(user?.username);
      setNickname(user?.nickname);
      setPfpIndex(pfps2.indexOf(user.pfp_path));
    }
  }, [user]);

  const updateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      console.log("errors with user inputs");
      return;
    }

    try {
      setIsLoading(true);

      if (email !== user?.email) {
        const checkAccountRes = await trpc.user.byEmail.query(email);
        if (checkAccountRes.rows.length > 0) {
          alert("Account associated with that email already exists!");
          throw new Error("email  already exists");
        }
      }

      if (username !== user?.username) {
        const checkAccountRes = await trpc.user.byUsername.query(username);
        if (checkAccountRes.rows.length > 0) {
          alert("Account associated with that username already exists!");
          throw new Error("username already exists");
        }
      }

      const updatedUser = await trpc.user.update.mutate({
        id: user!.id,
        username: username,
        nickname: nickname,
        email: email,
        pfp_path: pfps[pfpIndex],
        ...(password && { password: password }),
      });
      alert("successfully updated new user!");

      localStorage.setItem("userID", updatedUser.rows[0].id);
      localStorage.setItem("email", updatedUser.rows[0].email);
      localStorage.setItem("username", updatedUser.rows[0].username);
      localStorage.setItem("nickname", updatedUser.rows[0].nickname);
    } catch (error) {
      console.log("unable to create new user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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

    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) && password) {
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

  return (
    <div className="bg-linear-to-b h-screen from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-start w-[90vw] lg:w-[35vw] max-h-[90vh] p-5 items-center bg-white rounded-lg overflow-y-auto my-5 mt-15">
        <form onSubmit={updateAccount} className="w-full space-y-5">
          <h1 className="text-4xl font-bold text-center mt-1">Edit Profile</h1>
          <img
            src={ogPFP ? ogPFP : pfps[pfpIndex]}
            className="rounded-full border-1 w-[20vw] h-[20vw] mx-auto"
          ></img>
          <div className="flex justify-center items-center gap-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => {
                if (pfpIndex === 0) {
                  setOgPFP(undefined);
                  setPfpIndex(pfps.length - 1);
                } else {
                  setOgPFP(undefined);
                  setPfpIndex((prev) => prev - 1);
                }
              }}
            />
            <FontAwesomeIcon
              icon={faArrowRight}
              onClick={() => {
                setOgPFP(undefined);
                if (pfpIndex === pfps.length - 1) {
                  setOgPFP(undefined);
                  setPfpIndex(0);
                } else {
                  setOgPFP(undefined);

                  setPfpIndex((prev) => prev + 1);
                }
              }}
            />
          </div>
          <div>
            <p className="text-[1.5rem] font-bold mt-1">email</p>
            <input
              className="w-full border-b-1 focus:outline-none mt-1"
              type="email"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            ></input>
            <span
              className={`block text-red-600 text-xs font-semibold ml-auto 
            ${emailErrorMessage ? "visible" : "invisible"}`}
            >
              {emailErrorMessage}
            </span>
          </div>

          <div>
            <p className="text-[1.5rem] font-bold mt-[1rem]">password</p>
            <input
              className="w-full border-b-1 focus:outline-none mt-1"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            ></input>
          </div>

          <div>
            <span
              className={`block text-red-600 text-xs font-semibold ml-auto ${
                passwordErrorMessage ? "visible" : "invisible"
              }`}
            >
              {passwordErrorMessage}
            </span>
          </div>

          <div>
            <p className="text-[1.5rem] font-bold mt-[1rem]">username</p>
            <input
              className="w-full border-b-1 focus:outline-none mt-1"
              required
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
            ></input>
            <span
              className={`block text-red-600 text-xs font-semibold ml-auto 
            ${usernameErrorMessage ? "visible" : "invisible"}`}
            >
              {usernameErrorMessage}
            </span>
          </div>

          <div>
            <p className="text-[1.5rem] font-bold mt-[1rem]">nickname</p>
            <input
              className="w-full border-b-1 focus:outline-none mt-1"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            ></input>
          </div>

          <div className="flex flex-col justify-center mt-1">
            <button
              type="submit"
              className="bg-[#FE7F2D] hover:bg-[#e35a01] text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                "Update Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccount;
