import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/home";
import Login from "./pages/login";
import Game from "./pages/game";
import CreateAccount from "./pages/createAccount";
import SliceSweeper from "./pages/games/slice_sweeper";
import ToppingTrouble from "./pages/games/toppingTrouble";

import TriviaPlayer from "./pages/trivia/player";
import TriviaScreen from "./pages/trivia/screen";
import TriviaAdmin from "./pages/trivia/admin";
import Leaderboard from "./pages/globalLeaderboard";

function App() {
  const [showHeader, setShowHeader] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/createAcc" ||
      location.pathname === "/trivia/screen" ||
      location.pathname === "/trivia/player" ||
      location.pathname === "/games/slicesweeper" ||
      location.pathname === "/games/toppingtrouble"
    ) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location.pathname]);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="games" element={<Game />} />
        <Route path="createAcc" element={<CreateAccount />} />
        <Route path="leaderboard" element={<Leaderboard/>} />

        <Route path="games">
          <Route path="slicesweeper" element={<SliceSweeper />} />
          <Route path="toppingtrouble" element={<ToppingTrouble />} />
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
