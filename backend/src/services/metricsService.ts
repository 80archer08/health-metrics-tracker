import { prisma } from "../utils/prisma";

export const metricsService = {
  async getAll(userId: number) {
    return prisma.healthMetric.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  },

  async create(userId: number, data: any) {
    return prisma.healthMetric.create({
      data: {
        userId,
        date: new Date(data.date),
        heartRate: data.heartRate,
        steps: data.steps,
        sleepHours: data.sleepHours,
        calories: data.calories,
        weight: data.weight,
        bloodPressureSys: data.bloodPressureSys,
        bloodPressureDia: data.bloodPressureDia,
        glucose: data.glucose,
      },
    });
  },

  async delete(userId: number, metricId: number) {
    const metric = await prisma.healthMetric.findFirst({
      where: { id: metricId, userId },
    });

    if (!metric) {
      throw Object.assign(new Error("Metric not found"), { status: 404 });
    }

    return prisma.healthMetric.delete({
      where: { id: metricId },
    });
  },
};
