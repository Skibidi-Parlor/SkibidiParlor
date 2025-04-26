import db from "../db.ts";
import { publicProcedure, router } from "../trpc.ts";
import { z } from "zod";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import sendEmail from "../mailgun.ts";


const getCurrentExpirationTimestamp = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5); // add 5 minutes into the future

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


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

  sendResetToken: publicProcedure.input(z.string()).query(async (opts) => {
    const userEmail = opts.input;

    // verify user exists
    const userResult = await db.query(
      "SELECT * FROM user_account WHERE email = $1",
      [userEmail]
    );
    if (userResult.rows.length == 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "user not found in database",
      });
    }

    // get user's id
    const userData = userResult.rows[0];
    const userID = userData.id;

    // create 6-digit token
    const min = 100000;
    const max = 999999; 
    const token = Math.floor(Math.random() * (max - min + 1)) + min;

    // get expiration timestamp
    const expirationTimestamp = getCurrentExpirationTimestamp();

    // save code to db
    const tokenID = await db.query(
      `INSERT INTO resetToken(user_id, hashedToken, expirationTimestamp) VALUES ($1, $2, $3) RETURNING id`,
      [userID, token.toString(), expirationTimestamp]
    );

    // send email with code
    sendEmail(userEmail, "Password Reset", "Your Reset Token", token)

    return tokenID;
  }),

  changePassword: publicProcedure.input(
    z.object({
      code: z.string(),    // user typed code (6-digit string)
      newPassword: z.string(), // new password
    })
  )
  .mutation(async (opts) => {
    const { code, newPassword } = opts.input;
  
    // find the reset token
    const tokenResult = await db.query("SELECT * FROM resetToken WHERE hashedToken = $1", [code]);
  
    if (tokenResult.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invalid or expired reset code",
      });
    }
  
    const tokenData = tokenResult.rows[0];
  
    // check if token is expired
    const now = new Date();
    const expiration = new Date(tokenData.expirationtimestamp);
    if (now > expiration) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Reset code has expired",
      });
    }
  
    // find the user by user_id
    const userID = tokenData.user_id;
    const userResult = await db.query(
      "SELECT * FROM user_account WHERE id = $1",
      [userID]
    );
  
    if (userResult.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found for this reset code",
      });
    }
  
    // hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
    // update the user's password
    await db.query("UPDATE user_account SET passwordhash = $1 WHERE id = $2", [hashedPassword, userID]);
  
    // delete the used reset token
    await db.query("DELETE FROM resetToken WHERE id = $1",[tokenData.id]);
  
    return { code: 200 , message: "Password changed successfully" };
  }),
});
