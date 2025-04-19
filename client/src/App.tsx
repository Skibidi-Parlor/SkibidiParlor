import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/home";
import Login from "./pages/login";
import Game from "./pages/game";
import CreateAccount from "./pages/createAccount";
import CrustConnection from "./pages/games/crustConnection";
import SliceSweeper from "./pages/games/sliceSweeper";
import ToppingTrouble from "./pages/games/toppingTrouble";
import Gatchaza from "./pages/games/gatchaza";
import TriviaPlayer from "./pages/trivia/player";
import TriviaScreen from "./pages/trivia/screen";
import TriviaAdmin from "./pages/trivia/admin";
import Leaderboard from "./pages/globalLeaderboard";
import About from "./pages/about";
import NotFound from "./pages/notFound";
import ToppingDroppings from "./pages/games/toppingDroppings";
import EditAccount from "./pages/editAccount";

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
      location.pathname === "/games/toppingtrouble" ||
      location.pathname === "/games/gatchaza" ||
      location.pathname === "/games/crustconnection" ||
      location.pathname === "/games/toppingdroppings"
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
        <Route path="createAcc" element={<CreateAccount />} />
        <Route path="editAcc" element={<EditAccount />} />
        <Route path="games" element={<Game />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="about" element={<About />} />

        <Route path="games">
          <Route path="slicesweeper" element={<SliceSweeper />} />
          <Route path="crustconnection" element={<CrustConnection />} />
          <Route path="gatchaza" element={<Gatchaza />} />
          <Route path="toppingtrouble" element={<ToppingTrouble />} />
          <Route path="toppingdroppings" element={<ToppingDroppings />} />
        </Route>
        <Route path="trivia">
          <Route path="player" element={<TriviaPlayer />} />
          <Route path="screen" element={<TriviaScreen />} />
          <Route path="admin" element={<TriviaAdmin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
