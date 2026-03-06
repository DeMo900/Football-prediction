import {z} from "zod";

//schema
const logInSchema = z.object({
identifier:z.union([
   z.email(),
   z.string().nonempty("Username is required")
]),
password:z.string().nonempty("password is required")
})
//function
function validateLogIn(body:unknown){
return logInSchema.safeParse(body);
}

export default validateLogIn