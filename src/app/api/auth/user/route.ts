import { getUserIdFromToken } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { serializeUser } from "../../user/UserSerializer";

export async function GET(request: NextRequest) {
  const userId = getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
        posts: {
          include: {
            author: true,
            images: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const serializedUser = await serializeUser(user);
    return NextResponse.json(serializedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
