import {z} from "zod";

function validate(body:object){
const signUpSchema = z.object({
    username: z.string().min(3,{ message: "Username must be at least 3 characters long" })
    .max(20).nonempty("Username is required"),

    email: z.email({ message: "Invalid email format" }).nonempty("Email is required"),

    password: z.string().min(6,{ message: "Password must be at least 6 characters long" }).max(100).nonempty("Password is required")
    .regex(/^[a-zA-Z0-9]{8,}$/),

    confirmPassword : z.string().nonempty("confirm pasword is required")

}).refine((data)=>data.password === data.confirmPassword ,{
    message:"password don't match",
    path:["confirmPassword"]
})
return signUpSchema.safeParse(body);
}
export default validate