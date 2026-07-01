"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import AuthLayout from "./AuthLayout";
import { ForgotPasswordIllustration } from "./AuthIllustrations";
import { FiMail } from "react-icons/fi";

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
    <AuthLayout
      title="Recover your credentials safely."
      subtitle="Enter your email to verify identity. We will secure your password update link and deliver it to your registered inbox."
      illustration={<ForgotPasswordIllustration />}
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-xs text-zinc-400">Restore access to your account securely.</p>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-green/10 border border-green/30 flex items-center justify-center text-green text-xl mx-auto">
              <FiMail />
            </div>
            <h2 className="text-lg font-bold text-white">Check Your Inbox</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If an account exists for that email, a recovery link is on its way. Use it to configure a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-xs text-red-400">
                {formError}
              </div>
            )}
            <Input 
              {...register("email")} 
              label="Email Address" 
              placeholder="name@company.com" 
              error={errors.email?.message} 
            />

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="text-sm text-center text-zinc-400 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-green hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
