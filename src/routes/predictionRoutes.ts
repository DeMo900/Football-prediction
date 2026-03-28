import express, { Router } from "express";
import {
  betController,
  leadBoardController,
} from "../controllers/predictionsController";
const predictionRouter = express.Router();
//POST BET
predictionRouter.post("/bet", betController);
//GET LEADBOARD
predictionRouter.get("/leadboard", leadBoardController);
export default predictionRouter;
