"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signInWithGoogle } from "@/lib/supabase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import AuthLayout from "./AuthLayout";
import { LoginIllustration } from "./AuthIllustrations";
import { FcGoogle } from "react-icons/fc";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setFormError(null);

    const { error } = await signIn(data.email, data.password);

    if (error) {
      setFormError(error.message);
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

  return (
    <AuthLayout
      title="Smart invoicing for modern businesses."
      subtitle="Manage sales and rentals effortlessly in one workspace. Built for team collaboration, inventory audits, and speed."
      illustration={<LoginIllustration />}
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-dark dark:text-white tracking-tight">Sign In</h1>
          <p className="text-xs text-zinc-555 dark:text-zinc-400">Welcome back. Enter your credentials to access your account.</p>
        </div>

        {formError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-xs text-red-400">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            {...register("email")} 
            label="Email Address" 
            placeholder="name@company.com" 
            error={errors.email?.message} 
          />

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">Password</label>
              <Link href="/forget-password" className="text-xs text-green hover:underline">
                Forgot password?
              </Link>
            </div>
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
                className="absolute right-3 top-3 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">
            Log In
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-x-0 h-[1px] bg-slate-200 dark:bg-zinc-800/80" />
          <span className="relative px-3 bg-white dark:bg-zinc-900 text-xs text-zinc-500 font-medium transition-colors">Or continue with</span>
        </div>

        <Button variant="outline" onClick={handleGoogleSignIn} fullWidth size="lg" className="flex items-center justify-center gap-2.5">
          <FcGoogle className="text-lg shrink-0" />
          <span>Continue with Google</span>
        </Button>

        <p className="text-sm text-center text-zinc-555 dark:text-zinc-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-green hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
