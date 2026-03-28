import express from "express";
import {
  passportController,
  googleCallbackController,
  authenticateGoogle,
} from "../controllers/Oauth2.0Controller";
const OauthRouter = express.Router();

OauthRouter.get("/auth/google", passportController);
OauthRouter.get(
  "/auth/google/callback",
  authenticateGoogle,
  googleCallbackController,
);

export default OauthRouter;
