import cron from "node-cron";
import pool from "../lib/pg/db";

cron.schedule("*/3 * * * *", async () => {
  try {
    const deleteBet = await pool.query(
      "DELETE FROM bets WHERE status <> 'pending'"
    );
    if(deleteBet.rowCount === 0) return console.log("No bets to clear");
    console.log(`All bets cleared successfully ${deleteBet.rowCount}`);
  } catch (err) {
    console.error("Error clearing bets:", err);
  }
});
