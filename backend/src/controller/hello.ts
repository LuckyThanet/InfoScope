import { Request, Response } from "express";
import { logger } from "../utils/logger";

export const getHello = (_req: Request, res: Response) => {
  logger("GET /api/hello called");
  res.json({ message: "Hello from controller!" });
};