"use server";
import { verifyJWT } from "./utils/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("access-token")?.value;
    // Check JWT token using verifyJWT function
    if (!token) throw new Error();
    const decodedToken = await verifyJWT(token);

    // If the path is "/login" or "/register"
    if (
      req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/register"
    ) {
      // If token is valid, redirect to "/" page
      if (decodedToken) {
        return NextResponse.redirect(new URL(`${req.nextUrl.origin}`), {
          status: 302,
        });
      }
      // If token is invalid, no redirection needed
      return null;
    }

    // For other paths including "/", check token validity
    if (!decodedToken) {
      return NextResponse.redirect(new URL(`${req.nextUrl.origin}/login`), {
        status: 302,
      });
    }

    // If token is valid for other paths, no redirection needed
    return null;
  } catch (error) {
    if (
      req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/register"
    ) {
      return null;
    }
    return NextResponse.redirect(new URL(`${req.nextUrl.origin}/login`), {
      status: 302,
    });
  }
}

export const config = {
  // Define the matcher for the middleware
  matcher: "/(login|register|)",
};
