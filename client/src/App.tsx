import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";

import SliceSweeper from "./pages/games/slice_sweeper";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />

      <Route path="games">
        <Route path="SliceSweeper" element={<SliceSweeper />} />
      </Route>
    </Routes>
  );
}

export default App;
