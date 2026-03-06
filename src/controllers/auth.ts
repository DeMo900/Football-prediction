import User from "../models/user";
import express,{ Request,Response } from "express";
import bcrypt from "bcrypt";
import validate from "../validation/signUp";
import {z} from "zod";

const signUpPost = async(req: Request,res: Response)=>{
interface body {
    username: string;
    email: string;
    password: string;
    confirmPassword:string;
}
const Body = req.body as body;
try {
    //validation
    const validationResult = validate(Body);
    if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.error.issues[0]!.message});
    }
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
export default signUpPost