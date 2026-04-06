import cron from "node-cron";
import pool from "../lib/pg/db";

cron.schedule("*/3 * * * *", async () => {
  try {
    const resolvedBets = await pool.query(
      "SELECT status FROM bets WHERE status <> 'pending'"
    )
    if (resolvedBets.rowCount === 0) {
      console.log("No bets to clear");
      return;
    }
    await pool.query(
      "DELETE FROM bets WHERE status <> 'pending'"
    );
    console.log("All bets cleared successfully");
  } catch (err) {
    console.error("Error clearing bets:", err);
  }
});
