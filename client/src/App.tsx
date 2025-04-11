import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import CreateAccount from "./pages/createAccount";

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
      <Route path="login" element={<Login />} />
      <Route path="createAcc" element={<CreateAccount />} />

      <Route path="games">
        <Route path="SliceSweeper" element={<SliceSweeper />} />
      </Route>
    </Routes>
  );
}

export default App;
