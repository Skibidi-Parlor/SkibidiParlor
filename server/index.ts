/**
 * This a minimal tRPC server
 */
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import db from "./db.ts";
import cors from "cors";
import { publicProcedure, router } from "./trpc.ts";

const appRouter = router({
  user: {
    all: publicProcedure.query(async () => {
      const users = await db.query("SELECT * FROM users");
      return users;
    }),
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(3000);
