-- AlterTable
ALTER TABLE "HealthMetric" ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "sleepHours" DOUBLE PRECISION,
ADD COLUMN     "steps" INTEGER,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "HealthMetric_userId_date_idx" ON "HealthMetric"("userId", "date");
