import nodeCron from "node-cron";
import pool from "../lib/pg/db";
import dotenv from "dotenv";

dotenv.config();

type BetStatus = "pending" | "won" | "lost";

interface Bet {
  id: string;
  game_id: string;
  user_id: string;
  prediction: "home" | "away" | "draw";
  status: BetStatus;
  amount: number;
}

interface FetchedData {
  fixture: {
    status: {
      short: string;
    };
  };
  teams: {
    home: { winner: boolean | null };
    away: { winner: boolean | null };
  };
}

async function resolveBet(
  fetchedData: FetchedData,
  filteredBets: Bet[],
  gameId: string,
) {
  const gameStatus = fetchedData.fixture.status.short;
  const finishedStatuses = ["FT", "AET", "PEN"];

  if (!finishedStatuses.includes(gameStatus)) {
    console.log(`Game ${gameId} is not finished yet (${gameStatus})`);
    return;
  }

  let winner: string = "draw";
  if (fetchedData.teams.home.winner) winner = "home";
  else if (fetchedData.teams.away.winner) winner = "away";

  for (const bet of filteredBets) {
    const client = await pool.connect();

    try {
      const isWin = bet.prediction === winner;

      if (isWin) {
        console.log(`Bet ${bet.id} won. Updating balance.`);
        await client.query("BEGIN");
        await client.query("UPDATE bets SET status = 'won' WHERE id = $1", [
          bet.id,
        ]);
        await client.query(
          "UPDATE users SET coins = coins + $1 WHERE id = $2",
          [bet.amount * 1.8, bet.user_id],
        );
        await client.query("COMMIT");
      } else {
        console.log(`Bet ${bet.id} lost.`);
        await client.query("UPDATE bets SET status = 'lost' WHERE id = $1", [
          bet.id,
        ]);
      }
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`Transaction failed for bet ${bet.id}:`, err);
    } finally {
      client.release();
    }
  }
}

async function extractGameIdFromBet(): Promise<void> {
  try {
    const result = await pool.query(
      "SELECT * FROM bets WHERE status = 'pending'",
    );
    const pendingBets: Bet[] = result.rows;

    if (pendingBets.length === 0) {
      console.log("No pending bets to resolve.");
      return;
    }

    const uniqueGameIds = Array.from(
      new Set(pendingBets.map((b) => b.game_id)),
    );

    for (const gameId of uniqueGameIds) {
      const response = await fetch(
        `https://v3.football.api-sports.io/fixtures?id=${gameId}`,
        {
          method: "GET",
          headers: { "x-apisports-key": process.env.API_KEY! },
        },
      );

      const json = await response.json();
      const gameData: FetchedData = json.response[0];
      const gameBets = pendingBets.filter((b) => b.game_id === gameId);

      if (!gameData) {
        console.log(`No data for ${gameId}. Refunding...`);
        for (const bet of gameBets) {
          const client = await pool.connect();
          try {
            await client.query("BEGIN");
            await client.query(
              "UPDATE users SET coins = coins + $1 WHERE id = $2",
              [bet.amount, bet.user_id],
            );
            await client.query("DELETE FROM bets WHERE id = $1", [bet.id]);
            await client.query("COMMIT");
          } catch (err) {
            if (client) await client.query("ROLLBACK");
            console.error(`Refund failed for bet ${bet.id}:`, err);
          } finally {
            if (client) client.release();
          }
        }
        continue;
      }

      await resolveBet(gameData, gameBets, gameId);
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
}

export default nodeCron.schedule("*/3 * * * *", () => {
  extractGameIdFromBet();
});
