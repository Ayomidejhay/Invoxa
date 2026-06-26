

// "use client";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { getSupabaseClient } from "@/lib/supabase/client";

// const schema = z.object({
//   email: z.string().email("Invalid email"),
// });

// type FormValues = z.infer<typeof schema>;

// export default function ForgotPassword() {
//   const supabase = getSupabaseClient();
//   const [loading, setLoading] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({ resolver: zodResolver(schema) });

//   const onSubmit = async (data: FormValues) => {
//     setLoading(true);
//     setFormError(null);

//     const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
//       redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
//     });

//     setLoading(false);

//     if (error) {
//       setFormError(error.message);
//       return;
//     }
//     setSent(true);
//   };

//   return (
//     <main className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">
//       <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-[#355834] to-[#71B48D] text-white">
//         <h2 className="text-4xl font-bold mb-4">Forgot Password</h2>
//         <p className="text-lg opacity-90">
//           Enter your email and we&apos;ll send you a link to reset your password.
//         </p>
//       </div>

//       <div className="flex items-center justify-center px-6">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
//         >
//           <h1 className="text-3xl font-bold mb-6 text-[#355834] text-center">Reset Password</h1>

//           {sent ? (
//             <p className="text-sm text-gray-600 text-center">
//               If an account exists for that email, a reset link is on its way. Check your inbox.
//             </p>
//           ) : (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               {formError && (
//                 <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//                   {formError}
//                 </div>
//               )}
//               <div>
//                 <input
//                   {...register("email")}
//                   placeholder="Email"
//                   className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D] focus:outline-none"
//                 />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//               </div>

//               <button disabled={loading} className="w-full bg-[#355834] text-white py-3 rounded-xl disabled:opacity-60">
//                 {loading ? "Sending..." : "Send Reset Link"}
//               </button>
//             </form>
//           )}

//           <p className="text-sm mt-6 text-center">
//             Remember your password?{" "}
//             <Link href="/login" className="text-[#355834] font-medium">
//               Login
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </main>
//   );
// }


"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setFormError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-light">
      <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-deepgreen to-green text-white">
        <h2 className="text-4xl font-bold mb-4">Forgot Password</h2>
        <p className="text-lg opacity-90">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-deepgreen text-center">Reset Password</h1>

          {sent ? (
            <p className="text-sm text-muted text-center">
              If an account exists for that email, a reset link is on its way. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {formError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <Input {...register("email")} placeholder="Email" error={errors.email?.message} />

              <Button type="submit" loading={loading} fullWidth size="lg">
                Send Reset Link
              </Button>
            </form>
          )}

          <p className="text-sm mt-6 text-center text-dark">
            Remember your password?{" "}
            <Link href="/login" className="text-deepgreen font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
