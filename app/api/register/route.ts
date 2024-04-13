import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { username, password } = body;

  // Validate user input (optional)

  try {
    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Create new user in database
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Handle successful registration (e.g., send response)
    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 200 }
    );
    // res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 }
    );
    // res.status(500).json({ message: "Error registering user" });
  }
}
