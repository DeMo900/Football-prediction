import { Request, Response } from "express";
import { WinChances } from "../types/game";
import { fetchPredictionOdds } from "../services/football-api";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { redis } from "../lib/redis";
import pool from "../lib/pg/db";
export async function placeBetController(req: Request, res: Response) {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0] });
    }
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
          req.body.predictedResult,
          req.body.amount,
          req.body.odds,
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

export async function leaderboardController(req: Request, res: Response) {
  try {
    const page = req.query.page;
    if (!page || typeof page !== "string")
      throw new Error("no page was provided");
    const parsedPage = parseInt(page);
    const pageSize = 10;
    const leaderboardRows = await pool.query(
      "SELECT username,wins,coins FROM users ORDER BY wins DESC LIMIT $1 OFFSET $2",
      [pageSize, (parsedPage - 1) * pageSize],
    );
    return res.json({ message: leaderboardRows.rows });
  } catch (err) {
    return res.status(500).send("Internal server error: " + err);
  }
}
//odds types
export async function getOddsController(req: Request, res: Response) {
  try {
    const gameId = req.query.gameId;

    if (!gameId || typeof gameId !== "string") {
      return res.status(400).json({ msg: "invalid game id" });
    }
    const cache = await redis.get(`odds for game ${gameId}`);
    if (cache) {
      console.log("loaded from cache");
      return res.json({ odds: JSON.parse(cache) });
    }

    const odds = await fetchPredictionOdds(gameId);
    if ("error" in odds) return res.status(400).json({ msg: odds.error });
    await redis.set(`odds for game ${gameId}`, JSON.stringify(odds), {
      EX: 60 * 300,
    });

    return res.json({ odds });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
//needed data to make a bet
//game id  	1380590
//team id 345
//predicted result win
//amount to bet 200
