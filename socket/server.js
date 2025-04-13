const io = require("socket.io")(4000, {
  cors: {
    origin: "*",
  },
});

let triviaGameState = "No Game"; // In Game, No Game
let triviaQuestionState = "No Question"; // In Question, No Question
let currentQuestionData = {}; // {question: string, A: string, B: string, C: string, D: string, answer: 'A' | 'B' | 'C' | 'D'}

let triviaRoundLeaderboard = {}; // {user.name: number}
let triviaOverallLeaderboard = {}; //{ user.name: number}
let triviaRoomUsers = new Set(); // (user1,user2,user3)
let orderRecieved = []; // [user1,user2,user3]

io.on("connection", (socket) => {
  // Trivia Status Check
  socket.on("trivia-status", (body) => {
    if (body.req === "checkGameStatus") {
      io.emit("trivia-status", { response: triviaGameState });
    }
    if (body.req === "setNoGame") {
      triviaGameState = "No Game";
      triviaQuestionState = "No Question";
      currentQuestionData = {};
      triviaRoundLeaderboard = {};
      triviaOverallLeaderboard = {};
      triviaRoomUsers = new Set();
      orderRecieved = [];
      io.emit("trivia-status", {
        response: triviaGameState,
        users: Array.from(triviaRoomUsers),
      });
    } else if (body.req === "setInGame") {
      triviaGameState = "In Game";
      const users = Array.from(triviaRoomUsers);
      for (const user of users) {
        triviaOverallLeaderboard[user] = 0;
      }
      io.emit("trivia-status", {
        response: triviaGameState,
        overallLeaderboard: triviaOverallLeaderboard,
      });
    }
  });

  //Trivia Player Room Check
  socket.on("trivia-room", (body) => {
    if (body.req === "checkRoomUsers") {
      io.emit("trivia-room", {
        response: "checkRoomUsers",
        users: Array.from(triviaRoomUsers),
      });
    } else if (body.req === "joined") {
      triviaRoomUsers.add(body.user);
      io.emit("trivia-room", {
        response: "joined",
        users: Array.from(triviaRoomUsers),
      });
    } else if (body.req === "left") {
      if (triviaRoomUsers.has(body.user)) {
        triviaRoomUsers.delete(body.user);
        io.emit("trivia-room", {
          response: "left",
          users: Array.from(triviaRoomUsers),
        });
      }
    }
  });

  //Trivia Check
  socket.on("trivia-questions", (body) => {
    if (body.req === "checkQuestionState") {
      io.emit("trivia-questions", {
        response: triviaQuestionState,
        data: currentQuestionData,
        roundLeaderboard: triviaRoundLeaderboard,
        overallLeaderboard: triviaOverallLeaderboard,
      });
    }
    if (body.req === "setQuestion") {
      triviaQuestionState = "In Question";
      currentQuestionData = body.data;
      triviaRoundLeaderboard = {};
      orderRecieved = [];

      io.emit("trivia-questions", {
        response: "setQuestion",
        data: currentQuestionData,
        remaining: "0/" + orderRecieved.length,
      });
    } else if (body.req === "closeQuestion") {
      let initialScore = Array.from(triviaRoomUsers).length;

      for (const dict of orderRecieved) {
        console.log(dict[1], currentQuestionData.answer);
        if (dict[1] === currentQuestionData.answer) {
          triviaRoundLeaderboard[dict[0]] = initialScore;
          triviaOverallLeaderboard[dict[0]] =
            triviaOverallLeaderboard[dict[0]] + initialScore;
          initialScore -= 1;
        }
      }

      const sortedOverallLeaderboard = Object.fromEntries(
        Object.entries(triviaOverallLeaderboard).sort(([, a], [, b]) => b - a)
      );

      triviaOverallLeaderboard = sortedOverallLeaderboard;
      console.log(triviaOverallLeaderboard);

      io.emit("trivia-questions", {
        response: "closeQuestion",
        roundLeaderboard: triviaRoundLeaderboard,
        overallLeaderboard: triviaOverallLeaderboard,
      });

      triviaQuestionState = "No Question";
      currentQuestionData = {};
    } else if (body.req === "checkTriviaReceived") {
      let users = Array.from(triviaRoomUsers).length;
      let received = `${orderRecieved.length}/${users}`;
      io.emit("trivia-questions", {
        response: "checkTriviaReceived",
        received: received,
        users: orderRecieved.map((obj) => obj[0]),
      });
    } else if (body.req === "sendAnswer") {
      const user = body.user;
      orderRecieved.push([user, body.answer]);
    }
  });
});
