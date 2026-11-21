import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {redis} from "../lib/redis";
import { fetchPredictionOdds } from "../services/football-api.service";
import { Odds } from "../types/odds";
import { validationResult } from "express-validator";
import pool from "../lib/pg/db";
export async function placeBet(req: Request, res: Response) {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0] });
    }
    const predictedResult : "home" | "away" | "draw" = req.body.predictedResult
    const gameId = req.body.gameId

    //getting the user from the cookies
    const user = req.cookies["jwt"];
    const { id } = jwt.verify(user, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };
    console.log(id);
    if (req.body.amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than zero" });
    }
   let allOdds:Odds;
const cache = await redis.get(`odds for game ${gameId}`);
if (cache) {
  allOdds = JSON.parse(cache);
} else {
  const fetched = await fetchPredictionOdds(gameId);
  if ("error" in fetched) return res.status(400).json({ msg: fetched.error });
  allOdds = fetched;
  await redis.set(`odds for game ${gameId}`, JSON.stringify(allOdds), { EX: 60 * 300 });
}
const odds = parseFloat(allOdds[predictedResult]);
if (Number.isNaN(odds)) {
  return res.status(400).json({ msg: "Odds unavailable for this outcome" });
}
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(
        "UPDATE users SET coins = coins - $1 WHERE id = $2 AND coins >= $1",
        [req.body.amount, id],
      );
      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ msg: "Insufficient coins" });
      }
      await client.query(
        "INSERT INTO bets (game_id, user_id, prediction, amount,odds) VALUES ($1, $2, $3, $4,$5)",
        [
          req.body.gameId,
          id,
          predictedResult,
          req.body.amount,
          odds,
        ],
      );
      await client.query("COMMIT");
      return res.status(201).json({ message: "Bet placed successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}