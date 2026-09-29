import { NextResponse, type NextRequest } from "next/server";
import { openSession, sealSession, SESSION_COOKIE, SESSION_MAX_AGE, touchSession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login") || pathname.startsWith("/admin/logout")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await openSession(token, request.headers.get("user-agent") ?? "");
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    if (token) url.searchParams.set("expired", "1");
    const response = NextResponse.redirect(url);
    response.cookies.delete({ name: SESSION_COOKIE, path: "/admin" });
    return response;
  }

  const response = NextResponse.next();
  const now = Math.floor(Date.now() / 1000);
  if (now - session.lastActivity >= 60) {
    response.cookies.set(SESSION_COOKIE, await sealSession(touchSession(session)), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
      maxAge: SESSION_MAX_AGE,
    });
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
