import express, { Request, Response } from "express";
import path from "path";
import * as dashboardController from "../controllers/dashboard";
//Router
const dashboardRouter = express.Router();
//GET
dashboardRouter.get("/", dashboardController.dashboard);
dashboardRouter.get("/checkReward", dashboardController.checkReward);
//POST
dashboardRouter.get("/user", dashboardController.getUser);
dashboardRouter.post("/claimReward", dashboardController.claimReward);
//exporting
export default dashboardRouter;
