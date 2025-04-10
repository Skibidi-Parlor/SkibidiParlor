import { Server, Socket } from "socket.io";
import { UserModel } from "../shared/src/models";

interface ConnectTriviaModel {
  type: "setOpen" | "setInGame" | "setClosed" | "checkGameStatus";
  user?: UserModel;
}

type TriviaGameState = "Closed" | "Open" | "In Game";

const io = new Server(4000, {
  cors: {
    origin: ["*"],
  },
});

let triviaGameState: TriviaGameState = "Closed";

io.on("connection", (socket: Socket) => {
  console.log("Client connected:", socket.id);

  // Trivia Game
  socket.on("connect-trivia", (body: ConnectTriviaModel) => {
    if (body.type === "checkGameStatus") {
      socket.broadcast.emit("connect-trivia", { response: triviaGameState });
    }
    if (body.type === "setOpen") {
      triviaGameState = "Open";
    } else if (body.type === "setInGame") {
      triviaGameState = "In Game";
    } else if (body.type === "setClosed") {
      triviaGameState = "Closed";
    }
    // Send the received body to others (if you still want that)
    socket.broadcast.emit("receive-message", body);
  });
});
