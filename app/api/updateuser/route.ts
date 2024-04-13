import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { encryptData } from "@/utils/EncryptionAndDepcryption";
import { verifyJWT } from "@/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");

    if (!token) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const { username, email, phone, location } = body;

    const encryptEmail = await encryptData(email);
    const encryptPhone = await encryptData(phone);
    const encryptLocation = await encryptData(location);

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

    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
