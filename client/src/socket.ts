import { io } from "socket.io-client";

const URL = `http://localhost:5173`;
// const URL = `https://cliprwebsocket.onrender.com`;

export const socket = io(URL, {
  query: {
    userId: 1,
  },
});
