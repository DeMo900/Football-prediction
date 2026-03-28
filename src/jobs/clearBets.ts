import cron from "node-cron";
import Bet from "../models/bet";

cron.schedule("*/3 * * * *", async () => {
  try {
    const resolvedBets = await Bet.find({ status: { $ne: "pending" } });
    if (resolvedBets.length === 0) {
      console.log("No bets to clear");
      return;
    }
    await Bet.deleteMany({ status: { $ne: "pending" } });
    console.log("All bets cleared successfully");
  } catch (err) {
    console.error("Error clearing bets:", err);
  }
});
