import { GameData , WinChances} from "../types/game";
import { Odds } from "../types/odds";
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
    const extractedData: GameData[] = games.map((game: any) => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
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
    const extractedData: GameData[] = games.map((game: any) => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
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
export async function fetchPredictionOdds(
  gameId: string,
): Promise<Odds | { error: string }> {
  //fetching
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY is not set");
    const response = await fetch(//needs to b moved to thee service layer
      `https://v3.football.api-sports.io/predictions?fixture=${gameId}`,
      {
        headers: {
          "x-apisports-key": process.env.API_KEY,
        },
      },
    );
    const parsedData = await response.json();
    if (!parsedData?.response?.[0]?.predictions?.percent) {
      return { error: "invalid game id" };
    }
    const data: WinChances = parsedData.response[0].predictions.percent;
    const home = parseFloat(data.home);
    const away = parseFloat(data.away);
    const draw = parseFloat(data.draw);
    const odds: Odds = {
      home: home > 0 ? (1 / (home / 100)).toFixed(2) : "N/A",
      away: away > 0 ? (1 / (away / 100)).toFixed(2) : "N/A",
      draw: draw > 0 ? (1 / (draw / 100)).toFixed(2) : "N/A",
    };
    return odds;
  } catch (err) {
    console.error(`An error occurred while calculating odds: ${err}`);
    return { error: "An error occurred while calculating odds" };
  }
}