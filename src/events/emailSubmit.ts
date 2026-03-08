import EventEmitter from "events";
import nodemailer from "nodemailer"
import crypto from "crypto"
require("dotenv").config()
import {db} from "../app"
//EMAIL SUBMIT FOR RESSETING PASSWORD
export const eventEmitter = new EventEmitter()
eventEmitter.on("emailSubmit",async (email)=>{
    try{
        console.log("running")
//creating token
const token : string = crypto.randomBytes(32).toString("hex")
//storing the token
await db.set(token,email,{EX:3600})
//setting transport 
const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
    user:process.env.EMAIL,
    pass:process.env.APPCODE
    }
})
await transport.sendMail({
to:email,
subject:"password reset link",
text:"hey there,click the button below to reset yout password",
html:`<button href =" localhost:9000/resetpassword?token=${token}">press</button>`
})
}catch(err){
    console.log(`error while sending code ${err}`)
}
})