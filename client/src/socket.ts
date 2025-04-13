import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000"
    : "https://skibidiparlorws.onrender.com";

export const socket = io(URL, {
  query: {
    userId: 1,
  },
});
