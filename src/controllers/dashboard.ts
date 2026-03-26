//
import{Request,Response} from 'express';
import path from "path"
//DASHBOARD
async function dashboard(req:Request,res: Response){
res.sendFile(path.join(process.cwd(), 'views', 'dashboard.html'))
}
//LEAGUES
async function leagues(req:Request,res: Response){
    //code here 
}
//exporting 
export {dashboard,leagues}
