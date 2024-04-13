import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";

/*
 * This is a GET API route handler. It is designed to handle incoming GET requests.
 * The purpose of this route handler is to fetch user information from the database
 * based on a provided JWT token.
 *
 * Parameters:
 * - req: The NextRequest object containing the incoming request.
 *
 * Returns:
 * - NextResponse object containing a JSON payload with user information on success.
 * - NextResponse object containing a JSON payload with an error message on failure.
 */
export async function GET(req: NextRequest) {
  try {
    // Get the authorization token from the request headers.
    const token = req.headers.get("Authorization");

    // If no token is provided, return a JSON response with an error message.
    if (!token) return NextResponse.json({ message: "Invalid token" });

    // Verify the provided token and decode its payload.
    const decoded = await verifyJWT(token);

    // Get the username from the decoded payload.
    const username = decoded?.payload.username;

    // If no username is provided, return a JSON response with an error message.
    if (!username) return NextResponse.json({ message: "Invalid token" });

    // Use the Prisma ORM to find a user with the provided username in the database.
    // Select only the username field.
    const user = await db.user.findUnique({
      where: {
        username: `${username}`,
      },
      select: {
        username: true,
      },
    });

    // If a user is found, return a JSON response with the user information.
    if (user) {
      return NextResponse.json({ user: user });
    }
  } catch (error) {
    // If there is an error during the process, return a JSON response with an error message.
    return NextResponse.json({ message: "Authorization failed" });
  }
}
