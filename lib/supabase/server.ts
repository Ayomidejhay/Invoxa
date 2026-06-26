import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Server-side Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Uses the current getAll/setAll cookie API — the
 * older get/set/remove trio is deprecated and, more importantly, doesn't
 * compose correctly with the middleware session-refresh pattern.
 *
 * The try/catch around setAll is intentional: Server Components can't write
 * cookies, and Next.js throws if you try. Middleware is what actually
 * refreshes the session in that case — see middleware.ts.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — safe to ignore, middleware
            // handles refreshing the session cookie on the next request.
          }
        },
      },
    }
  );
}
