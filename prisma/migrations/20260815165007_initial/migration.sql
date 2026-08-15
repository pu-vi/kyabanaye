-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('MORNING_DRINK', 'MORNING_SNACK', 'BREAKFAST', 'BRUNCH', 'AFTERNOON_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER', 'DESSERT', 'DRINK');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "DishCategory" AS ENUM ('VEG', 'NON_VEG', 'EGG');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "recipeUrl" TEXT,
    "category" "DishCategory",
    "suggestedMealTypes" "MealType"[],
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" UUID,
    "meals" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedPlan" (
    "id" UUID NOT NULL,
    "sharerId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,

    CONSTRAINT "SharedPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dish_name_key" ON "Dish"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_date_userId_key" ON "MealPlan"("date", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedPlan_sharerId_receiverId_key" ON "SharedPlan"("sharerId", "receiverId");

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPlan" ADD CONSTRAINT "SharedPlan_sharerId_fkey" FOREIGN KEY ("sharerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPlan" ADD CONSTRAINT "SharedPlan_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
