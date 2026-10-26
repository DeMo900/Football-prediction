
import { Request, Response } from "express";
import { GameData } from "../types/game";
import { getLiveGames , getUpcomingGames} from "../services/football-api";

//live
async function getLiveFixturesController(req: Request, res: Response) {
  let games = await getLiveGames();
  if (!games) return null;

  if (req.query.league) {
    games = games.filter(
      (game) => game.league.id === parseInt(req.query.league as string),
    );
  }
  res.send(games);
  console.log(games);
}
//upcoming
async function getUpcomingFixturesController(req: Request, res: Response) {
  let games = await getUpcomingGames();
  if (!games) return [];
  if (req.query.league) {
    games = games.filter(
      (game) => game.league.id === parseInt(req.query.league as string),
    );
  }
  console.log(games);
  res.send(games);
}

export { getLiveFixturesController, getUpcomingFixturesController };

//GET https://v3.football.api-sports.io/predictions?fixture=FIXTURE_I
