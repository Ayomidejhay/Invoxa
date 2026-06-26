import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
  }

  // Explicit destination (e.g. password recovery links set next=/reset-password)
  // always wins over the default onboarding/dashboard routing below.
  if (next) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  // The signup trigger always creates a bare profile row, but it has no
  // organization yet for a first-time OAuth sign-in — send those users to
  // onboarding instead of straight to a dashboard that will just bounce them.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
