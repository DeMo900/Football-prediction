//
import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import {db} from "../lib/redis";
import path from "path";
//DASHBOARD
async function dashboard(req: Request, res: Response) {
  res.sendFile(path.join(process.cwd(), "views", "dashboard.html"));
}
//CHECK FOR REWARD
async function checkReward(req: Request, res: Response) {
  try{
  const {_id} = jwt.verify( req.cookies.jwt,process.env.JWT_SECRET!) as {_id:string};
  const user = await User.findOne({_id});
  if(!user) return res.status(404).json({msg:"user not found"});
  if(user.lastClaim){
    const today = Date.now();
    const lastClaim = user.lastClaim;
    if(today - lastClaim >= 86400000){
      await db.set(`rewardForUser:${user._id}`,"10",{EX:5*60});
      return res.status(200).json({message:true});
    }
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
    const user = await User.findOne({_id});
    if(!user) return res.status(404).json({msg:"user not found"});
    const reward = await db.get(`rewardForUser:${user._id}`);
    if(!reward) return res.status(404).json({msg:"no reward available"});
    await User.updateOne({_id},{$inc:{coins:10},lastClaim:Date.now()});
    await db.del(`rewardForUser:${user._id}`);
    return res.status(200).json({message:"reward claimed"});
  }
  catch(err){
    console.log(err);
    return res.status(500).json({msg:"internal server error"});
  }
}
//exporting
export { dashboard, checkReward ,claimReward};
