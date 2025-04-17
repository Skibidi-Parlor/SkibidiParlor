/**
 * This a minimal tRPC server
 */
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { router } from "./trpc.ts";
import { authRouter } from "./routers/auth.ts";
import { userRouter } from "./routers/user.ts";
import { leaderboardRouter } from "./routers/leaderboard.ts";

const appRouter = router({
  user: userRouter,
  auth: authRouter,
  leaderboard: leaderboardRouter
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(3000);

console.log("running...");
