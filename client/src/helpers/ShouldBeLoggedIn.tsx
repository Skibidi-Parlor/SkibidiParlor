import { useNavigate } from "react-router-dom";

const ShouldBeLoggedIn = (shouldBeLoggedIn: boolean) => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem("nickname") ? true : false;
  if (loggedIn != shouldBeLoggedIn) {
    if (loggedIn) {
      navigate("/games");
    } else {
      navigate("/");
    }
  }
};

export default ShouldBeLoggedIn;
