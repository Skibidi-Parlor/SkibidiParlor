import db from "../db.ts";
import { publicProcedure, router } from "../trpc.ts";
import { z } from "zod";
import bcrypt from "bcrypt";

export const userRouter = router({
  byID: publicProcedure.input(z.number()).query(async (opts) => {
    const userID = opts.input;
    const userData = await db.query("SELECT * FROM user_account WHERE id=$1", [
      userID,
    ]);
    return userData;
  }),

  byEmail: publicProcedure.input(z.string()).query(async (opts) => {
    const userEmail = opts.input;
    const userData = await db.query(
      "SELECT * FROM user_account WHERE email=$1",
      [userEmail]
    );
    return userData;
  }),

  byUsername: publicProcedure.input(z.string()).query(async (opts) => {
    const userUsername = opts.input;
    const userData = await db.query(
      "SELECT * FROM user_account WHERE username=$1",
      [userUsername]
    );
    return userData;
  }),

  all: publicProcedure.query(async () => {
    const users = await db.query("SELECT * FROM user_account");
    return users.rows;
  }),

  totalPoints: publicProcedure.input(z.number()).query(async (opts) => {
    const userID = opts.input;
    const users = await db.query(
      `
        SELECT 
          user_account.id AS user_id,
          user_account.username,
          user_account.nickname,
          user_account.pfp_path,
          SUM(scores.points) AS total_points
        FROM scores
        JOIN user_account ON scores.user_id = user_account.id
        WHERE user_account.id = $1
        GROUP BY user_account.id, user_account.username, user_account.nickname, user_account.pfp_path
        ORDER BY total_points DESC
      `,
      [userID]
    );

    // if (users) {
    //   socket.emit("user-score-update-from-backend", {
    //     response: "Success",
    //     userID: userID,
    //   });
    // } else {
    //   socket.emit("user-score-update-from-backend", {
    //     response: "Error",
    //     userID: userID,
    //   });
    // }

    return users.rows[0];
  }),

  create: publicProcedure
    .input(
      z.object({
        username: z.string(),
        nickname: z.string(),
        email: z.string(),
        password: z.string(),
        pfp_path: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { username, nickname, email, password, pfp_path } = opts.input;

      // if pfp_path not provided, use a default pfp lmaoo: https://avatars.pfptown.com/202/lebron-pfp-5200.png

      // hash password
      const saltRounds = 10;
      let hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await db.query(
        `INSERT INTO user_account(username, nickname, email, passwordHash, pfp_path) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [username, nickname, email, hashedPassword, pfp_path]
      );
      return user;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(), // required to identify which user to update
        username: z.string().optional(),
        nickname: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        pfp_path: z.string().optional(),

        cheesepizza: z.number().optional(),
        pizzadough: z.number().optional(),
        mozzerellapizza: z.number().optional(),
        sauceonlypizza: z.number().optional(),

        onionpizza: z.number().optional(),
        pepperonipizza: z.number().optional(),
        sausagepizza: z.number().optional(),
        mushroompizza: z.number().optional(),
        bellpepperpizza: z.number().optional(),
        olivepizza: z.number().optional(),

        meatlovers: z.number().optional(),
        hawaiian: z.number().optional(),
        magarita: z.number().optional(),
        veggie: z.number().optional(),
        vegan: z.number().optional(),
        discontinuedcostcocombinationpizza: z.number().optional(),

        buffalo: z.number().optional(),
        bbq: z.number().optional(),
        elote: z.number().optional(),
        bubba: z.number().optional(),
        supreme: z.number().optional(),
        blt: z.number().optional(),
      })
    )
    .mutation(async (opts) => {
      const {
        id,
        username,
        nickname,
        email,
        password,
        pfp_path,

        cheesepizza,
        pizzadough,
        mozzerellapizza,
        sauceonlypizza,

        onionpizza,
        pepperonipizza,
        sausagepizza,
        mushroompizza,
        bellpepperpizza,
        olivepizza,

        meatlovers,
        hawaiian,
        magarita,
        veggie,
        vegan,
        discontinuedcostcocombinationpizza,

        buffalo,
        bbq,
        elote,
        bubba,
        supreme,
        blt,
      } = opts.input;

      const fields: string[] = [];
      const values: any[] = [];
      let i = 1;

      const addField = (key: string, value: any) => {
        fields.push(`${key} = $${i++}`);
        values.push(value);
      };

      if (username !== undefined) addField("username", username);
      if (nickname !== undefined) addField("nickname", nickname);
      if (email !== undefined) addField("email", email);
      if (password !== undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        addField("passwordHash", hashedPassword);
      }
      if (pfp_path !== undefined) addField("pfp_path", pfp_path);

      if (cheesepizza !== undefined) addField("cheesepizza", cheesepizza);
      if (pizzadough !== undefined) addField("pizzadough", pizzadough);
      if (mozzerellapizza !== undefined)
        addField("mozzerellapizza", mozzerellapizza);
      if (sauceonlypizza !== undefined)
        addField("sauceonlypizza", sauceonlypizza);

      if (onionpizza !== undefined) addField("onionpizza", onionpizza);
      if (pepperonipizza !== undefined)
        addField("pepperonipizza", pepperonipizza);
      if (sausagepizza !== undefined) addField("sausagepizza", sausagepizza);
      if (mushroompizza !== undefined) addField("mushroompizza", mushroompizza);
      if (bellpepperpizza !== undefined)
        addField("bellpepperpizza", bellpepperpizza);
      if (olivepizza !== undefined) addField("olivepizza", olivepizza);

      if (meatlovers !== undefined) addField("meatlovers", meatlovers);
      if (hawaiian !== undefined) addField("hawaiian", hawaiian);
      if (magarita !== undefined) addField("magarita", magarita);
      if (veggie !== undefined) addField("veggie", veggie);
      if (vegan !== undefined) addField("vegan", vegan);
      if (discontinuedcostcocombinationpizza !== undefined)
        addField(
          "discontinuedcostcocombinationpizza",
          discontinuedcostcocombinationpizza
        );

      if (buffalo !== undefined) addField("buffalo", buffalo);
      if (bbq !== undefined) addField("bbq", bbq);
      if (elote !== undefined) addField("elote", elote);
      if (bubba !== undefined) addField("bubba", bubba);
      if (supreme !== undefined) addField("supreme", supreme);
      if (blt !== undefined) addField("blt", blt);

      if (fields.length === 0) {
        throw new Error("No fields provided to update.");
      }

      const query = `UPDATE user_account SET ${fields.join(
        ", "
      )} WHERE id = $${i}`;
      values.push(id);

      const user = await db.query(query, values);

      return user;
    }),
});
