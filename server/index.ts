/**
 * This a minimal tRPC server
 */
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import db from "./db.ts";
import cors from "cors";
import { publicProcedure, router } from "./trpc.ts";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';

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
        }),

    login: publicProcedure
        .input(
          z.object({
            email: z.string(),
            password: z.string()
          })
        )
        .mutation(async (opts) => {
          const { email, password } = opts.input;

          // verify user exists
          const userResult = await db.query("SELECT * FROM user_account WHERE email = $1", [email])
          if (userResult.rows.length == 0) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'user not found in database'
            });
          }
          const userData = userResult.rows[0];

          // verify password
          const match = await bcrypt.compare(password, userData.passwordhash)
          if (!match) {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'password does not match'
            });          
          }

          return userData.id;
        })
      }
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(3000);
