import { NextRequest, NextResponse } from "next/server";
import { comparePasswords, generateJWT } from "@/utils/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma";

/**
 * This is the POST handler for the login API route.
 * It expects a JSON payload with a username and password.
 * It checks if the provided credentials are valid, and if so, generates a JWT and returns it.
 *
 * @param req - The NextRequest object containing the incoming request.
 * @returns A NextResponse object containing a JSON payload with a message and a token on success, or an error message on failure.
 */
export async function POST(req: NextRequest) {
  // Parse the JSON payload from the request body
  const body = await req.json();

  // Destructure the username and password from the parsed JSON
  const { username, password } = body;

  try {
    // Try to find a user with the provided username in the database
    const user = await db.user.findUnique({
      where: { username },
    });

    // If no user is found, return an error response
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the hashed password stored in the user object
    const passwordMatches = await comparePasswords(password, user.password);

    // If the provided password does not match the hashed password, return an error response
    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // If the provided credentials are valid, generate a JWT using the user object
    const token = generateJWT(user);

    // Set the "access-token" cookie to the generated JWT
    cookies().set("access-token", token);

    // Return a JSON response with a success message and the token
    return NextResponse.json(
      { message: "Login successful!", token },
      { status: 200 }
    );
  } catch (error) {
    // If any error occurs during the process, log it and return an error response
    console.error(error);
    return NextResponse.json(
      { message: "Error logging in user" },
      { status: 500 }
    );
  }
}
