import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: { _id: string };
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Необходима авторизация" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = { _id: payload._id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};
