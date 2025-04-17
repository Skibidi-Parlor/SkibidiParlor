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

let TTRooms = {
  123456: {
    host: "Daniel",
    player: "Daniella",
    state: "awaiting game",
    currentPattern: "001",
  },
}; // TTRooms[RoomCode] = {host: nickname, player: nickname, state: 'awaiting game' | 'host-turn' | 'player-turn' | 'end game', currentPattern: '0141314',}

io.on("connection", (socket) => {

  // for leaderboard
  socket.on("leaderboard-update-from-backend", (body) => {
    if (body.response === "Success") {
      const gameID = body.gameID;

      io.emit("leaderboard-update-from-server", { response: "Success", gameID: gameID });
    } else {
      io.emit("leaderboard-update-from-server", { response: "Fail" });
    }
  })
  
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

      io.emit("trivia-questions", {
        response: "closeQuestion",
        roundLeaderboard: triviaRoundLeaderboard,
        overallLeaderboard: triviaOverallLeaderboard,
      });

      triviaQuestionState = "No Question";
    } else if (body.req === "checkTriviaReceived") {
      let users = Array.from(triviaRoomUsers).length;
      let received = `${orderRecieved.length}/${users}`;
      io.emit("trivia-questions", {
        response: "checkTriviaReceived",
        received: received,
        users: orderRecieved.map((obj) => obj[0]),
        roundLeaderboard: triviaRoundLeaderboard,
        overallLeaderboard: triviaOverallLeaderboard,
      });
    } else if (body.req === "sendAnswer") {
      const user = body.user;
      orderRecieved.push([user, body.answer]);
    }
  });

  socket.on("topping-trouble", (body) => {
    if (body.req === "checkStateTT") {
      console.log(body);
      for (const key in TTRooms) {
        if (TTRooms[key].host === body.user) {
          socket.emit("topping-trouble", {
            response: "checkStateTT",
            state: "In Game",
            role: "host",
            code: key,
          });
          return;
        } else if (TTRooms[key].player === body.user) {
          socket.emit("topping-trouble", {
            response: "checkStateTT",
            state: "In Game",
            role: "player",
            code: key,
          });
          return;
        }
      }
      while (true) {
        const rng = Math.floor(100000 + Math.random() * 900000);
        if (rng in Object.keys(TTRooms)) {
          console.log("Making New");
        } else {
          TTRooms[rng] = {
            host: body.user,
            state: "awaiting game",
            currentPattern: "",
          };
          socket.emit("topping-trouble", {
            response: "checkStateTT",
            state: "awaiting game",
            role: "host",
            code: rng,
          });
        }
      }
    }

    triviaRoomUsers.has(body.user);
  });
});
