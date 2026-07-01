import { getSupabaseClient } from "./client";

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
}

export async function signInWithGoogle(next?: string) {
  const supabase = getSupabaseClient();
  const redirectTo = next
    ? `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    : `${location.origin}/auth/callback`;

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });
}

export async function signOut() {
  const supabase = getSupabaseClient();
  return await supabase.auth.signOut();
}
