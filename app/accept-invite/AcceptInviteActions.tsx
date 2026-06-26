// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { getSupabaseClient } from "@/lib/supabase/client";

// export default function AcceptInviteActions({ token, isLoggedIn }: { token: string; isLoggedIn: boolean }) {
//   const router = useRouter();
//   const supabase = getSupabaseClient();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   if (!isLoggedIn) {
//     const next = encodeURIComponent(`/onboarding?token=${token}`);
//     return (
//       <div className="space-y-3">
//         <Link
//           href={`/signup?next=${next}`}
//           className="block w-full bg-[#355834] text-white py-3 rounded-xl font-medium"
//         >
//           Create an account
//         </Link>
//         <Link
//           href={`/login?next=${next}`}
//           className="block w-full border py-3 rounded-xl font-medium text-[#355834]"
//         >
//           I already have an account
//         </Link>
//       </div>
//     );
//   }

//   const handleAccept = async () => {
//     setError(null);
//     setLoading(true);
//     const { error: rpcError } = await supabase.rpc("accept_invite", { p_token: token });
//     setLoading(false);

//     if (rpcError) {
//       setError(rpcError.message);
//       return;
//     }
//     router.push("/dashboard");
//     router.refresh();
//   };

//   return (
//     <div className="space-y-3">
//       {error && (
//         <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-left">
//           {error}
//         </div>
//       )}
//       <button
//         onClick={handleAccept}
//         disabled={loading}
//         className="w-full bg-[#355834] text-white py-3 rounded-xl font-medium disabled:opacity-60"
//       >
//         {loading ? "Joining..." : "Accept invite"}
//       </button>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/Button";

export default function AcceptInviteActions({ token, isLoggedIn }: { token: string; isLoggedIn: boolean }) {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoggedIn) {
    const next = encodeURIComponent(`/onboarding?token=${token}`);
    return (
      <div className="space-y-3">
        <Link href={`/signup?next=${next}`} className="block">
          <Button fullWidth size="lg">Create an account</Button>
        </Link>
        <Link href={`/login?next=${next}`} className="block">
          <Button variant="outline" fullWidth size="lg">I already have an account</Button>
        </Link>
      </div>
    );
  }

  const handleAccept = async () => {
    setError(null);
    setLoading(true);
    const { error: rpcError } = await supabase.rpc("accept_invite", { p_token: token });
    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-left">
          {error}
        </div>
      )}
      <Button onClick={handleAccept} loading={loading} fullWidth size="lg">
        Accept invite
      </Button>
    </div>
  );
}
