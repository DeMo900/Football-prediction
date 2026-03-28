import nodeCron from "node-cron";
import User from "../models/user";

nodeCron.schedule("0 0 * * 0", async () => {
  try {
    await User.updateMany({}, { $set: { wins: 0 } });
    console.log("all wins cleared");
  } catch (err) {
    return console.log(`error while clearing wins`);
  }
});
