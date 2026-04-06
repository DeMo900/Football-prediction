import nodeCron from "node-cron";
import pool from "../lib/pg/db";
import dotenv from "dotenv";
dotenv.config();
type bet = {
  id: string;
  game_id: string;
  user_id: string;
  prediction: 'home' | 'away' | 'draw';
  status: "pending" | "won" | "lost";
  amount: number;
};

async function resolveBet(
  fetchedData: any,
  filteredBets: bet[],
  gameId: string,
) {
  console.log(
    `status : ${fetchedData.fixture.status.short} for game id: ${gameId}`,
  );
  const status = fetchedData.fixture.status.short;
  if (status === "FT" || status === "AET" || status === "PEN") {
    for (const bet of filteredBets) {
      //getting winner id
      let winner: string | null = null;
      if (fetchedData.teams.home.winner === true) {
        winner = "home";
      } else if (fetchedData.teams.away.winner === true) {
        winner = "away";
      } else {
        winner = "draw";
      }
      //betting team
      const predictedResult = bet.prediction;
      //prediction result
      const isWin = predictedResult === winner;
      //updating the bet status
      if (isWin) {
        console.log(`bet with id ${bet.id} is won adding profits`);
        //updating user balance
        await pool.query("UPDATE bets SET status = 'won' WHERE id = $1",[bet.id])
        await pool.query("UPDATE users SET coins = coins + $1 WHERE id = $2",[bet.amount*1.8,bet.user_id])
      } else {
        console.log(`bet with id ${bet.id} is lost`);
        await pool.query("UPDATE bets SET status = 'lost' WHERE id = $1",[bet.id])
      }
      }
  } else {
    console.log(`game is not finished yet`);
  }
}

async function extractGameIdFromBet(): Promise<void> {
  try {
    const PendingBets = await pool.query("SELECT * FROM bets WHERE status = 'pending'");
    const pendingBetsArray : bet[] = PendingBets.rows;
    if (pendingBetsArray.length === 0) {
      return console.log("no pending bets to resolve");
    }
    const uniqueGameIds = Array.from(
      new Set(pendingBetsArray.map((bet) => bet.game_id)),
    );
    //looping to get the status
    for (const gameId of uniqueGameIds) {
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?id=${gameId}`,
        {
          method: "GET",
          headers: { "x-apisports-key": process.env.API_KEY! },
        },
      );
      const fetchedData = await res.json();
      const data = fetchedData.response[0];

      const filteredBets: bet[] = pendingBetsArray.filter(
        (bet) => bet.game_id === gameId,
      );

      if (!data) {
        console.log(`No data for game ${gameId}. Refunding and deleting bets.`);
        for (const bet of filteredBets) {
          //updating
      await pool.query("UPDATE users SET coins = coins + $1 WHERE id = $2", [bet.amount, bet.user_id]);
      //deleting
          await pool.query("DELETE FROM bets WHERE id=$1",[bet.id])
        }
        continue;
      }

      await resolveBet(data, filteredBets, gameId);
    }
  } catch (error) {
    console.error("Error fetching game data:", error);
  }
}

export default nodeCron.schedule("*/3 * * * *", async () => {
  return extractGameIdFromBet();
});
