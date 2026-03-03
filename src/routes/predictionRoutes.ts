import express, { Router } from 'express';
import betController from '../controllers/predictionsController';
const predictionRouter = express.Router();

predictionRouter.post('/bet', betController);

export default predictionRouter;