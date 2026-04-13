import express from "express";
import * as predictionController from "../controllers/predictionsController";
const predictionRouter = express.Router();
//POST BET
predictionRouter.post("/bet", predictionController.placeBetController);
//GET LEADERBOARD
predictionRouter.get(
  "/leaderboard",
  predictionController.leaderboardController,
);
predictionRouter.get("/odds", predictionController.getOddsController);
export default predictionRouter;
