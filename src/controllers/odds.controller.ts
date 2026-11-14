import { Request, Response } from "express";
import { fetchPredictionOdds } from "../services/football-api.service";
import { redis } from "../lib/redis";
export async function getOdds(req: Request, res: Response) {
  try {
    const gameId = req.query.gameId;

    if (!gameId || typeof gameId !== "string") {
      return res.status(400).json({ msg: "invalid game id" });
    }
    const cache = await redis.get(`odds for game ${gameId}`);
    if (cache) {
      console.log("loaded from cache");
      return res.json({ odds: JSON.parse(cache) });
    }

    const odds = await fetchPredictionOdds(gameId);
    if ("error" in odds) return res.status(400).json({ msg: odds.error });
    await redis.set(`odds for game ${gameId}`, JSON.stringify(odds), {
      EX: 60 * 300,
    });

    return res.json({ odds });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}