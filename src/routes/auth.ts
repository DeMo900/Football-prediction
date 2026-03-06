import express,{ Request,Response } from "express";
import {signUpPost,logInPost} from "../controllers/auth";
import isAllowed from "../middlewares/jwt";
 const authRouter = express.Router()

 //POST LOGIN
authRouter.post("/login", logInPost)
//POST SIGNUP
authRouter.post("/signup", signUpPost)
export default authRouter