import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Bet from '../models/bet';


export default async function betController (req: Request, res: Response) {
    try{
//getting the user from the cookies
const user = req.cookies["jwt"];
if(!user) return res.status(401).json({message: "Unauthorized"});
const {id,email} = jwt.verify(user, process.env.JWT_SECRET as string) as { id: string, email: string };
const newBet = new Bet({
    gameId: req.body.gameId,
    userId: id,
    teamId: req.body.teamId,
    predictedResult: req.body.predictedResult,
    amount: req.body.amount
})
await newBet.save();
return res.status(201).json({message: "Bet placed successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }
 }


//needed data to make a bet 
//game id  	1380590
//team id 345
//predicted result win
//amount to bet 200