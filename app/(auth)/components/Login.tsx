


// "use client";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { signIn, signInWithGoogle } from "@/lib/supabase/auth";
// import { useRouter, useSearchParams } from "next/navigation";

// const schema = z.object({
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Minimum 6 characters"),
// });

// type FormValues = z.infer<typeof schema>;

// const Login = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const next = searchParams.get("next") || "/dashboard";

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({ resolver: zodResolver(schema) });

//   const onSubmit = async (data: FormValues) => {
//     setLoading(true);
//     setFormError(null);

//     const { error } = await signIn(data.email, data.password);

//     if (error) {
//       setFormError(error.message);
//       setLoading(false);
//       return;
//     }

//     router.push(next);
//     router.refresh();
//   };

//   const handleGoogleSignIn = async () => {
//     setFormError(null);
//     const { error } = await signInWithGoogle();
//     if (error) setFormError(error.message);
//   };

//   return (
//     <main className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">
//       <div className="relative hidden md:flex items-end justify-start px-12 py-12 overflow-hidden bg-gradient-to-br from-[#355834] to-[#71B48D] text-white">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#355834]/90 via-[#355834]/70 to-[#71B48D]/90" />

//         <motion.div
//           animate={{ opacity: [0.6, 1, 0.6] }}
//           transition={{ duration: 6, repeat: Infinity }}
//           className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#8BB174]/40 blur-[120px] rounded-full"
//         />

//         <motion.div
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ duration: 8, repeat: Infinity }}
//           className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-[#71B48D]/30 blur-[140px] rounded-full"
//         />

//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-white/10 blur-3xl rounded-full" />

//         <motion.div
//           animate={{ y: [0, -20, 0], rotate: [-1, 1, -1] }}
//           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
//         >
//           <Image src="/signin.svg" alt="Illustration" width={600} height={600} />
//         </motion.div>

//         <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] opacity-40" />

//         <div className="relative z-20 max-w-sm">
//           <h2 className="text-4xl font-bold mb-4">Invoxa</h2>
//           <p className="text-lg opacity-90">
//             Smart invoicing for modern businesses. Manage sales and rentals effortlessly.
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center justify-center px-6">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
//         >
//           <h1 className="text-3xl font-bold mb-6 text-[#355834] text-center">Sign In</h1>

//           {formError && (
//             <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//               {formError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <input
//                 {...register("email")}
//                 placeholder="Email"
//                 className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D] focus:outline-none"
//               />
//               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//             </div>

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 {...register("password")}
//                 placeholder="Password"
//                 className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#71B48D] focus:outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 text-sm text-gray-500"
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//               {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//             </div>

//             <div className="text-right -mt-1">
//               <Link href="/forget-password" className="text-sm text-[#355834] hover:underline">
//                 Forgot password?
//               </Link>
//             </div>

//             <button
//               disabled={loading}
//               className="w-full bg-[#355834] text-white py-3 rounded-xl disabled:opacity-60"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <button
//             onClick={handleGoogleSignIn}
//             className="mt-4 w-full border py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
//           >
//             <span>🔵</span> Continue with Google
//           </button>

//           <p className="text-sm mt-6 text-center">
//             Don&apos;t have an account?{" "}
//             <Link href="/signup" className="text-[#355834] font-medium">
//               Sign up
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </main>
//   );
// };

// export default Login;


"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { signIn, signInWithGoogle } from "@/lib/supabase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

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
    const { error } = await signInWithGoogle();
    if (error) setFormError(error.message);
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-light">
      <div className="relative hidden md:flex items-end justify-start px-12 py-12 overflow-hidden bg-gradient-to-br from-deepgreen to-green text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-deepgreen/90 via-deepgreen/70 to-green/90" />

        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-lightgreen/40 blur-[120px] rounded-full"
        />

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-green/30 blur-[140px] rounded-full"
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-white/10 blur-3xl rounded-full" />

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        >
          <Image src="/signin.svg" alt="Illustration" width={600} height={600} />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] opacity-40" />

        <div className="relative z-20 max-w-sm">
          <h2 className="text-4xl font-bold mb-4">Invoxa</h2>
          <p className="text-lg opacity-90">
            Smart invoicing for modern businesses. Manage sales and rentals effortlessly.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-deepgreen text-center">Sign In</h1>

          {formError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("email")} placeholder="Email" error={errors.email?.message} />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-sm text-muted cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-right -mt-1">
              <Link href="/forget-password" className="text-sm text-deepgreen hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">
              Login
            </Button>
          </form>

          <Button variant="outline" onClick={handleGoogleSignIn} fullWidth size="lg" className="mt-4">
            <span>🔵</span> Continue with Google
          </Button>

          <p className="text-sm mt-6 text-center text-dark">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-deepgreen font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
