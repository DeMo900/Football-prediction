import express,{ Request,Response } from "express";
import {signUpPost,logInPost,submitEmailPost,emailValidation,passwordValidation,updatePasswordPost, signUpGet, logInGet, updatePasswordGet, enterEmailGet } from "../controllers/auth";
import isAllowed from "../middlewares/jwt";
 const authRouter = express.Router()

//GET LOGIN
authRouter.get("/login", logInGet)
 //POST LOGIN
authRouter.post("/login", logInPost)
//GET SIGNUP
authRouter.get("/signup", signUpGet)
//POST SIGNUP
authRouter.post("/signup", signUpPost)
//GET ENTER EMAIL FOR PASSWORD RESET
authRouter.get("/enteremail",enterEmailGet)
//POST ENTER EMAIL FOR PASSWORD RESET
authRouter.post("/submitemail",emailValidation,submitEmailPost)
//GET UPDATE PASSWORD
authRouter.get("/updatepassword",passwordValidation,updatePasswordGet)
//POST UPDATE PASSWORD
authRouter.post("/updatepassword",passwordValidation,updatePasswordPost)

export default authRouter