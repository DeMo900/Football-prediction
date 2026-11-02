export interface GameData {
  gameId: number;
  minutesElapsed?: number;
  teams: {
    home: string;
    away: string;
  };
  teamLogos: {
    home: string;
    away: string;
  };
  teamIds: {
    home: number;
    away: number;
  };
  goals?: {
    home: number;
    away: number;
  };
  league: {
    name: string;
    logo: string;
    id: number;
  };
  startsAt: number;
}
export interface FetchedData {
  fixture: {
    status: {
      short: string;
    };
  };
  teams: {
    home: { winner: boolean | null };
    away: { winner: boolean | null };
  };
}
export interface WinChances  {//needs to be moved to types
  home: string;
  away: string;
  draw: string;
};