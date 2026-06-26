import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AcceptInviteActions from "./AcceptInviteActions";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const supabase = await createClient();

  if (!token) {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-[#355834] mb-2">Invalid invite link</h1>
        <p className="text-gray-600 text-sm">This invite link is missing its token. Ask whoever invited you to resend it.</p>
      </Shell>
    );
  }

  const { data: preview } = await supabase.rpc("get_invite_preview", { p_token: token });
  const invite = preview?.[0];

  if (!invite) {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-[#355834] mb-2">Invite not found</h1>
        <p className="text-gray-600 text-sm">
          This invite link may have already been used. Ask whoever invited you to send a new one.
        </p>
      </Shell>
    );
  }

  if (invite.status === "expired" || new Date(invite.expires_at) < new Date()) {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-[#355834] mb-2">This invite has expired</h1>
        <p className="text-gray-600 text-sm">Ask whoever invited you to send a fresh one.</p>
      </Shell>
    );
  }

  if (invite.status === "accepted") {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-[#355834] mb-2">Already accepted</h1>
        <p className="text-gray-600 text-sm mb-4">This invite has already been used.</p>
        <Link href="/login" className="text-[#355834] font-medium text-sm">
          Go to login
        </Link>
      </Shell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Shell>
      <h1 className="text-xl font-bold text-[#355834] mb-2">You&apos;ve been invited</h1>
      <p className="text-gray-600 text-sm mb-6">
        Join <strong>{invite.organization_name}</strong> on Invoxa as{" "}
        <span className="capitalize">{invite.role}</span>.
      </p>
      <AcceptInviteActions token={token} isLoggedIn={!!user} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">{children}</div>
    </main>
  );
}
