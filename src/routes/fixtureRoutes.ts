import express from 'express';
import {liveController,upcomingController} from '../controllers/fixtureController';
import isAllowed from '../middlewares/jwt';
const fixtureRouter = express.Router();
//get
fixtureRouter.get('/fixtures/live',isAllowed,liveController);
fixtureRouter.get('/fixtures/upcoming',isAllowed,upcomingController);
//exporting
export default fixtureRouter;