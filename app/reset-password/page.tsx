// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { getSupabaseClient } from "@/lib/supabase/client";

// export default function ResetPasswordPage() {
//   const router = useRouter();
//   const supabase = getSupabaseClient();

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }
//     if (password !== confirm) {
//       setError("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     const { error: updateError } = await supabase.auth.updateUser({ password });
//     setLoading(false);

//     if (updateError) {
//       setError(updateError.message);
//       return;
//     }

//     router.push("/dashboard");
//     router.refresh();
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
//       >
//         <h1 className="text-2xl font-bold text-[#355834] text-center mb-6">Set a new password</h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {error && (
//             <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//               {error}
//             </div>
//           )}

//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="New password"
//             className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D] focus:outline-none"
//           />
//           <input
//             type="password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             placeholder="Confirm new password"
//             className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D] focus:outline-none"
//           />

//           <button
//             disabled={loading}
//             className="w-full bg-[#355834] text-white py-3 rounded-xl disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Update password"}
//           </button>
//         </form>
//       </motion.div>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-light px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-2xl font-bold text-deepgreen text-center mb-6">Set a new password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
          />

          <Button type="submit" loading={loading} fullWidth size="lg">
            Update password
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
