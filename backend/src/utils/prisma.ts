type UserRecord = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type HealthMetricRecord = {
  id: number;
  userId: number;
  date: Date;
  heartRate: number | null;
  steps: number | null;
  sleepHours: number | null;
  calories: number | null;
  weight: number | null;
  bloodPressureSys: number | null;
  bloodPressureDia: number | null;
  glucose: number | null;
};

type PrismaClientLike = {
  user: {
    findUnique: (args: unknown) => Promise<UserRecord | null>;
    create: (args: unknown) => Promise<UserRecord>;
  };
  healthMetric: {
    findMany: (args: unknown) => Promise<HealthMetricRecord[]>;
    findUnique: (args: unknown) => Promise<HealthMetricRecord | null>;
    create: (args: unknown) => Promise<HealthMetricRecord>;
    delete: (args: unknown) => Promise<HealthMetricRecord>;
  };
};

let prismaInstance: PrismaClientLike = {} as PrismaClientLike;

if (process.env.NODE_ENV !== "test") {
  const prismaModule = await import("@prisma/client");
  const PrismaClientCtor = (prismaModule as { PrismaClient?: new () => PrismaClientLike }).PrismaClient;

  if (!PrismaClientCtor) {
    throw new Error(
      "PrismaClient is unavailable. Run `npm run prisma:generate` and ensure prisma/@prisma/client versions match.",
    );
  }

  prismaInstance = new PrismaClientCtor();
}

export const prisma = prismaInstance;
