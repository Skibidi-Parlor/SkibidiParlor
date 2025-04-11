/**
 * This a minimal tRPC server
 */
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import db from "./db.ts";
import cors from "cors";
import { publicProcedure, router } from "./trpc.ts";
import { z } from 'zod';
import bcrypt from 'bcrypt';

const appRouter = router({
  user: {
    all: publicProcedure.query(async () => {
      const users = await db.query("SELECT * FROM user_account");
      return users.rows;
    }),

    create: publicProcedure
        .input(
          z.object({ 
            username: z.string(),
            nickname: z.string(),
            email: z.string(),
            password: z.string(),
            pfp_path: z.string()
          })
        )
        .mutation(async (opts) => {
          const { username, nickname, email, password, pfp_path } = opts.input;

          // if pfp_path not provided, use a default pfp lmaoo: https://avatars.pfptown.com/202/lebron-pfp-5200.png

          // hash password
          const saltRounds = 10;
          let hashedPassword = await bcrypt.hash(password, saltRounds);

          const user = await db.query(`INSERT INTO user_account(username, nickname, email, passwordHash, pfp_path) VALUES ($1, $2, $3, $4, $5)`, [username, nickname, email, hashedPassword, pfp_path]);
          return user;
        })},
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(3000);
