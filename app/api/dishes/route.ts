import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DishCategory, MealType } from "@prisma/client";

const mealTypeMap: Record<string, MealType> = {
  "morning-drink": MealType.MORNING_DRINK,
  "morning-snack": MealType.MORNING_SNACK,
  "breakfast": MealType.BREAKFAST,
  "brunch": MealType.BRUNCH,
  "afternoon-snack": MealType.AFTERNOON_SNACK,
  "lunch": MealType.LUNCH,
  "evening-snack": MealType.EVENING_SNACK,
  "dinner": MealType.DINNER,
  "dessert": MealType.DESSERT,
  "drink": MealType.DRINK,
};

const categoryMap: Record<string, DishCategory> = {
  veg: DishCategory.VEG,
  egg: DishCategory.EGG,
  nonveg: DishCategory.NON_VEG,
};

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const where = {
    OR: [
      { userId: null },
      ...(userId ? [{ userId }] : []),
    ],
  };

  const [dishes, total] = await Promise.all([
    prisma.dish.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        category: true,
        suggestedMealTypes: true,
        userId: true,
      },
    }),
    prisma.dish.count({ where }),
  ]);

  return NextResponse.json({
    dishes,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, recipeUrl, category, selectedMealTypes, userId } = body;

  if (!name?.trim() || !selectedMealTypes?.length) {
    return NextResponse.json({ error: "Name and meal types are required" }, { status: 400 });
  }

  const dish = await prisma.dish.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      recipeUrl: recipeUrl?.trim() || null,
      category: category ? categoryMap[category] ?? null : null,
      suggestedMealTypes: selectedMealTypes.map((t: string) => mealTypeMap[t]).filter(Boolean),
      userId: userId ?? null,
    },
  });

  return NextResponse.json(dish, { status: 201 });
}
