import express,{ Request,Response } from "express";
import signUpPost from "../controllers/auth";
import isAllowed from "../middlewares/jwt";
 const authRouter = express.Router()

//authRouter.post("/login")
authRouter.post("/signup", signUpPost)
export default authRouter