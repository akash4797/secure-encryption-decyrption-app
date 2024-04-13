import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/utils/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract user information from request body
  const { username, password } = req.body;

  // Validate user input (optional)

  try {
    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Create new user in database
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        // Other user information fields (if any)
      },
    });

    // Handle successful registration (e.g., send response)
    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
}
