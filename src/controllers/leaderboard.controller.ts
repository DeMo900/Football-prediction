import { Request, Response } from "express";
import pool from "../lib/pg/db";
export async function getLeaderboard(req: Request, res: Response) {
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