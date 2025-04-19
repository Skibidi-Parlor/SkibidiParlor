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

        cheesePizza: z.number().optional(),
        pizzaDough: z.number().optional(),
        mozzerellaPizza: z.number().optional(),
        sauceOnlyPizza: z.number().optional(),

        onionPizza: z.number().optional(),
        pepperoniPizza: z.number().optional(),
        sausagePizza: z.number().optional(),
        mushroomPizza: z.number().optional(),
        bellPepperPizza: z.number().optional(),
        olivePizza: z.number().optional(),

        meatLovers: z.number().optional(),
        hawaiian: z.number().optional(),
        magarita: z.number().optional(),
        veggie: z.number().optional(),
        vegan: z.number().optional(),
        discontinuedCostcoCombinationPizza: z.number().optional(),

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

        cheesePizza,
        pizzaDough,
        mozzerellaPizza,
        sauceOnlyPizza,

        onionPizza,
        pepperoniPizza,
        sausagePizza,
        mushroomPizza,
        bellPepperPizza,
        olivePizza,

        meatLovers,
        hawaiian,
        magarita,
        veggie,
        vegan,
        discontinuedCostcoCombinationPizza,

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

      if (cheesePizza !== undefined) addField("cheesePizza", cheesePizza);
      if (pizzaDough !== undefined) addField("pizzaDough", pizzaDough);
      if (mozzerellaPizza !== undefined)
        addField("mozzerellaPizza", mozzerellaPizza);
      if (sauceOnlyPizza !== undefined)
        addField("sauceOnlyPizza", sauceOnlyPizza);

      if (onionPizza !== undefined) addField("onionPizza", onionPizza);
      if (pepperoniPizza !== undefined)
        addField("pepperoniPizza", pepperoniPizza);
      if (sausagePizza !== undefined) addField("sausagePizza", sausagePizza);
      if (mushroomPizza !== undefined) addField("mushroomPizza", mushroomPizza);
      if (bellPepperPizza !== undefined)
        addField("bellPepperPizza", bellPepperPizza);
      if (olivePizza !== undefined) addField("olivePizza", olivePizza);

      if (meatLovers !== undefined) addField("meatLovers", meatLovers);
      if (hawaiian !== undefined) addField("hawaiian", hawaiian);
      if (magarita !== undefined) addField("magarita", magarita);
      if (veggie !== undefined) addField("veggie", veggie);
      if (vegan !== undefined) addField("vegan", vegan);
      if (discontinuedCostcoCombinationPizza !== undefined)
        addField(
          "discontinuedCostcoCombinationPizza",
          discontinuedCostcoCombinationPizza
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
