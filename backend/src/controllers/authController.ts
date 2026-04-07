import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.register(req.body);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
