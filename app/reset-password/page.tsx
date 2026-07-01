"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import AuthLayout from "@/app/(auth)/components/AuthLayout";
import { ResetPasswordIllustration } from "@/app/(auth)/components/AuthIllustrations";

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
    <AuthLayout
      title="Secure your workspace account."
      subtitle="Configure a resilient and strong passphrase. Ensure it matches all complexity standards for your team safety."
      illustration={<ResetPasswordIllustration />}
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">New Password</h1>
          <p className="text-xs text-zinc-400">Establish a secure password for your profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <Input
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          
          <Input
            type="password"
            label="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">
            Update Password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
