import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import  nextConfig  from "../next.config";

export async function middleware(req, ev) {
  const session = await getToken({ req: req, secret: process.env.SECRET });

  // Allow to access post login page if session exist
  if (session) return NextResponse.next();

  // Add exception to allow request without session
  let unprotectedRoutes = [
    "/logo.png",
    "/favicon.ico",
  ];
  if (unprotectedRoutes.includes(req.url.replace(nextConfig.server, ""))) {
    return NextResponse.next();
  }

  if (
    req.url.indexOf("/api/auth/") >= 0 ||
    req.url.indexOf("/auth_failure") >= 0
  ) {
    return NextResponse.next();
  }

  // Stop redirection loop for login page
  if (!req.url.includes("/login")) {
    return NextResponse.redirect(`${nextConfig.server}/login`);
  }
}