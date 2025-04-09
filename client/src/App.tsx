import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";

import SliceSweeper from "./pages/games/slice_sweeper";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "./api";

function App() {
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: () => trpc.user.all.query(),
  });
  console.log(data);
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route path="games">
        <Route path="SliceSweeper" element={<SliceSweeper />} />
      </Route>
    </Routes>
  );
}

export default App;
