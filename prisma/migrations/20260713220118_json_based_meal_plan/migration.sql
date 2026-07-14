/*
  Warnings:

  - You are about to drop the `MealPlanEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MealPlanEntry" DROP CONSTRAINT "MealPlanEntry_dishId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlanEntry" DROP CONSTRAINT "MealPlanEntry_userId_fkey";

-- DropTable
DROP TABLE "MealPlanEntry";

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" UUID,
    "meals" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_date_userId_key" ON "MealPlan"("date", "userId");

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
