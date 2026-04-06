import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Bet from "../models/bet";
import pool from "../lib/pg/db";
export async function betController(req: Request, res: Response) {
  try {
    //getting the user from the cookies
    const user = req.cookies["jwt"];
    const { id } = jwt.verify(
      user,
      process.env.JWT_SECRET as string,
    ) as { id: string; email: string };
    const userCoins = await pool.query("SELECT coins FROM users WHERE id = $1", [id]);
    if (!userCoins.rows[0]) { 
      return res.status(404).json({ msg: "User not found" });
    }

    if (req.body.amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than zero" });
    }
    if (userCoins.rows[0].coins < req.body.amount) {
      return res.status(400).json({ msg: "Insufficient coins" });
    }
    await pool.query("UPDATE users SET coins = coins - $1 WHERE id = $2", [req.body.amount, id]);
    const newBet = await pool.query("INSERT INTO bets (game_id, user_id, predicted_result, amount) VALUES ($1, $2, $3, $4)", [req.body.gameId, id, req.body.predictedResult, req.body.amount]);
    return res.status(201).json({ message: "Bet placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function leadBoardController(req: Request, res: Response) {
  try {
    const page = req.query.page;
    if (!page || typeof page !== "string")
      throw new Error("no page was provided");
    const parsedPage = parseInt(page);
    const max = 10;
    const rankedUsers = await pool.query("SELECT username,wins,coins FROM users ORDER BY wins DESC LIMIT $1 OFFSET $2",[max,(parsedPage-1)*max])
    return res.json({ msg: rankedUsers.rows });
  } catch (err) {
    return res.status(500).send("internal server error" + err);
  }
}

//needed data to make a bet
//game id  	1380590
//team id 345
//predicted result win
//amount to bet 200
