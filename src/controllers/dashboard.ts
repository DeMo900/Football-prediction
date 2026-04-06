//
import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import {db} from "../lib/redis";
import pool from "../lib/pg/db";
import path from "path";
//DASHBOARD
async function dashboard(req:Request,res: Response) {
  res.sendFile(path.join(process.cwd(), "views", "dashboard.html"));
}
//CHECK FOR REWARD
async function checkReward(req: Request, res: Response) {
  try{
  const {_id} = jwt.verify( req.cookies.jwt,process.env.JWT_SECRET!) as {_id:string};
  const user = await pool.query("SELECT last_claim FROM users WHERE id = $1",[_id])
  if(user.rowCount===0) return res.status(404).json({msg:"user not found"});
  //check if user claimed reward today
    const today = Date.now();
    const lastClaim = user.rows[0].last_claim;
    if(today - lastClaim >= 86400000){
      await db.set(`rewardForUser:${_id}`,"10",{EX:5*60});
      return res.status(200).json({message:true});
  }
  return res.status(200).json({message:false});
}
catch(err){
  console.log(err);
  return res.status(500).json({msg:"internal server error"});
}
}
//REWARDING
async function claimReward(req: Request, res: Response) {
  try{
    const {_id} = jwt.verify( req.cookies.jwt,process.env.JWT_SECRET!) as {_id:string};
    const user = await pool.query("SELECT id FROM users WHERE id=$1",[_id])
    if(user.rowCount===0) return res.status(404).json({msg:"user not found"});
    const reward = await db.get(`rewardForUser:${_id}`);
    if(!reward) return res.status(404).json({msg:"no reward available"});
    const updatedUser = await pool.query("UPDATE users SET coins = coins + 10, last_claim = $1 WHERE id = $2 RETURNING coins",[Date.now(),_id])
    await db.del(`rewardForUser:${_id}`);
    return res.status(200).json({message:"reward claimed",coins:updatedUser.rows[0].coins});
  }
  catch(err){
    console.log(err);
    return res.status(500).json({msg:"internal server error"});
  }
}
//GET USER
async function getUser(req: Request, res: Response) {
  try {
    const { _id } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as { _id: string };
    const user = await pool.query("SELECT username,coins FROM users WHERE id = $1",[_id])
    if (user.rowCount===0) return res.status(404).json({ msg: "user not found" });
    return res.status(200).json(user.rows[0]);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal server error" });
  }
}
//exporting
export { dashboard, checkReward, claimReward, getUser };
