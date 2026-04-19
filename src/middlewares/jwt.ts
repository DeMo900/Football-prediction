import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import "dotenv/config";
export default async function isAllowed(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.jwt;
  if (!token) {
    console.log(token + "token not found");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    console.log(token + "token found");
    const decode = JWT.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };
    req.user = decode;
    next();
  } catch (err) {
    console.error(`jwt verification failed: ${err}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
