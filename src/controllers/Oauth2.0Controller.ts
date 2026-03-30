import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user";
import dotenv from "dotenv";
dotenv.config();
//code
passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: "http://localhost:9000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here you would typically find or create a user in your database
      try {
        const user = await userModel.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }
        const newUser = new userModel({
          googleId: profile.id,
          username: profile.displayName,
          email: (profile.emails![0] as any).value,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

async function passportController(req: Request, res: Response) {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
}

const authenticateGoogle = passport.authenticate("google", {
  failureRedirect: "/",
  session: false,
});

async function googleCallbackController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token: string = jwt.sign(
    { id: (req.user as any).id, email: (req.user as any).email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3600000, // 1 hour
  });
  return res.redirect("/fixtures/live");
}

export { passportController, googleCallbackController, authenticateGoogle };
