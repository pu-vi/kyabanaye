import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr + "T00:00:00.000Z");
    const endDate = new Date(endDateStr + "T23:59:59.999Z");

    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) {
      where.userId = userId;
    } else {
      return NextResponse.json([]);
    }

    const plans = await prisma.mealPlan.findMany({
      where,
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, startDate: startDateStr, endDate: endDateStr, plans } = body;

    if (!startDateStr || !endDateStr || !userId) {
      return NextResponse.json(
        { error: "userId, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr + "T00:00:00.000Z");
    const endDate = new Date(endDateStr + "T23:59:59.999Z");

    await prisma.$transaction([
      prisma.mealPlan.deleteMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.mealPlan.createMany({
        data: plans.map((p: any) => ({
          date: new Date(p.date + "T00:00:00.000Z"),
          userId,
          meals: p.meals,
        })),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save meal plans:", error);
    return NextResponse.json(
      { error: "Failed to save meal plans", details: String(error) },
      { status: 500 }
    );
  }
}
