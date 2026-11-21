//rImporting
import express from "express";
import path from "path";
import currencyRouter from "./routes/currency.routes";
import googleAuthRouter from "./routes/google-auth.routes";
import fixtureRouter from "./routes/fixtures.routes";
import predictionRouter from "./routes/predictions.routes";
import dashboardRouter from "./routes/dashboard.routes";
import authRouter from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import "./jobs/resolving-bet.job";
import "./jobs/clear-wins.job";
import dotenv from "dotenv";
dotenv.config();
const app = express();
//set
app.set("trust proxy", true);
//rMiddleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));
//using routes
app.use(authRouter);
app.use(googleAuthRouter);
app.use(currencyRouter);
app.use(fixtureRouter);
app.use(predictionRouter);
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
