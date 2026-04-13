
import path from "path";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import validateSignUp from "../validation/signUp";
import validateLogIn from "../validation/login";
import jwt from "jsonwebtoken";
import pool from "../lib/pg/db";
import { redis } from "../lib/redis";
import { eventEmitter } from "../events/emailSubmit";
import { body, validationResult } from "express-validator";
//GET SIGNUP
const signupGet = async (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "views", "signup.html"));
};
//POST SIGN UP
const signupPost = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    req.ip;
  if (!ip) {
    throw new Error("Invalid IP address");
  }
  try {
    //validation
    const validationResult = validateSignUp({
      username,
      email,
      password,
      confirmPassword,
    });
    if (!validationResult.success)
      return res
        .status(400)
        .json({ msg: validationResult.error.issues[0]!.message });
    //hashing
    const hashedPassword = await bcrypt.hash(password, 11);
    //storing
    await pool.query(
      "INSERT INTO users (username,email,password_hash,ip) VALUES($1,$2,$3,$4);",
      [username, email, hashedPassword, ip],
    );
    return res.status(201).json({ message: "user created" });
  } catch (error: any) {
    if (error.code === "23505") {
      //extracting the field name from the constraint
      const field = error.constraint?.includes("email") ? "email" : "username";
      return res
        .status(409)
        .json({ msg: `user with same ${field} already exists` });
    }
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//GET LOGIN
const loginGet = async (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "views", "login.html"));
};
//POST LOGIN
const loginPost = async (req: Request, res: Response) => {
  //body
  const { identifier, password } = req.body;
  try {
    //validation
    const validationResult = validateLogIn({ identifier, password });
    if (!validationResult.success)
      return res
        .status(400)
        .json({ msg: validationResult.error.issues[0]!.message });
    //checking if user with same data exist
    const user = await pool.query(
      "SELECT username,email,password_hash,id FROM users WHERE email=$1 OR username=$2;",
      [identifier, identifier],
    );
    if (user.rowCount === 0)
      return res
        .status(401)
        .json({ msg: "invalid username/email or password" });
    //cheching if password is correct
    const hashedPassword = user.rows[0].password_hash;
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect)
      return res
        .status(401)
        .json({ msg: "invalid username/email or password" });
    //creating jwt
    const token = jwt.sign(
      {
        username: user.rows[0].username,
        id: user.rows[0].id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//GET ENTER EMAIL
const enterEmailGet = async (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "views", "enteremail.html"));
};
//POST ENTER EMAIL
//validation
// validation middleware for email routes
const emailValidation = [
  body("email")
    .notEmpty()
    .withMessage("email can't be empty")
    .bail() // stop if empty
    .isEmail()
    .withMessage("Invalid email format"),
];

const submitEmailPost = async (req: Request, res: Response) => {
  try {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0]!.msg });
    }
    //checking if user exists
    const user = await pool.query("SELECT email FROM users WHERE email=$1", [
      req.body.email,
    ]);
    if (user.rowCount === 0)
      return res.status(404).json({ msg: "user not found" });
    //firing the emitter
    eventEmitter.emit("emailSubmit", user.rows[0].email);
    //responding
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).send(`internal server error ${err}`);
  }
};
//GET UPDATE PASSWORD
const updatePasswordGet = async (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "views", "resetpassword.html"));
};
//POST UPDATE PASSWORD
const passwordValidation = [
  body("password")
    .notEmpty()
    .withMessage("password can't be empty")
    .bail() // stop if empty
    .matches(/^[a-zA-Z0-9!@#$%^&*]{8,}$/)
    .withMessage("Invalid password format"),
];
const updatePasswordPost = async (req: Request, res: Response) => {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ msg: errors.array()[0]!.msg });
    //checking if token exists in db
    const token = req.query.token as string;
    if (!token) throw new Error("error");
    const email = await redis.get(token);
    if (!email) return res.status(404).json({ msg: "link is expired" });
    //hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    //storing
    const updateResult = await pool.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      [hashedPassword, email],
    );
    //checking if user was found
    if (updateResult.rowCount === 0)
      return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).send(`internal server error ${err}`);
  }
};
export {
  signupPost,
  loginPost,
  loginGet,
  submitEmailPost,
  updatePasswordPost,
  updatePasswordGet,
  emailValidation,
  passwordValidation,
  signupGet,
  enterEmailGet,
};
