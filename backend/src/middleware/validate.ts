import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues,
        });
      }

      return res.status(500).json({ message: "Validation failed" });
    }
  };
