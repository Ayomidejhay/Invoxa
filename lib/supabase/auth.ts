// import { supabase } from "./client";

// // LOGIN
// export async function signIn(email: string, password: string) {
//   return await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
// }

// // SIGNUP
// export async function signUp(email: string, password: string) {
//   return await supabase.auth.signUp({
//     email,
//     password,
//   });
// }

// // GOOGLE
// export async function signInWithGoogle() {
//   return await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: `${location.origin}/auth/callback`,
//     },
//   });
// }

// // LOGOUT
// export async function signOut() {
//   return await supabase.auth.signOut();
// }

import { getSupabaseClient } from "./client";

// LOGIN
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// SIGNUP
export async function signUp(email: string, password: string) {
  const supabase = getSupabaseClient();

  return await supabase.auth.signUp({
    email,
    password,
  });
}

// GOOGLE
export async function signInWithGoogle() {
  const supabase = getSupabaseClient();

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
}

// LOGOUT
export async function signOut() {
  const supabase = getSupabaseClient();

  return await supabase.auth.signOut();
}