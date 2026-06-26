// "use client";

// import { useEffect, useState } from "react";
// import { getSupabaseClient } from "@/lib/supabase/client";
// import { useOrganization } from "../../components/OrganizationProvider";
// import type { Profile, TeamInvite } from "@/lib/supabase/database.types";

// export function TeamTab() {
//   const supabase = getSupabaseClient();
//   const { organization, profile: me, isOwnerOrAdmin } = useOrganization();

//   const [members, setMembers] = useState<Profile[]>([]);
//   const [invites, setInvites] = useState<TeamInvite[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const [inviteEmail, setInviteEmail] = useState("");
//   const [inviteRole, setInviteRole] = useState<"admin" | "staff">("staff");
//   const [inviting, setInviting] = useState(false);

//   const loadData = async () => {
//     setLoading(true);
//     setError(null);

//     const [{ data: membersData, error: membersError }, { data: invitesData, error: invitesError }] =
//       await Promise.all([
//         supabase
//           .from("profiles")
//           .select("*")
//           .eq("organization_id", organization.id)
//           .order("created_at", { ascending: true }),
//         supabase
//           .from("team_invites")
//           .select("*")
//           .eq("organization_id", organization.id)
//           .eq("status", "pending")
//           .order("created_at", { ascending: false }),
//       ]);

//     if (membersError || invitesError) {
//       setError(membersError?.message || invitesError?.message || "Failed to load team");
//     } else {
//       setMembers(membersData ?? []);
//       setInvites(invitesData ?? []);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [organization.id]);

//   const flashSuccess = (message: string) => {
//     setSuccess(message);
//     setTimeout(() => setSuccess(null), 3000);
//   };

//   const handleInvite = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!inviteEmail.trim()) {
//       setError("Enter an email address to invite");
//       return;
//     }

//     setInviting(true);
//     const { error: insertError } = await supabase.from("team_invites").insert({
//       organization_id: organization.id,
//       email: inviteEmail.trim().toLowerCase(),
//       role: inviteRole,
//       invited_by: me.id,
//     });
//     setInviting(false);

//     if (insertError) {
//       setError(
//         insertError.code === "23505"
//           ? "There's already a pending invite for this email"
//           : insertError.message
//       );
//       return;
//     }

//     setInviteEmail("");
//     flashSuccess("Invite sent");
//     loadData();
//   };

//   const handleRevoke = async (inviteId: string) => {
//     const { error: revokeError } = await supabase
//       .from("team_invites")
//       .update({ status: "revoked" })
//       .eq("id", inviteId);

//     if (revokeError) {
//       setError(revokeError.message);
//       return;
//     }
//     flashSuccess("Invite revoked");
//     loadData();
//   };

//   const handleCopyLink = async (token: string) => {
//     const url = `${window.location.origin}/accept-invite?token=${token}`;
//     await navigator.clipboard.writeText(url);
//     flashSuccess("Invite link copied");
//   };

//   const handleRemove = async (memberId: string) => {
//     const { error: rpcError } = await supabase.rpc("remove_team_member", { p_profile_id: memberId });
//     if (rpcError) {
//       setError(rpcError.message);
//       return;
//     }
//     flashSuccess("Team member removed");
//     loadData();
//   };

//   const handleRoleChange = async (memberId: string, role: "admin" | "staff") => {
//     const { error: rpcError } = await supabase.rpc("update_team_member_role", {
//       p_profile_id: memberId,
//       p_role: role,
//     });
//     if (rpcError) {
//       setError(rpcError.message);
//       return;
//     }
//     flashSuccess("Role updated");
//     loadData();
//   };

//   if (loading) {
//     return <div className="bg-white p-6 rounded-2xl shadow-sm">Loading...</div>;
//   }

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8 relative">
//       <h2 className="text-lg font-semibold">Team</h2>

//       {error && <p className="text-sm text-red-500">{error}</p>}
//       {success && (
//         <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
//           {success}
//         </div>
//       )}

//       <div className="space-y-3">
//         <h3 className="font-medium text-sm text-gray-600">Members</h3>
//         <div className="divide-y border rounded-xl overflow-hidden">
//           {members.map((member) => (
//             <div key={member.id} className="flex items-center justify-between p-4">
//               <div>
//                 <p className="font-medium">
//                   {member.full_name || member.email}
//                   {member.id === me.id && <span className="text-gray-400"> (you)</span>}
//                 </p>
//                 <p className="text-sm text-gray-500">{member.email}</p>
//               </div>

//               <div className="flex items-center gap-3">
//                 {isOwnerOrAdmin && member.role !== "owner" && member.id !== me.id ? (
//                   <select
//                     value={member.role}
//                     onChange={(e) => handleRoleChange(member.id, e.target.value as "admin" | "staff")}
//                     className="border rounded-lg px-2 py-1 text-sm capitalize"
//                   >
//                     <option value="admin">Admin</option>
//                     <option value="staff">Staff</option>
//                   </select>
//                 ) : (
//                   <span className="text-sm text-gray-500 capitalize px-2">{member.role}</span>
//                 )}

//                 {isOwnerOrAdmin && member.role !== "owner" && member.id !== me.id && (
//                   <button
//                     onClick={() => handleRemove(member.id)}
//                     className="text-sm text-red-600 hover:underline"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {isOwnerOrAdmin && (
//         <div className="space-y-3">
//           <h3 className="font-medium text-sm text-gray-600">Pending invites</h3>
//           {invites.length === 0 ? (
//             <p className="text-sm text-gray-400">No pending invites.</p>
//           ) : (
//             <div className="divide-y border rounded-xl overflow-hidden">
//               {invites.map((invite) => (
//                 <div key={invite.id} className="flex items-center justify-between p-4">
//                   <div>
//                     <p className="font-medium">{invite.email}</p>
//                     <p className="text-sm text-gray-500 capitalize">{invite.role}</p>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <button
//                       onClick={() => handleCopyLink(invite.token)}
//                       className="text-sm text-deepgreen hover:underline"
//                     >
//                       Copy link
//                     </button>
//                     <button
//                       onClick={() => handleRevoke(invite.id)}
//                       className="text-sm text-red-600 hover:underline"
//                     >
//                       Revoke
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3 pt-2">
//             <div className="flex-1 min-w-[200px] flex flex-col gap-1">
//               <label className="text-sm">Invite by email</label>
//               <input
//                 type="email"
//                 value={inviteEmail}
//                 onChange={(e) => setInviteEmail(e.target.value)}
//                 placeholder="teammate@company.com"
//                 className="border p-3 rounded-lg"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-sm">Role</label>
//               <select
//                 value={inviteRole}
//                 onChange={(e) => setInviteRole(e.target.value as "admin" | "staff")}
//                 className="border p-3 rounded-lg"
//               >
//                 <option value="staff">Staff</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//             <button
//               type="submit"
//               disabled={inviting}
//               className="bg-deepgreen text-white px-6 py-3 rounded-lg disabled:opacity-50"
//             >
//               {inviting ? "Sending..." : "Send invite"}
//             </button>
//           </form>
//           <p className="text-xs text-gray-400">
//             There&apos;s no email delivery wired up yet — copy the invite link and share it
//             directly with your teammate.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import type { Profile, TeamInvite } from "@/lib/supabase/database.types";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
import { SkeletonRow } from "@/app/components/ui/Skeleton";
import { useToast } from "@/app/components/ui/Toast";
import { useConfirm } from "@/app/components/ui/useConfirm";

export function TeamTab() {
  const supabase = getSupabaseClient();
  const { organization, profile: me, isOwnerOrAdmin } = useOrganization();
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const [members, setMembers] = useState<Profile[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "staff">("staff");
  const [inviting, setInviting] = useState(false);

  const loadData = async () => {
    setLoading(true);

    const [{ data: membersData, error: membersError }, { data: invitesData, error: invitesError }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("organization_id", organization.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("team_invites")
          .select("*")
          .eq("organization_id", organization.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
      ]);

    if (membersError || invitesError) {
      toast.error(membersError?.message || invitesError?.message || "Failed to load team");
    } else {
      setMembers(membersData ?? []);
      setInvites(invitesData ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error("Enter an email address to invite");
      return;
    }

    setInviting(true);
    const { error: insertError } = await supabase.from("team_invites").insert({
      organization_id: organization.id,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
      invited_by: me.id,
    });
    setInviting(false);

    if (insertError) {
      toast.error(
        insertError.code === "23505"
          ? "There's already a pending invite for this email"
          : insertError.message
      );
      return;
    }

    setInviteEmail("");
    toast.success("Invite sent");
    loadData();
  };

  const handleRevoke = async (invite: TeamInvite) => {
    const ok = await confirm({
      title: `Revoke invite to ${invite.email}?`,
      confirmLabel: "Revoke",
      tone: "danger",
    });
    if (!ok) return;

    const { error } = await supabase.from("team_invites").update({ status: "revoked" }).eq("id", invite.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Invite revoked");
    loadData();
  };

  const handleCopyLink = async (token: string) => {
    const url = `${window.location.origin}/accept-invite?token=${token}`;
    await navigator.clipboard.writeText(url);
    toast.success("Invite link copied");
  };

  const handleRemove = async (member: Profile) => {
    const ok = await confirm({
      title: `Remove ${member.full_name || member.email}?`,
      description: "They'll lose access to this workspace immediately.",
      confirmLabel: "Remove",
      tone: "danger",
    });
    if (!ok) return;

    const { error } = await supabase.rpc("remove_team_member", { p_profile_id: member.id });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Team member removed");
    loadData();
  };

  const handleRoleChange = async (memberId: string, role: "admin" | "staff") => {
    const { error } = await supabase.rpc("update_team_member_role", {
      p_profile_id: memberId,
      p_role: role,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Role updated");
    loadData();
  };

  return (
    <Card className="space-y-8">
      {confirmDialog}

      <h2 className="text-lg font-semibold text-dark">Team</h2>

      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted">Members</h3>
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {loading ? (
            <table className="w-full">
              <tbody>{Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} columns={3} />)}</tbody>
            </table>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-dark">
                    {member.full_name || member.email}
                    {member.id === me.id && <span className="text-muted"> (you)</span>}
                  </p>
                  <p className="text-sm text-muted">{member.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  {isOwnerOrAdmin && member.role !== "owner" && member.id !== me.id ? (
                    <Select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as "admin" | "staff")}
                      className="w-auto py-1.5 text-xs capitalize"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </Select>
                  ) : (
                    <span className="text-sm text-muted capitalize px-2">{member.role}</span>
                  )}

                  {isOwnerOrAdmin && member.role !== "owner" && member.id !== me.id && (
                    <button
                      onClick={() => handleRemove(member)}
                      className="text-sm text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isOwnerOrAdmin && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted">Pending invites</h3>
          {invites.length === 0 ? (
            <p className="text-sm text-muted">No pending invites.</p>
          ) : (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-dark">{invite.email}</p>
                    <p className="text-sm text-muted capitalize">{invite.role}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCopyLink(invite.token)}
                      className="text-sm text-deepgreen hover:underline cursor-pointer"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={() => handleRevoke(invite)}
                      className="text-sm text-red-600 hover:underline cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3 pt-2">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Invite by email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
              />
            </div>
            <Select
              label="Role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "admin" | "staff")}
              className="w-auto"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Select>
            <Button type="submit" loading={inviting}>
              Send invite
            </Button>
          </form>
          <p className="text-xs text-muted">
            There&apos;s no email delivery wired up yet — copy the invite link and share it
            directly with your teammate.
          </p>
        </div>
      )}
    </Card>
  );
}

