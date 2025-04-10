import { Routes, Route } from "react-router-dom";
import { trpc } from "./api";

import Header from "./components/Header";

import Home from "./pages/home";
import Login from "./pages/login";

import SliceSweeper from "./pages/games/slice_sweeper";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: () => trpc.user.all.query(),
  });
  console.log(data);

  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route path="games">
          <Route path="SliceSweeper" element={<SliceSweeper />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
