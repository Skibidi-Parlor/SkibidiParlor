import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShouldBeLoggedIn = (shouldBeLoggedIn: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("nickname") ? true : false;
    if (loggedIn != shouldBeLoggedIn) {
      console.log(loggedIn);
      if (loggedIn) {
        navigate("/games");
      } else {
        navigate("/");
      }
    }
  });
};

export default ShouldBeLoggedIn;
