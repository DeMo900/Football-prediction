import express,{ Request,Response } from "express";
import {signUpPost,logInPost,submitEmailPost,emailValidation,passwordValidation,updatePasswordPost} from "../controllers/auth";
import isAllowed from "../middlewares/jwt";
 const authRouter = express.Router()

 //POST LOGIN
authRouter.post("/login", logInPost)
//POST SIGNUP
authRouter.post("/signup", signUpPost)
//POST ENTER EMAIL FOR PASSWORD RESET
authRouter.post("/submitemail",emailValidation,submitEmailPost)
//POST UPDATE PASSWORD
authRouter.post("/updatepassword",passwordValidation,updatePasswordPost)

export default authRouter