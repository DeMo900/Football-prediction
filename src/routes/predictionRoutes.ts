import express, { Router } from "express";
import * as predictionController from "../controllers/predictionsController";
const predictionRouter = express.Router();
//POST BET
predictionRouter.post("/bet", predictionController.betController);
//GET LEADBOARD
predictionRouter.get("/leadboard", predictionController.leadBoardController);
export default predictionRouter;
