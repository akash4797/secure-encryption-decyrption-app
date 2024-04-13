import { hashPassword } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

/**
 * This is the POST handler for the register API route.
 *
 * It expects a JSON payload with a "username" and "password" field.
 *
 * First, it validates the input. However, in this example, it's left empty
 * as there is no input validation.
 *
 * Then, it hashes the password using the "hashPassword" function
 * from the "@/utils/auth" module.
 *
 * Next, it creates a new user in the database using the Prisma ORM.
 * The user object has the provided "username" and the hashed "password".
 *
 * If the user is successfully created, it responds with a JSON object
 * containing a success message and a status code of 200.
 *
 * If there is an error, it logs the error and responds with a JSON object
 * containing an error message and a status code of 500.
 *
 * @param req - The NextRequest object containing the incoming request.
 * @returns A NextResponse object containing a JSON payload with a message and a status code.
 */
export async function POST(req: NextRequest) {
  // Parse the JSON payload from the request body
  const body = await req.json();

  // Destructure the "username" and "password" fields from the parsed JSON
  const { username, password } = body;

  try {
    // Hash the password using the "hashPassword" function from "@/utils/auth"
    const hashedPassword = await hashPassword(password);

    // Create a new user in the database using the Prisma ORM
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Respond with a success message and status code 200
    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 200 }
    );
  } catch (error) {
    // Log the error and respond with an error message and status code 500
    console.error(error);
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 }
    );
  }
}
