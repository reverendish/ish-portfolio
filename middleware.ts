import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUBDOMAIN_ROUTES: Record<string, string> = {
  outreach: "/tools/outreach-agent",
  social: "/tools/social-posts",
};

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  const target = SUBDOMAIN_ROUTES[subdomain];
  if (target && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
