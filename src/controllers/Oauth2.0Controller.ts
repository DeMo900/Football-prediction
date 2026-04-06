import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../lib/pg/db"
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
        const user = await pool.query("SELECT * FROM users WHERE google_id = $1", [profile.id]);
        if (user.rows.length > 0) {
          return done(null, user.rows[0]);
        }
        const newUser = await pool.query("INSERT INTO users (google_id, username, email) VALUES ($1, $2, $3) RETURNING *", [profile.id, profile.displayName, (profile.emails![0] as any).value]);
        return done(null, newUser.rows[0]);
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
