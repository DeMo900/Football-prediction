import nodeCron from "node-cron";
import { extractGameIdFromBet } from "../services/resolvingBet";
export default nodeCron.schedule("*/3 * * * *", () => {
  extractGameIdFromBet();
});
