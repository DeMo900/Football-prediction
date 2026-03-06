import {z} from "zod";
import { $ZodUnknown } from "zod/v4/core";

//schema
const signUpSchema = z.object({
    username: z.string().nonempty("Username is required").min(3,{ message: "Username must be at least 3 characters long" })
    .max(20),

    email: z.email({ message: "Invalid email format" }),

    password: z.string().nonempty("password is required").min(6,{ message: "Password must be at least 6 characters long" }).max(100)
    .regex(/^(?=.*\d)[a-zA-Z0-9]{8,}$/,{message:"password must contain letters and numbers"}),

    confirmPassword : z.string().nonempty("confirm pasword is required")

}).refine((data)=>data.password === data.confirmPassword ,{
    message:"password don't match",
    path:["confirmPassword"]
})
//function
function validateSignUp(body:unknown){
return signUpSchema.safeParse(body);
}

export default validateSignUp