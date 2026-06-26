"use client";

import { createContext, useContext } from "react";
import type { Organization, Profile } from "@/lib/supabase/database.types";

interface OrganizationContextValue {
  profile: Profile;
  organization: Organization;
  isOwnerOrAdmin: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({
  profile,
  organization,
  children,
}: {
  profile: Profile;
  organization: Organization;
  children: React.ReactNode;
}) {
  const value: OrganizationContextValue = {
    profile,
    organization,
    isOwnerOrAdmin: profile.role === "owner" || profile.role === "admin",
  };

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

/**
 * Access the current tenant's profile/organization/role from any client
 * component inside the (Dashboard) layout. Throws if used outside it —
 * that's intentional, it means a component was rendered somewhere it
 * shouldn't assume tenant context exists.
 */
export function useOrganization() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error("useOrganization() must be used within OrganizationProvider");
  }
  return ctx;
}
