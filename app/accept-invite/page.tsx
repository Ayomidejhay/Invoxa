import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AcceptInviteActions from "./AcceptInviteActions";
import AuthLayout from "@/app/(auth)/components/AuthLayout";
import { AcceptInviteIllustration } from "@/app/(auth)/components/AuthIllustrations";
import { Button } from "@/app/components/ui/Button";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

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
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mx-auto">
            <FiAlertCircle />
          </div>
          <h1 className="text-xl font-bold text-white">Invalid invite link</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            This invite link is missing its token parameters. Request the workspace administrator to re-dispatch your link.
          </p>
        </div>
      </Shell>
    );
  }

  const { data: preview } = await supabase.rpc("get_invite_preview", { p_token: token });
  const invite = preview?.[0];

  if (!invite) {
    return (
      <Shell>
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mx-auto">
            <FiAlertCircle />
          </div>
          <h1 className="text-xl font-bold text-white">Invite not found</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            This invite link may have already been consumed or revoked. Please check with your supervisor to issue a new one.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button size="md" variant="outline">Go to Login</Button>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (invite.status === "expired" || new Date(invite.expires_at) < new Date()) {
    return (
      <Shell>
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mx-auto">
            <FiAlertCircle />
          </div>
          <h1 className="text-xl font-bold text-white">Invite has expired</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            This workspace invitation has expired. Ask your manager to trigger a fresh invitation.
          </p>
        </div>
      </Shell>
    );
  }

  if (invite.status === "accepted") {
    return (
      <Shell>
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl mx-auto">
            <FiCheckCircle />
          </div>
          <h1 className="text-xl font-bold text-white">Already accepted</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            This invitation has already been successfully consumed. Head over to the login screen to access your dashboard.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button size="md" variant="secondary">Go to Login</Button>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Shell>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">You&apos;ve been invited</h1>
          <p className="text-xs text-zinc-400">Join your team workspace on the Invoxa platform.</p>
        </div>

        <div className="p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl space-y-3">
          <p className="text-sm text-zinc-300">
            Join <strong className="text-white">{invite.organization_name}</strong> as an{" "}
            <span className="inline-block px-2 py-0.5 rounded bg-green/10 border border-green/20 text-green font-semibold capitalize text-xs">
              {invite.role}
            </span>.
          </p>
        </div>

        <AcceptInviteActions token={token} isLoggedIn={!!user} />
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout
      title="Join your business workspace."
      subtitle="Access invoices, collaborate on sales and rentals, and audit organization stock in real-time."
      illustration={<AcceptInviteIllustration />}
    >
      {children}
    </AuthLayout>
  );
}
