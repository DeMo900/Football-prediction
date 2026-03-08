import User from "../models/user";
import express,{ Request,Response } from "express";
import bcrypt from "bcrypt";
import validateSignUp from "../validation/signUp";
import validateLogIn from "../validation/login";
import jwt from "jsonwebtoken"
import {db} from "../app"
import {eventEmitter} from "../events/emailSubmit"
import { body,validationResult } from "express-validator";

//POST SIGN UP 
const signUpPost = async(req: Request,res: Response)=>{

const Body = req.body;
const ip =   req.headers["x-forwarded-for"]?.toString().split(",")[0] || 
    req.socket.remoteAddress ||
    req.ip
    if (!ip){
        throw Error("invalid ip adress")
    }
try {
    //validation
    const validationResult = validateSignUp(Body);
    if (!validationResult.success) return res.status(400).json({ errors: validationResult.error.issues[0]!.message});
    //checking if user with same data exist
    const isFound = await User.findOne({$or:[{username:Body.username},{email:Body.email}]})
    if(isFound) return res.status(401).json("user with same email/username already exists")
    //hashing
    const hashedPassword = await bcrypt.hash(Body.password, 11);
    //storing
    const user = await User.create({
        username: Body.username,
        email: Body.email,
        password: hashedPassword,
        ip:[ip]
    });
    return res.status(201).json({message:"user created"})
  //return res.redirect("/login")
}catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
}
}
//POST LOGIN
const logInPost = async(req:Request,res:Response)=>{
 //body
 const {identifier,password} = req.body;
 try{
 //validation
 const validationResult = validateLogIn({identifier,password})
 if (!validationResult.success) return res.status(400).json({ errors: validationResult.error.issues[0]!.message});
 //checking if user with same data exist
    const isFound = await User.findOne({$or:[{username:identifier},{email : identifier}]})
    if(!isFound) return res.status(401).json({msg:"invalid username or password"})
  //cheching if password is correct
const hashedPassword = isFound.password;
const isEqual = await bcrypt.compare(password,hashedPassword!)
if(!isEqual) return res.status(401).json({msg:"invalid username or password"})
//creating jwt
const token = jwt.sign({
    username:isFound.username,
    _id:isFound._id
},process.env.JWT_SECRET!,
{expiresIn:"1h"})
 res.cookie("jwt",token,{
     httpOnly: true,
    secure:true,
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
}
)
return res.json("loggeed in")
 }catch(error){
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Internal server error" });
 }
}
//POST ENTER EMAIL
//validation
// validation middleware for email routes
const emailValidation = [
  body("email")
    .notEmpty().withMessage("email can't be empty")
    .bail() // stop if empty
    .isEmail().withMessage("Invalid email format")
];

const submitEmailPost = async (req:Request,res:Response)=>{
    try{
        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0]!.msg});
        }
        //checking if user exists
const user = await User.findOne({email:req.body.email})
.select("-password")
.select("-username")
.select("-_id")
if(!user) return res.status(404).json({message:"user not found"})
//firing the emitter
eventEmitter.emit("emailSubmit",user.email)
//responding
res.status(200).json({message:"email sent sucsessfully"})
    }catch(err){
        res.status(500).send("internal server error")
    }
}
//POST UPDATE PASSWORD
const passwordValidation = [
  body("password")
    .notEmpty().withMessage("email can't be empty")
    .bail() // stop if empty
    .matches(/^(?=.*\d)[a-zA-Z0-9]{8,}$/).withMessage("Invalid email format")
];
const updatePasswordPost = async(req:Request,res:Response)=>{
    try{
//checking if token exists in db 
const token = req.query.token as string
if(!token) throw new Error("error");
const email = await db.get(token) 
if (!email) return res.status(404).json({msg:"link is expired"})
    //getting user
const user =await User.findOne({email})
if (!user) return res.status(404).json({msg:"user not found "})
    //hashing the password
const hashedPassword =await bcrypt.hash(req.body.password,11)
//storing
user.password = hashedPassword
await user.save()
    }catch(err){
        res.status(500).send("internal server error")
    }
}
export {signUpPost,logInPost,submitEmailPost,updatePasswordPost,emailValidation,passwordValidation}