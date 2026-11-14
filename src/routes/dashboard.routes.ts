import express from "express";
import * as dashboardsController from "../controllers/dashboards.controller";
import * as rewardsController from "../controllers/rewards.controller";
import * as usersController from "../controllers/users.controller";
//Router
const dashboardRouter = express.Router();
//GET
dashboardRouter.get("/", dashboardsController.dashboard);
dashboardRouter.get("/checkReward", rewardsController.checkReward);
//POST
dashboardRouter.get("/user", usersController.getUser);
dashboardRouter.post("/claimReward", rewardsController.claimReward);
//exporting
export default dashboardRouter;