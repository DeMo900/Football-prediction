import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import pool from "../lib/pg/db";
export async function placeBet(req: Request, res: Response) {
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