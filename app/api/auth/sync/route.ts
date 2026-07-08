import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required for syncing" },
        { status: 400 }
      );
    }

    // Look up the user by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // If user exists, but name changed or was null, update it
      if (name && user.name !== name) {
        user = await prisma.user.update({
          where: { email },
          data: { name },
        });
      }
    } else {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          role: "USER", // Default role
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in auth sync:", error);
    return NextResponse.json(
      { error: "Failed to sync user data", details: String(error) },
      { status: 500 }
    );
  }
}
