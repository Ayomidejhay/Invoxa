"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import AuthLayout from "./AuthLayout";
import { VerifyAccountIllustration } from "./AuthIllustrations";

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
    <AuthLayout
      title="Secure authentication checkpoint."
      subtitle="Input the unique 6-digit confirmation code we sent to your address to activate your account profile."
      illustration={<VerifyAccountIllustration />}
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-dark dark:text-white tracking-tight">Verify Account</h1>
          <p className="text-xs text-zinc-555 dark:text-zinc-400">Enter validation code to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("code")}
            label="Verification Code"
            placeholder="6-digit code"
            error={errors.code?.message as string}
            maxLength={6}
            className="text-center font-mono letter-spacing-lg text-lg"
          />

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">
            Verify Account
          </Button>
        </form>

        <p className="text-sm text-center text-zinc-555 dark:text-zinc-400 mt-6">
          Didn&apos;t receive a code?{" "}
          <Link href="/forget-password" className="text-green hover:underline font-semibold">
            Resend
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}