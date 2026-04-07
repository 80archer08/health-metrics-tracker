import { Request, Response, NextFunction } from "express";
import { metricsService } from "../services/metricsService";

export const metricsController = {
  getMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const metrics = await metricsService.getAll(userId);
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  },

  createMetric: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const metric = await metricsService.create(userId, req.body);
      res.status(201).json(metric);
    } catch (err) {
      next(err);
    }
  },

  deleteMetric: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const metricId = Number(req.params.id);

      await metricsService.delete(userId, metricId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
