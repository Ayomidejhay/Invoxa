"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { signIn, signUp, signInWithGoogle } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
  setLoading(true);

  const { error } = await signIn(data.email, data.password);

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  router.push("/dashboard");
};
  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">
      {/* LEFT PANEL */}
      {/* <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-[#355834] to-[#71B48D] text-white">
        <h2 className="text-4xl font-bold mb-4">Invoxa</h2>
        <p className="text-lg opacity-90">
          Smart invoicing for modern businesses. Manage sales and rentals effortlessly.
        </p>
      </div> */}

      {/* <div className="relative hidden md:flex items-end justify-start px-12 py-12 overflow-hidden bg-gradient-to-br from-[#355834] to-[#71B48D] text-white">
       
        <div className="absolute inset-0 bg-gradient-to-br from-[#355834]/80 via-[#355834]/60 to-[#71B48D]/80" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#71B48D]/30 blur-3xl rounded-full z-0" />

       
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl z-10"
        >
          <Image src="/signin.svg" alt="Login" width={600} height={600} />
        </motion.div>

       
        <div className="relative z-20 max-w-sm">
          <h2 className="text-4xl font-bold mb-4">Invoxa</h2>
          <p className="text-lg opacity-90">
            Smart invoicing for modern businesses.
          </p>
        </div>
      </div> */}
      <div className="relative hidden md:flex items-end justify-start px-12 py-12 overflow-hidden bg-gradient-to-br from-[#355834] to-[#71B48D] text-white">
        {/* BASE GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#355834]/90 via-[#355834]/70 to-[#71B48D]/90" />

        {/* RADIAL LIGHT (top glow) */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#8BB174]/40 blur-[120px] rounded-full"
        />

        {/* SECONDARY GLOW (bottom right) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-[#71B48D]/30 blur-[140px] rounded-full"
        />

        {/* CENTER GLOW BEHIND CARD */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-white/10 blur-3xl rounded-full" />

        {/* GLASS CARD + PARALLAX */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        >
          <Image
            src="/signin.svg"
            alt="Illustration"
            width={600}
            height={600}
          />
        </motion.div>

        {/* SUBTLE LIGHT REFLECTION */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] opacity-40" />

        {/* TEXT */}
        <div className="relative z-20 max-w-sm">
          <h2 className="text-4xl font-bold mb-4">Invoxa</h2>
          <p className="text-lg opacity-90">
            Smart invoicing for modern businesses. Manage sales and rentals
            effortlessly.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-[#355834] text-center">
            Sign In
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#355834] text-white py-3 rounded-xl"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* SOCIAL */}
          <button className="mt-4 w-full border py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50">
            <span>🔵</span> Continue with Google
          </button>

          <p className="text-sm mt-6 text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#355834]">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
