import nodeCron from "node-cron";
import Bet from "../models/bet";
import User from "../models/user";
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


async function resolveBet(fetchedData: any, filteredBets: bet[], gameId: string) {
    console.log(`status : ${fetchedData.fixture.status.short} for game id: ${gameId}`);
    if(fetchedData.fixture.status.short === "FT"){ 
        for(const bet of filteredBets){
            //getting winner id 
            let winnerId: string | null = null;
            if(fetchedData.teams.home.winner === true){
                winnerId = fetchedData.teams.home.id;
            }else if(fetchedData.teams.away.winner === true){
                winnerId = fetchedData.teams.away.id;
            }else{
                winnerId = null;
            }
            //betting team id
            const teamId = bet.teamId;
            //prediction result
            const isWin = 
            (teamId === winnerId && bet.predictedResult === "win") ||
            (teamId !== winnerId && winnerId !== null && bet.predictedResult === "lose") ||
            (bet.predictedResult === "draw" && winnerId === null);
            //updating the bet status
            if(isWin){
                console.log(`bet with id ${bet._id} is won adding profits`);
                //getting user 
                const user = await User.findById(bet.userId);
                if(!user){
                    console.error(`User not found for bet with id ${bet._id}`);
                    continue;
                }
                //updating user balance
                user.coins += bet.amount+ bet.amount * 0.8; 
                await user.save();
                bet.status = "won";
                await Bet.findByIdAndUpdate(bet._id, {status: "won"})
            }else if(!isWin){
                console.log(`bet with id ${bet._id} is lost`);
                const user = await User.findByIdAndUpdate(bet.userId, { $inc: { coins: -bet.amount } });
                if(!user){
                    console.error(`User not found for bet with id ${bet._id}`);
                    continue;
                }
                bet.status = "lost";
                await Bet.findByIdAndUpdate(bet._id, {status: "lost"})
            }
        }
    } else {
        console.log(`game is not finished yet`);
    }
}


async function extractGameIdFromBet(): Promise<void> {
    try{
        const PendingBets: bet[] = await Bet.find({status: "pending"})
        if(PendingBets.length === 0){
            return console.log("no pending bets to resolve");
        };
        const uniqueGameIds = Array.from(new Set(PendingBets.map(bet => bet.gameId)));
        //looping to get the status 
        for(const gameId of uniqueGameIds){
            let res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${gameId}`,{
                method: "GET",
                headers: { "x-apisports-key": process.env.API_KEY!}
            })
            const fetchedData = await res.json();
            const data = fetchedData.response[0];
            const filteredBets: bet[] = PendingBets.filter(bet => bet.gameId === gameId);
            await resolveBet(data, filteredBets, gameId);
        }
    }catch(error){
        console.error("Error fetching game data:", error);
    }
}

export default nodeCron.schedule("*/3 * * * *", async() => { 
    return extractGameIdFromBet();
})