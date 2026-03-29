import express, { Request, Response } from "express";
import * as authController from "../controllers/auth";
import isAllowed from "../middlewares/jwt";
const authRouter = express.Router();

//GET LOGIN
authRouter.get("/login", authController.logInGet);
//POST LOGIN
authRouter.post("/login", authController.logInPost);
//GET SIGNUP
authRouter.get("/signup", authController.signUpGet);
//POST SIGNUP
authRouter.post("/signup", authController.signUpPost);
//GET ENTER EMAIL FOR PASSWORD RESET
authRouter.get("/enteremail", authController.enterEmailGet);
//POST ENTER EMAIL FOR PASSWORD RESET
authRouter.post("/submitemail", authController.emailValidation, authController.submitEmailPost);
//GET UPDATE PASSWORD
authRouter.get("/updatepassword", authController.passwordValidation, authController.updatePasswordGet);
//POST UPDATE PASSWORD
authRouter.post("/updatepassword", authController.passwordValidation, authController.updatePasswordPost);

export default authRouter;  
