import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Bet from "../models/bet";

export async function betController(req: Request, res: Response) {
  try {
    //getting the user from the cookies
    const user = req.cookies["jwt"];
    const { id } = jwt.verify(
      user,
      process.env.JWT_SECRET as string,
    ) as { id: string; email: string };
    const userCoins = await User.findById(id);
    if (!userCoins) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (req.body.amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than zero" });
    }
    if (userCoins.coins < req.body.amount) {
      return res.status(400).json({ msg: "Insufficient coins" });
    }
    await User.findByIdAndUpdate(id, { $inc: { coins: -req.body.amount } });
    const newBet = new Bet({
      gameId: req.body.gameId,
      userId: id,
      teamId: req.body.teamId,
      predictedResult: req.body.predictedResult,
      amount: req.body.amount,
    });
    await newBet.save();
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
    const rankedUsers = await User.find()
      .sort({ wins: -1 })
      .select("wins")
      .select("username")
      .select("coins")
      .limit(10)
      .skip(parsedPage - 1 * max);
    return res.json({ msg: rankedUsers });
  } catch (err) {
    return res.status(500).send("internal server error" + err);
  }
}

//needed data to make a bet
//game id  	1380590
//team id 345
//predicted result win
//amount to bet 200
