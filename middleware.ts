import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🟢 Middleware is running!");
  /* const token = request.cookies.get("authToken")?.value; */
  /*  console.log("Token from middleware:", token); */
  /*  console.log(token);

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
 */
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  // ✅ Bypass video upload (jika perlu)
  if (
    request.nextUrl.pathname.startsWith("/api/vesselDrillForCrew/saveVideo")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("authToken")?.value;
  console.log(token);
  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    /*  "/api/:path*", */
    "/vesselAssessment/:path*",
    "/vesselDrill/:path*",
    "/assessmentCompare/:path*",
    "/assessmentCategory/:path*",
    "/shipSection/:path*",
    "/interval/:path*",
    "/item/:path*",
    "/drillCategory/:path*",
  ],
};
