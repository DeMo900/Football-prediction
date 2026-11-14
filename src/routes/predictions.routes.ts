import express from "express";
import { body } from "express-validator";
import * as betsController from "../controllers/bets.controller";
import * as leaderboard from "../controllers/leaderboard.controller";
import * as oddsController from "../controllers/odds.controller";
const predictionRouter = express.Router();
//POST BET
predictionRouter.post(
  "/bet",
  body("gameId").notEmpty().withMessage("gameId is required"),
  body("predictedResult")
    .notEmpty()
    .isIn(["home", "away", "draw"])
    .withMessage("predictedResult is required"),
  body("amount").notEmpty().isNumeric().withMessage("amount is required"),
  betsController.placeBet,
);
//GET LEADERBOARD
predictionRouter.get(
  "/leaderboard",
  leaderboard.getLeaderboard,
);
predictionRouter.get("/odds", oddsController.getOdds);
export default predictionRouter;