import express from "express";
import * as fixturesController from "../controllers/fixtures.controller";
import isAllowed from "../middlewares/jwt";
const fixtureRouter = express.Router();
//get
fixtureRouter.get(
  "/fixtures/live",
  isAllowed,
  fixturesController.getLiveFixtures,
);
fixtureRouter.get(
  "/fixtures/upcoming",
  isAllowed,
  fixturesController.getUpcomingFixtures,
);
//exporting
export default fixtureRouter;