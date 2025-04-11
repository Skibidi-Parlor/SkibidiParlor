const io = require("socket.io")(4000, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://clipr.vercel.app",
      "https://clipr-danielpasions-projects.vercel.app",
      "https://clipr-git-main-danielpasions-projects.vercel.app",
    ],
  },
});

let triviaGameState = "Closed";
let triviaRoomUsers = new Set();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Trivia Game
  socket.on("trivia-status", (body) => {
    if (body.type === "checkGameStatus") {
      socket.broadcast.emit("trivia-status", { response: triviaGameState });
    }
    if (body.type === "setNoGame") {
      triviaGameState = "No Gamed";
      io.emit("trivia-status", { response: triviaGameState });
      console.log("Current Trivia Status: ", triviaGameState);
    } else if (body.type === "setInGame") {
      triviaGameState = "In Game";
      io.emit("trivia-status", { response: triviaGameState });
      console.log("Current Trivia Status: ", triviaGameState);
    }
  });

  socket.on("trivia-room", (body) => {
    if (body.type === "checkRoomUsers") {
      io.emit("trivia-room", { response: Array.from(triviaRoomUsers) });
    }
    if (body.type === "joined") {
      triviaRoomUsers.add(socket.id);
      io.emit("trivia-room", { response: Array.from(triviaRoomUsers) });
      console.log(triviaRoomUsers);
    } else if (body.type === "left") {
      if (triviaRoomUsers.has(socket.id)) {
        triviaRoomUsers.delete(socket.id);
        io.emit("trivia-room", { response: Array.from(triviaRoomUsers) });
      }
    }
  });
});
