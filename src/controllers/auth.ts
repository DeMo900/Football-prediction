import User from "../models/user";
import express,{ Request,Response } from "express";
import bcrypt from "bcrypt";
import validateSignUp from "../validation/signUp";
import validateLogIn from "../validation/login";
import jwt from "jsonwebtoken"
import {z} from "zod";

//POST SIGN UP 
const signUpPost = async(req: Request,res: Response)=>{

const Body = req.body;
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
    });
    res.redirect("/login")
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
export {signUpPost,logInPost}