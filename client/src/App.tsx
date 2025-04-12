import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/home";
import Login from "./pages/login";
import CreateAccount from "./pages/createAccount";
import SliceSweeper from "./pages/games/slice_sweeper";
import TriviaPlayer from "./pages/trivia/player";
import TriviaScreen from "./pages/trivia/screen";
import TriviaAdmin from "./pages/trivia/admin";

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
  // const { data } = useQuery({
  //   queryKey: ["todos"],
  //   queryFn: () => trpc.user.all.query(),
  // });
  // console.log(data);


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
