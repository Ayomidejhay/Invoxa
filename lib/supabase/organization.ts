import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { Organization, Profile } from "./database.types";

export interface OrgContext {
  user: { id: string; email: string | null };
  profile: Profile;
  organization: Organization;
}

/**
 * Fetches the current authenticated user's profile + organization on the
 * server. Use this at the top of any Server Component / layout that needs
 * tenant context instead of re-implementing the user -> profile -> org
 * lookup chain inline.
 *
 * Redirects to /login if there's no session, and to /onboarding if the
 * user exists but hasn't created or joined an organization yet.
 */
export async function requireOrgContext(): Promise<OrgContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (!profile.organization_id) {
    redirect("/onboarding");
  }

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", profile.organization_id)
    .single();

  if (orgError || !organization) {
    redirect("/onboarding");
  }

  return {
    user: { id: user.id, email: user.email ?? null },
    profile,
    organization,
  };
}
