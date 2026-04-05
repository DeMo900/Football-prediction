//rImporting
import express from "express";
import mongoose from "mongoose";
import path from "path";
import currencyRouter from "./routes/currencyRoutes";
import OauthRouter from "./routes/Oauth2.0Routes";
import fixtureRouter from "./routes/fixtureRoutes";
import predectionRouter from "./routes/predictionRoutes";
import dashboardRouter from "./routes/dashboard";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import "./jobs/currencyDaily";
import "./jobs/resolvingBet";
import "./jobs/clearBets";
import "./lib/pg/db";
import dotenv from "dotenv";
dotenv.config();
const app = express();
//database connection
mongoose
  .connect(process.env.MONGO_URL!, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


//set
app.set("trust proxy", true);
//rMiddleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));
//using routes
app.use(authRouter);
app.use(OauthRouter);
app.use(currencyRouter);
app.use(fixtureRouter);
app.use(predectionRouter);
app.use(dashboardRouter);
//code

//rRoutes

//listening
const port = process.env.PORT || 9000;
app.listen(port, (err) => {
  if (err) {
    console.error("Error starting the server:", err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});

/*
what we need from the api ?
//game id 
//minutes elpased 
//teams
//teams logo
*/
