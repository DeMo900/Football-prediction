import express,{Request,Response} from 'express';
import path from "path"
import {dashboard,leagues} from '../controllers/dashboard';
//Router
const dashboardRouter = express.Router();
//GET
dashboardRouter.get('/',dashboard);
//exporting
export default dashboardRouter;