import db from "../db.ts";
import { publicProcedure, router } from "../trpc.ts";
import { z } from "zod";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { email, password } = opts.input;

      // verify user exists
      const userResult = await db.query(
        "SELECT * FROM user_account WHERE email = $1",
        [email]
      );
      if (userResult.rows.length == 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found in database",
        });
      }
      const userData = userResult.rows[0];

      // verify password
      const match = await bcrypt.compare(password, userData.passwordhash);
      if (!match) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "password does not match",
        });
      }

      delete userData.passwordhash; // remove password before returning user data
      return userData;
    }),
});
