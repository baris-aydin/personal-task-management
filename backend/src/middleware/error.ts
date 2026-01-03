import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).json({ error: "Server error" });
}
