import express from "express";
import * as Oauth2Controller from "../controllers/Oauth2.0Controller";
const OauthRouter = express.Router();

OauthRouter.get("/auth/google", Oauth2Controller.passportController);
OauthRouter.get(
  "/auth/google/callback",
  Oauth2Controller.authenticateGoogle,
  Oauth2Controller.googleCallbackController,
);

export default OauthRouter;
