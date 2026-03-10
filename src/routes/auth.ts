import express,{ Request,Response } from "express";
import {signUpPost,logInPost,submitEmailPost,emailValidation,passwordValidation,updatePasswordPost, signUpGet} from "../controllers/auth";
import isAllowed from "../middlewares/jwt";
 const authRouter = express.Router()

//GET LOGIN
authRouter.get("/login", logInPost)
 //POST LOGIN
authRouter.post("/login", logInPost)
//GET SIGNUP
authRouter.get("/signup", signUpGet)
//POST SIGNUP
authRouter.post("/signup", signUpPost)
//GET ENTER EMAIL FOR PASSWORD RESET
authRouter.get("/enteremail",emailValidation,submitEmailPost)
//POST ENTER EMAIL FOR PASSWORD RESET
authRouter.post("/submitemail",emailValidation,submitEmailPost)
//POST UPDATE PASSWORD
authRouter.get("/updatepassword",passwordValidation,updatePasswordPost)
//POST UPDATE PASSWORD
authRouter.post("/updatepassword",passwordValidation,updatePasswordPost)

export default authRouter