import { NextRequest, NextResponse } from "next/server";
import { comparePasswords, generateJWT } from "@/utils/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { username, password } = body;

  try {
    // Find user by username
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Handle invalid username
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare hashed password with provided password
    const passwordMatches = await comparePasswords(password, user.password);

    if (!passwordMatches) {
      // Handle invalid password
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate JWT on successful login
    const token = generateJWT(user);

    // Handle successful login (e.g., generate token, send response)
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
