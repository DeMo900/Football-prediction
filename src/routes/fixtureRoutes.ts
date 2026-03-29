import express from "express";
import * as fixtureController from "../controllers/fixtureController";
import isAllowed from "../middlewares/jwt";
const fixtureRouter = express.Router();
//get
fixtureRouter.get("/fixtures/live", isAllowed, fixtureController.liveController);
fixtureRouter.get("/fixtures/upcoming", isAllowed, fixtureController.upcomingController);
//exporting
export default fixtureRouter;
