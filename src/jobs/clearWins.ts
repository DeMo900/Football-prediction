import nodeCron from "node-cron";
import pool from "../lib/pg/db"

nodeCron.schedule("0 0 * * 0", async () => {
  try {
    await pool.query("UPDATE users SET wins = 0 WHERE wins <> 0")
    console.log("all wins cleared");
  } catch (err) {
    return console.log(`error while clearing wins ${err}`);
  }
});
