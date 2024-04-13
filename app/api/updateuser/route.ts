import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { encryptData } from "@/utils/EncryptionAndDepcryption";
import { verifyJWT } from "@/utils/auth";

/**
 * This is a POST handler for the update user API route.
 *
 * It expects a JSON payload with a "username", "email", "phone", and "location" field.
 * It also expects a valid JWT token in the "Authorization" header.
 *
 * The function first verifies the JWT token and decodes its payload.
 * If the token is invalid, it returns a JSON response with a 401 status code and an "Invalid token" message.
 *
 * Then it extracts the "username", "email", "phone", and "location" fields from the JSON payload.
 *
 * It uses the "encryptData" function to encrypt the "email", "phone", and "location" fields.
 *
 * Next, it uses the Prisma ORM to update a user in the database with the provided "username".
 * The updated fields are the encrypted "email", "phone", and "location".
 *
 * If the user is successfully updated, it returns a JSON response with the updated user data and a 200 status code.
 * If there is an error updating the user, it returns a JSON response with an "Something went wrong" message and a 500 status code.
 *
 * If any error occurs during the execution of the function, it returns a JSON response with an "Something went wrong" message and a 500 status code.
 */
export async function POST(req: NextRequest) {
  try {
    // Extract the JWT token from the "Authorization" header
    const token = req.headers.get("Authorization");

    // Verify the JWT token and decode its payload
    const decoded = await verifyJWT(token || "");

    // If the token is invalid, return a JSON response with a 401 status code and an "Invalid token" message
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Parse the JSON payload from the request body
    const body = await req.json();

    // Destructure the "username", "email", "phone", and "location" fields from the parsed JSON
    const { username, email, phone, location } = body;

    // Encrypt the "email", "phone", and "location" fields
    const encryptEmail = await encryptData(email);
    const encryptPhone = await encryptData(phone);
    const encryptLocation = await encryptData(location);

    // Use the Prisma ORM to update a user in the database with the provided "username"
    const user = await db.user.update({
      where: {
        username,
      },
      data: {
        email: encryptEmail,
        phone: encryptPhone,
        location: encryptLocation,
      },
    });

    // If the user is successfully updated, return a JSON response with the updated user data and a 200 status code
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      // If there is an error updating the user, return a JSON response with an "Something went wrong" message and a 500 status code
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  } catch (error) {
    // If any error occurs during the execution of the function, return a JSON response with an "Something went wrong" message and a 500 status code
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
