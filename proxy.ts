import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

const AUTH_ROUTES = ["/login", "/signup", "/forget-password", "/verify-account"];
const PUBLIC_ROUTES = ["/", ...AUTH_ROUTES, "/accept-invite", "/auth/callback"];

// Next.js 16 renamed middleware.ts -> proxy.ts (and `middleware` -> `proxy`)
// to make explicit that this runs at the network boundary, not as an
// app-level auth system. Keep it that way: this only redirects/refreshes
// the session cookie. The real security boundary is RLS (see
// supabase/migrations/0001_foundation.sql) plus requireOrgContext() in the
// (Dashboard) layout and the explicit auth_org_id() checks inside every
// RPC — never assume this file caught everything.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // IMPORTANT: do not remove this. It refreshes the auth token if it's
  // expired, and is required for Server Components to reliably see a
  // logged-in session via lib/supabase/server.ts.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  if (!user && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and Next.js internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};