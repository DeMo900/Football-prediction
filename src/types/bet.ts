 type BetStatus = "pending" | "won" | "lost";

export interface Bet {
  id: string;
  game_id: string;
  user_id: string;
  prediction: "home" | "away" | "draw";
  status: BetStatus;
  amount: number;
  odds: number;
}