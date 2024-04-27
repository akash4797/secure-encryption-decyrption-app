"use server";
import { verifyJWT } from "./utils/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware function for handling authentication and redirects.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse|null>} A promise that resolves to a Next.js response object or null.
 */
export default async function middleware(req: NextRequest) {
  try {
    // Extract the "access-token" cookie from the request.
    const token = req.cookies.get("access-token")?.value;

    // If the token is missing, throw an error to trigger the catch block.
    if (!token) throw new Error();

    // Verify the JWT token using the verifyJWT function.
    const decodedToken = await verifyJWT(token);

    // If the request URL is for "/login" or "/register", check if the token is valid.
    if (
      req.nextUrl.pathname === "/signin" ||
      req.nextUrl.pathname === "/signup"
    ) {
      // If the token is valid, redirect to the root URL.
      if (decodedToken) {
        return NextResponse.redirect(new URL(`${req.nextUrl.origin}`), {
          status: 302,
        });
      }

      // If the token is invalid, return null to allow the request to continue.
      return null;
    }

    // If the token is invalid, redirect to the login page.
    if (!decodedToken) {
      return NextResponse.redirect(new URL(`${req.nextUrl.origin}/signin`), {
        status: 302,
      });
    }

    // If the request is not for "/login" or "/register", return null to allow the request to continue.
    return null;
  } catch (error) {
    // If the request URL is for "/login" or "/register", return null to allow the request to continue.
    if (
      req.nextUrl.pathname === "/signin" ||
      req.nextUrl.pathname === "/signup"
    ) {
      return null;
    }

    // If an error occurred, redirect to the login page.
    return NextResponse.redirect(new URL(`${req.nextUrl.origin}/signin`), {
      status: 302,
    });
  }
}

// Config for the middleware
export const config = {
  matcher: "/(signin|signup|)", // match all paths
};
