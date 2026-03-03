import nodeCron from "node-cron";
import Bet from "../models/bet";
require('dotenv').config();
type bet = {
    _id: string;
    gameId: string;
    userId: string;
    teamId: string;
    predictedResult: string;
    status: "pending" | "won" | "lost";
    amount: number;
}

async function extractGameIdFromBet() {
    try{
    const PendingBets: bet[] = await Bet.find({status: "pending"})
    if(PendingBets.length === 0){
        console.log("no pending bets to resolve");
        return;
    };
//looping to get the status 
    PendingBets.forEach(async(bet) => {
let res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${bet.gameId}`,{
    method: "GET",
    headers: { "x-apisports-key": process.env.API_KEY!}
    })
const data =  await res.json();

if(data.response[0].fixture.status.short === "FT"){
//getting winnder id 
 let winnerId: string | null = null;
if(data.response[0].teams.home.winner === true){
    winnerId = data.response[0].teams.home.id;
}else if(data.response[0].teams.away.winner === true){
    winnerId = data.response[0].teams.away.id;
}else{
    winnerId = null;
}
//betting team id
const teamId = bet.teamId;
//prediction result
    const isWin = 
    (teamId === winnerId && bet.predictedResult === "win") ||
     (teamId !== winnerId && winnerId !== null && bet.predictedResult === "lose") || //other team loses  (win)
     (bet.predictedResult === "draw" && winnerId === null); //draw
//updating the bet status
if(isWin){
    bet.status = "won";
  await  Bet.findByIdAndUpdate(bet._id, {status: "won"})

}else if(!isWin){
    bet.status = "lost";
   await Bet.findByIdAndUpdate(bet._id, {status: "lost"})
}
}else{
    console.log(`game with id ${bet.gameId} is not finished yet`);
}
})
    }catch(err){
        console.error(err);
    }
}

export default nodeCron.schedule("*/3 * * * *", async() => { 
return extractGameIdFromBet();

})