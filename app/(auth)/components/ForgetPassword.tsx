"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

export default function ForgotPassword() {
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
    alert("Password reset link sent to your email.");
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-[#355834] to-[#71B48D] text-white">
        <h2 className="text-4xl font-bold mb-4">Forgot Password</h2>
        <p className="text-lg opacity-90">
          Enter your email and we’ll send you a link to reset your password.
        </p>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-[#355834] text-center">Reset Password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D]"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#355834] text-white py-3 rounded-xl"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-sm mt-6 text-center">
            Remember your password? <Link href="/login" className="text-[#355834]">Login</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}