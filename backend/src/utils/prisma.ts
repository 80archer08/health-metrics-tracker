import { PrismaClient } from "@prisma/client";

export const prisma =
  process.env.NODE_ENV === "test"
    ? ({} as PrismaClient)
    : new PrismaClient();
