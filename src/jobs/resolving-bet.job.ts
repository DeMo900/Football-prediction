import nodeCron from "node-cron";
import { extractGameIdFromBet } from "../services/resolving-bet.service";
export default nodeCron.schedule("*/3 * * * *", () => {
  extractGameIdFromBet();
});