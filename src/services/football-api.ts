import { GameData } from "../types/game";
export async function getLiveGames() {
  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        method: "GET",
        headers: { "x-apisports-key": process.env.API_KEY! },
      },
    );
    const apiData = await response.json();
    const games = apiData.response;
  

  if (!games) return null;
  const extractedData: GameData[] = games.map((game: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      gameId: game.fixture.id,
      minutesElapsed: game.fixture.status.elapsed,
      teams: {
        home: game.teams.home.name,
        away: game.teams.away.name,
      },
      teamLogos: {
        home: game.teams.home.logo,
        away: game.teams.away.logo,
      },
      teamIds: {
        home: game.teams.home.id,
        away: game.teams.away.id,
      },
      goals: {
        home: game.goals.home,
        away: game.goals.away,
      },
      league: {
        name: game.league.name,
        logo: game.league.logo,
        id: game.league.id,
      },
    };
  });
  return extractedData;
  } catch (err) {
    console.log("Error fetching live games:", err);
    return null;
  }
}
export async function getUpcomingGames() {
  try {
    //date
    const date = new Date(); // current date

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${formattedDate}`,
      {
        method: "GET",
        headers: { "x-apisports-key": process.env.API_KEY! },
      },
    );
    const apiData = await response.json();
    const games = apiData.response;
    if (!games) return null;
  const extractedData: GameData[] = games.map((game: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      gameId: game.fixture.id,
      teams: {
        home: game.teams.home.name,
        away: game.teams.away.name,
      },
      goals: {
        home: game.goals.home,
        away: game.goals.away,
      },
      teamLogos: {
        home: game.teams.home.logo,
        away: game.teams.away.logo,
      },
      teamIds: {
        home: game.teams.home.id,
        away: game.teams.away.id,
      },
      league: {
        name: game.league.name,
        logo: game.league.logo,
        id: game.league.id,
      },
      startsAt: Math.floor(new Date(game.fixture.date).getTime() / 1000),
    };
  });
  const nowSeconds: number = Math.floor(Date.now() / 1000);
  const filteredData = extractedData.filter((game) => {
    return game.startsAt > nowSeconds && game.startsAt <= nowSeconds + 3600;
  });
  return filteredData;
} catch (err) {
    console.log("Error fetching live games:", err);
    return null;
  }
}


