import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { comparePasswords, generateJWT } from "@/utils/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract username and password from request body
  const { username, password } = req.body;

  // Validate user input (optional)

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Handle invalid username
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare hashed password with provided password
    const passwordMatches = await comparePasswords(password, user.password);

    if (!passwordMatches) {
      // Handle invalid password
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT on successful login
    const token = generateJWT(user);

    // Handle successful login (e.g., generate token, send response)
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
}
