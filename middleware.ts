import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user ? (req.auth.user as { role?: string }).role : undefined;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/masuk", req.nextUrl));
  }
  if (pathname.startsWith("/mitra") && role !== "mitra_jasa" && role !== "mitra_penginapan") {
    return NextResponse.redirect(new URL("/masuk", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/mitra/:path*"],
};
