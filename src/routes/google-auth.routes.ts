import express from "express";
import * as authController from "../controllers/auth.controller";
const googleAuthRouter = express.Router();

googleAuthRouter.get("/auth/google", authController.startGoogleAuth);
googleAuthRouter.get(
  "/auth/google/callback",
  authController.authenticateGoogle,
  authController.googleCallback,
);

export default googleAuthRouter;