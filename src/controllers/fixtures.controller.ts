import { Request, Response } from "express";
import { getLiveGames, getUpcomingGames } from "../services/football-api.service";

//live
async function getLiveFixtures(req: Request, res: Response) {
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
async function getUpcomingFixtures(req: Request, res: Response) {
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

export { getLiveFixtures, getUpcomingFixtures };

//GET https://v3.football.api-sports.io/predictions?fixture=FIXTURE_I