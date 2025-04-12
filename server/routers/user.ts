import db from "../db.ts";
import { publicProcedure, router } from "../trpc.ts";
import { z } from 'zod';
import bcrypt from 'bcrypt';

export const userRouter = router({
  byID: publicProcedure
    .input(
      z.number()
    )
    .query(async (opts) => {
      const userID = opts.input;
      const userData = await db.query("SELECT * FROM user_account WHERE id=$1", [userID]);
      return userData;
    }),

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
})
