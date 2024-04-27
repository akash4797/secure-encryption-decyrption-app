import { NextRequest, NextResponse } from "next/server";
import { comparePasswords, generateJWT } from "@/utils/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  try {
    const user = await db.user.findUnique({ where: { username } });
    if (!user)
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    const passwordMatches = await comparePasswords(password, user.password);
    if (!passwordMatches)
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    const token = generateJWT(user);
    cookies().set("access-token", token);
    return NextResponse.json(
      { message: "Login successful!", token },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error logging in user" },
      { status: 500 }
    );
  }
}
