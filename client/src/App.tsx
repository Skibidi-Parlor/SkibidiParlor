import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";

import SliceSweeper from "./pages/games/slice_sweeper";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "./api";

function App() {
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
