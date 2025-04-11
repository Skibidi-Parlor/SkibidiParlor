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

let triviaGameState = "No Game";
let triviaRoomUsers = new Set();
let triviaQuestionState = "No Question";
let currentQuestionData = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Trivia Status Check
  socket.on("trivia-status", (body) => {
    if (body.req === "checkGameStatus") {
      console.log("checkGameStatus pinged with value: ", triviaGameState);
      io.emit("trivia-status", { response: triviaGameState });
    }
    if (body.req === "setNoGame") {
      triviaGameState = "No Game";
      io.emit("trivia-status", { response: triviaGameState });
      console.log("setNoGame pinged, game state is now: ", triviaGameState);
    } else if (body.req === "setInGame") {
      triviaGameState = "In Game";
      io.emit("trivia-status", { response: triviaGameState });
      console.log(
        "triviaGameState pinged, game state is now: : ",
        triviaGameState
      );
    } else if (body.req === "displayQuestion") {
    } else if (body.req === "closeQuestion") {
    }
  });

  //Trivia Player Room Check
  socket.on("trivia-room", (body) => {
    if (body.req === "checkRoomUsers") {
      io.emit("trivia-room", { response: Array.from(triviaRoomUsers) });
      console.log(
        "checkRoomUsers pinged, current users in the room are: : ",
        triviaRoomUsers
      );
    } else if (body.req === "joined") {
      triviaRoomUsers.add(socket.id);
      io.emit("trivia-room", { response: Array.from(triviaRoomUsers) });
      console.log("joined just triggerd, user that joined is: ", socket.id);
    } else if (body.req === "left") {
      if (triviaRoomUsers.has(socket.id)) {
        triviaRoomUsers.delete(socket.id);
        io.emit("trivia-room", { response: Array.from(triviaRoomUsers) });
        console.log("left just triggered, user that left is: ", socket.id);
      }
    }
  });

  //Trivia Check
  socket.on("trivia-questions", (body) => {
    if (body.req === "checkQuestionState") {
      io.emit("trivia-questions", {
        response: triviaQuestionState,
        data: currentQuestionData,
      });
      console.log(
        "checkQuestionState triggered, current state is:",
        triviaQuestionState,
        "and current question (if there is one) is: ",
        currentQuestionData
      );
    }
    if (body.req === "setQuestion") {
      triviaQuestionState = "In Question";
      currentQuestionData = body.data;
      console.log(
        "setQUestion triggered, just set question data: ",
        currentQuestionData
      );
      io.emit("trivia-questions", {
        response: "setQuestion",
        data: currentQuestionData,
      });
    } else if (body.req === "closeQuestion") {
      triviaQuestionState = "No Question";
      currentQuestionData = {};
      console.log(
        "close Question triggered, just closed the trivia for: ",
        currentQuestionData
      );
      io.emit("trivia-questions", {
        response: "closeQuestion",
      });
    } else if (body.req === "sendAnswer") {
    }
  });
});
