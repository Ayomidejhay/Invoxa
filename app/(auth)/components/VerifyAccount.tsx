"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export default function VerifyAccount() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log(data);
    setLoading(false);
    alert("Account verified successfully!");
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-[#355834] to-[#71B48D] text-white">
        <h2 className="text-4xl font-bold mb-4">Verify Your Account</h2>
        <p className="text-lg opacity-90">
          Enter the 6-digit verification code sent to your email to activate your account.
        </p>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-[#355834] text-center">Verify Account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("code")}
                placeholder="6-digit code"
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D]"
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code.message as string}</p>}
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#355834] text-white py-3 rounded-xl"
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </form>

          <p className="text-sm mt-6 text-center">
            Didn’t receive a code? <Link href="/forgot-password" className="text-[#355834]">Resend</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}