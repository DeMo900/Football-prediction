import express from "express";
import {body} from "express-validator";
import * as predictionController from "../controllers/predictionsController";
const predictionRouter = express.Router();
//POST BET
predictionRouter.post("/bet",
  body("gameId").notEmpty().withMessage("gameId is required"),
  body("predictedResult").notEmpty().isIn(["home","away","draw"]).withMessage("predictedResult is required"),
  body("amount").notEmpty().isNumeric().withMessage("amount is required"),
  predictionController.placeBetController);
//GET LEADERBOARD
predictionRouter.get(
  "/leaderboard",
  predictionController.leaderboardController,
);
predictionRouter.get("/odds", predictionController.getOddsController);
export default predictionRouter;
