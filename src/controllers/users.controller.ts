import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../lib/pg/db";
//GET USER
async function getUser(req: Request, res: Response) {
  try {
    const { id } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await pool.query(
      "SELECT username,coins FROM users WHERE id = $1",
      [id],
    );
    if (user.rowCount === 0)
      return res.status(404).json({ msg: "user not found" });
    return res.status(200).json(user.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal server error" });
  }
}
export { getUser };