import express from "express";
import * as fixtureController from "../controllers/fixtureController";
import isAllowed from "../middlewares/jwt";
const fixtureRouter = express.Router();
//get
fixtureRouter.get(
  "/fixtures/live",
  isAllowed,
  fixtureController.getLiveFixturesController,
);
fixtureRouter.get(
  "/fixtures/upcoming",
  isAllowed,
  fixtureController.getUpcomingFixturesController,
);
//exporting
export default fixtureRouter;
