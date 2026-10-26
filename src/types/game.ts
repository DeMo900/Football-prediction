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