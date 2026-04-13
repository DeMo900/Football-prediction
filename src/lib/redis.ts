import * as redis from "redis";

const redisClient = redis.createClient();
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Error connecting to Redis:", err));

export { redisClient as redis };
