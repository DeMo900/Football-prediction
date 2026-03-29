import * as redis from "redis";

const db = redis.createClient();
db.connect()
    .then(() => console.log("Connected to Redis"))
    .catch((err) => console.error("Error connecting to Redis:", err));

export { db };
