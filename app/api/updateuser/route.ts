import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { encryptData } from "@/utils/EncryptionAndDepcryption";
import { verifyJWT } from "@/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");
    const decoded = await verifyJWT(token || "");
    if (!decoded)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    const body = await req.json();
    const { username, email, phone, location, bio, post } = body;
    const encryptEmail = await encryptData(email);
    const encryptPhone = await encryptData(phone);
    const encryptLocation = await encryptData(location);
    const encryptBio = await encryptData(bio);
    const encryptPost = await encryptData(post);
    const user = await db.user.update({
      where: { username },
      data: {
        email: encryptEmail as string,
        phone: encryptPhone as string,
        location: encryptLocation as string,
        bio: encryptBio as string,
        post: encryptPost as string,
      },
    });
    if (user) return NextResponse.json(user, { status: 200 });
    else
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
