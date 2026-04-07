import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const normalized =
    err instanceof Error
      ? { message: err.message, stack: err.stack }
      : { message: "Unknown error", stack: undefined };

  logger.error("Unhandled error", normalized);

  const status =
    typeof err === "object" && err !== null && "status" in err && typeof (err as { status?: number }).status === "number"
      ? (err as { status: number }).status
      : 500;

  res.status(status).json({ error: normalized.message || "Internal Server Error" });
}
