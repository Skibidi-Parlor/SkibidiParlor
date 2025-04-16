import db from "../db.ts";
import { publicProcedure, router } from "../trpc.ts";
import { z } from "zod";

const getCurrentTimestamp = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const leaderboardRouter = router({

  saveScore: publicProcedure
    .input(
      z.object({ 
        user_id: z.number(),
        game_id: z.number(),
        points: z.number()
      })
    )
    .mutation(async (opts) => {
      const { user_id, game_id, points } = opts.input;

      const currentTimestamp = getCurrentTimestamp();

      const user = await db.query(`INSERT INTO scores(user_id, game_id, points, timestamp) VALUES ($1, $2, $3, $4) RETURNING id`, [user_id, game_id, points, currentTimestamp]);
      return user;
    }),

  topPlayers: publicProcedure.query(async () => {
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
        GROUP BY user_account.id, user_account.username, user_account.nickname
        ORDER BY total_points DESC
      `);
      return users.rows;
  } ),

  test: publicProcedure.query(async () => {
    // console.log("getting current timestamp");
    const timestamp = getCurrentTimestamp();
    
    return timestamp;
  }),

});
