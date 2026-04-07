import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = auth.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload !== "object" || !payload || !("sub" in payload)) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = payload as jwt.JwtPayload & { sub: string };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
