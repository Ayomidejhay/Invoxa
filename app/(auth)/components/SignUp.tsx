"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp, signInWithGoogle } from "@/lib/supabase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import AuthLayout from "./AuthLayout";
import { SignUpIllustration } from "./AuthIllustrations";
import { FcGoogle } from "react-icons/fc";
import { FiMail } from "react-icons/fi";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/onboarding";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setFormError(null);

    const { data: authData, error } = await signUp(data.email, data.password, data.name);

    if (error) {
      setFormError(error.message);
      setLoading(false);
      return;
    }

    if (!authData.session) {
      setCheckEmail(true);
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    const { error } = await signInWithGoogle(next);
    if (error) setFormError(error.message);
  };

  if (checkEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0C0C0E] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center relative"
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-green/20 to-transparent" />
          <div className="w-12 h-12 rounded-full bg-green/10 border border-green/30 flex items-center justify-center text-green text-xl mx-auto mb-4">
            <FiMail />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We&apos;ve sent a confirmation link to your inbox. Click it to activate your account,
            then come back and log in to set up your business.
          </p>
          <Link href="/login" className="inline-block mt-6">
            <Button size="md" variant="secondary">
              Back to login
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <AuthLayout
      title="Create invoices, manage inventory, and grow your business."
      subtitle="Sign up in seconds to start building professional invoices for sales or rentals, tracking stocks, and adding team roles."
      illustration={<SignUpIllustration />}
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-zinc-400">Get started today. Setup your modern billing workspace.</p>
        </div>

        {formError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-xs text-red-400">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            {...register("name")} 
            label="Full Name" 
            placeholder="John Doe" 
            error={errors.name?.message} 
          />

          <Input 
            {...register("email")} 
            label="Email Address" 
            placeholder="name@company.com" 
            error={errors.email?.message} 
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">
            Create Account
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-x-0 h-[1px] bg-zinc-800/80" />
          <span className="relative px-3 bg-[#111113] text-xs text-zinc-500 font-medium">Or continue with</span>
        </div>

        <Button variant="outline" onClick={handleGoogleSignIn} fullWidth size="lg" className="flex items-center justify-center gap-2.5">
          <FcGoogle className="text-lg shrink-0" />
          <span>Continue with Google</span>
        </Button>

        <p className="text-sm text-center text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
