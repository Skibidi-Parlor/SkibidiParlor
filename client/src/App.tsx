import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/home";
import Login from "./pages/login";
import Game from "./pages/game"
import CreateAccount from "./pages/createAccount";
import SliceSweeper from "./pages/games/slice_sweeper";
import TriviaPlayer from "./pages/trivia/player";
import TriviaScreen from "./pages/trivia/screen";
import TriviaAdmin from "./pages/trivia/admin";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="games" element={<Game />} />
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
