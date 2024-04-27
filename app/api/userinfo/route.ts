import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { verifyJWT } from "@/utils/auth";
import { decryptData } from "@/utils/EncryptionAndDepcryption";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");

    if (!token) return NextResponse.json({ message: "Invalid token" });

    const decoded = await verifyJWT(token);

    const username = decoded?.payload.username;

    if (!username) return NextResponse.json({ message: "Invalid token" });

    const user = await db.user.findUnique({
      where: {
        username: `${username}`,
      },
      select: {
        username: true,
        email: true,
        phone: true,
        location: true,
        bio: true,
        post: true,
        gender: true,
      },
    });

    if (user) {
      const userEmail = await decryptData(user.email);
      const userPhone = await decryptData(user.phone);
      const userLocation = await decryptData(user.location);
      const userbio =
        user.bio != null ? await decryptData(user.bio!) : user.bio;
      const userpost =
        user.post != null ? await decryptData(user.post!) : user.post;
      const userData = {
        username: user.username,
        email: userEmail,
        phone: userPhone,
        location: userLocation,
        bio: userbio,
        post: userpost,
        gender: user.gender,
      };
      return NextResponse.json({ user: userData });
    }
  } catch (error) {
    return NextResponse.json({ message: "Authorization failed" });
  }
}
