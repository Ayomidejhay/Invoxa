// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { getSupabaseClient } from "@/lib/supabase/client";

// type Mode = "create" | "invite";

// export default function OnboardingForm({
//   defaultName,
//   initialToken,
// }: {
//   defaultName: string;
//   initialToken: string;
// }) {
//   const router = useRouter();
//   const supabase = getSupabaseClient();

//   const [mode, setMode] = useState<Mode>(initialToken ? "invite" : "create");
//   const [orgName, setOrgName] = useState("");
//   const [token, setToken] = useState(initialToken);
//   const [invitePreview, setInvitePreview] = useState<{ organization_name: string; role: string } | null>(
//     null
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!token) {
//       setInvitePreview(null);
//       return;
//     }
//     let cancelled = false;
//     supabase.rpc("get_invite_preview", { p_token: token }).then(({ data, error: rpcError }) => {
//       if (cancelled) return;
//       if (rpcError || !data || data.length === 0) {
//         setInvitePreview(null);
//         return;
//       }
//       setInvitePreview({ organization_name: data[0].organization_name, role: data[0].role });
//     });
//     return () => {
//       cancelled = true;
//     };
//   }, [token, supabase]);

//   const handleCreateOrg = async () => {
//     setError(null);
//     if (orgName.trim().length < 2) {
//       setError("Enter your business name (at least 2 characters)");
//       return;
//     }
//     setLoading(true);
//     const { error: rpcError } = await supabase.rpc("create_organization", { p_name: orgName.trim() });
//     setLoading(false);

//     if (rpcError) {
//       setError(rpcError.message);
//       return;
//     }
//     router.push("/dashboard");
//     router.refresh();
//   };

//   const handleAcceptInvite = async () => {
//     setError(null);
//     if (!token.trim()) {
//       setError("Paste your invite link or code");
//       return;
//     }
//     setLoading(true);
//     const { error: rpcError } = await supabase.rpc("accept_invite", { p_token: token.trim() });
//     setLoading(false);

//     if (rpcError) {
//       setError(rpcError.message);
//       return;
//     }
//     router.push("/dashboard");
//     router.refresh();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
//     >
//       <h1 className="text-2xl font-bold text-[#355834] text-center">
//         {defaultName ? `Welcome, ${defaultName.split(" ")[0]}` : "Welcome to Invoxa"}
//       </h1>
//       <p className="text-sm text-gray-500 text-center mt-1 mb-6">
//         Let&apos;s get your workspace set up.
//       </p>

//       <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
//         <button
//           onClick={() => setMode("create")}
//           className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
//             mode === "create" ? "bg-white shadow text-[#355834]" : "text-gray-500"
//           }`}
//         >
//           Create a business
//         </button>
//         <button
//           onClick={() => setMode("invite")}
//           className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
//             mode === "invite" ? "bg-white shadow text-[#355834]" : "text-gray-500"
//           }`}
//         >
//           I have an invite
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {mode === "create" ? (
//         <div className="space-y-4">
//           <input
//             value={orgName}
//             onChange={(e) => setOrgName(e.target.value)}
//             placeholder="Business name"
//             className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D] focus:outline-none"
//           />
//           <button
//             onClick={handleCreateOrg}
//             disabled={loading}
//             className="w-full bg-[#355834] text-white py-3 rounded-xl disabled:opacity-60"
//           >
//             {loading ? "Setting up..." : "Create workspace"}
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <input
//             value={token}
//             onChange={(e) => setToken(e.target.value)}
//             placeholder="Invite code"
//             className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D] focus:outline-none"
//           />
//           {invitePreview && (
//             <p className="text-sm text-gray-600">
//               You&apos;ll join <strong>{invitePreview.organization_name}</strong> as{" "}
//               <span className="capitalize">{invitePreview.role}</span>.
//             </p>
//           )}
//           <button
//             onClick={handleAcceptInvite}
//             disabled={loading}
//             className="w-full bg-[#355834] text-white py-3 rounded-xl disabled:opacity-60"
//           >
//             {loading ? "Joining..." : "Join workspace"}
//           </button>
//         </div>
//       )}
//     </motion.div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

type Mode = "create" | "invite";

export default function OnboardingForm({
  defaultName,
  initialToken,
}: {
  defaultName: string;
  initialToken: string;
}) {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [mode, setMode] = useState<Mode>(initialToken ? "invite" : "create");
  const [orgName, setOrgName] = useState("");
  const [token, setToken] = useState(initialToken);
  const [invitePreview, setInvitePreview] = useState<{ organization_name: string; role: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    let cancelled = false;
    supabase.rpc("get_invite_preview", { p_token: token }).then(({ data, error: rpcError }) => {
      if (cancelled) return;
      if (rpcError || !data || data.length === 0) {
        setInvitePreview(null);
        return;
      }
      setInvitePreview({ organization_name: data[0].organization_name, role: data[0].role });
    });
    return () => {
      cancelled = true;
    };
  }, [token, supabase]);

  const handleCreateOrg = async () => {
    setError(null);
    if (orgName.trim().length < 2) {
      setError("Enter your business name (at least 2 characters)");
      return;
    }
    setLoading(true);
    const { error: rpcError } = await supabase.rpc("create_organization", { p_name: orgName.trim() });
    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const handleAcceptInvite = async () => {
    setError(null);
    if (!token.trim()) {
      setError("Paste your invite link or code");
      return;
    }
    setLoading(true);
    const { error: rpcError } = await supabase.rpc("accept_invite", { p_token: token.trim() });
    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
    >
      <h1 className="text-2xl font-bold text-deepgreen text-center">
        {defaultName ? `Welcome, ${defaultName.split(" ")[0]}` : "Welcome to Invoxa"}
      </h1>
      <p className="text-sm text-muted text-center mt-1 mb-6">
        Let&apos;s get your workspace set up.
      </p>

      <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
        <button
          onClick={() => setMode("create")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            mode === "create" ? "bg-white shadow text-deepgreen" : "text-muted"
          }`}
        >
          Create a business
        </button>
        <button
          onClick={() => setMode("invite")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            mode === "invite" ? "bg-white shadow text-deepgreen" : "text-muted"
          }`}
        >
          I have an invite
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {mode === "create" ? (
        <div className="space-y-4">
          <Input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Business name"
          />
          <Button onClick={handleCreateOrg} loading={loading} fullWidth size="lg">
            Create workspace
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Invite code"
          />
          {invitePreview && (
            <p className="text-sm text-muted">
              You&apos;ll join <strong className="text-dark">{invitePreview.organization_name}</strong> as{" "}
              <span className="capitalize">{invitePreview.role}</span>.
            </p>
          )}
          <Button onClick={handleAcceptInvite} loading={loading} fullWidth size="lg">
            Join workspace
          </Button>
        </div>
      )}
    </motion.div>
  );
}
