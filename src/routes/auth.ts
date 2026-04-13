import express from "express";
import * as authController from "../controllers/auth";
const authRouter = express.Router();

//GET LOGIN
authRouter.get("/login", authController.loginGet);
//POST LOGIN
authRouter.post("/login", authController.loginPost);
//GET SIGNUP
authRouter.get("/signup", authController.signupGet);
//POST SIGNUP
authRouter.post("/signup", authController.signupPost);
//GET ENTER EMAIL FOR PASSWORD RESET
authRouter.get("/enteremail", authController.enterEmailGet);
//POST ENTER EMAIL FOR PASSWORD RESET
authRouter.post(
  "/submitemail",
  authController.emailValidation,
  authController.submitEmailPost,
);
//GET UPDATE PASSWORD
authRouter.get(
  "/updatepassword",
  authController.passwordValidation,
  authController.updatePasswordGet,
);
//POST UPDATE PASSWORD
authRouter.post(
  "/updatepassword",
  authController.passwordValidation,
  authController.updatePasswordPost,
);

export default authRouter;
