import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/home";
import Login from "./pages/login";
import CreateAccount from "./pages/createAccount";
import SliceSweeper from "./pages/games/slice_sweeper";
import TriviaPlayer from "./pages/trivia/player";
import TriviaScreen from "./pages/trivia/screen";
import TriviaAdmin from "./pages/trivia/admin";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "./api";

function App() {
  // testing user.byID
  const lebron = async() => {
    try {
      const userInfo = await trpc.user.byID.query(1);
      console.log("fetched user data for user with id: 1")
      console.log(userInfo.rows[0]);
    } catch (error) {
      console.log("unable to fetch user data: ", error)
    }
  }
  // lebron();
  
  // testing user.all
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: () => trpc.user.all.query(),
  });
  console.log(data);

  // testing user.create
  const skibidi = async () => {
    try {
      const newUser = await trpc.user.create.mutate({
        username: "Mark S",
        nickname: "Outie Mark",
        email: "ihatemylife@gmail.com",
        password: "ilovemywife",
        pfp_path: "https://random.image/img3.jpg"
      });
      console.log("created user: ", newUser);
    } catch (error) {
      console.log("unable to create new user: ", error)
    }
  }
  // skibidi();

  // test user.login
  const yuhh = async() => {
    try {
      const userID = await trpc.auth.login.mutate({
        email: "ihatemylife@gmail.com",
        password: "ilovemywife"
      });
      console.log("fetched user ID after logging in: ", userID);
    } catch (error) {
      console.log("couldnt log in", error);
    }
  }

  // yuhh();

  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="createAcc" element={<CreateAccount />} />

        <Route path="games">
          <Route path="SliceSweeper" element={<SliceSweeper />} />
        </Route>
        <Route path="trivia">
          <Route path="player" element={<TriviaPlayer />} />
          <Route path="screen" element={<TriviaScreen />} />
          <Route path="admin" element={<TriviaAdmin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
