import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");

    if (!token) return NextResponse.json({ message: "aha" });

    const decoded = await verifyJWT(token);

    const username = decoded?.payload.username;
    if (username) {
      const user = await db.user.findUnique({
        where: {
          username: `${username}`,
        },
        select: {
          username: true,
        },
      });

      return NextResponse.json({ user: user });
    }
  } catch (error) {
    return NextResponse.json({ username: "hello" });
  }
}
