import express from "express";
import * as googleAuthController from "../controllers/googleAuthController";
const googleAuthRouter = express.Router();

googleAuthRouter.get("/auth/google", googleAuthController.passportController);
googleAuthRouter.get(
  "/auth/google/callback",
  googleAuthController.authenticateGoogle,
  googleAuthController.googleCallbackController,
);

export default googleAuthRouter;
