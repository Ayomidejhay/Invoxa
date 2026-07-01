"use client";

import { motion } from "framer-motion";
import { FiLock, FiCheck, FiMail, FiUserPlus, FiKey, FiShield } from "react-icons/fi";

// Common glass card styling
const glassCardClass = "w-72 sm:w-80 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden";

// Gentle float container
function FloatingContainer({ children, delay = 0, duration = 6, yOffset = 10 }: { children: React.ReactNode; delay?: number; duration?: number; yOffset?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -yOffset, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function LoginIllustration() {
  return (
    <div className="relative">
      {/* Background glowing aura */}
      <div className="absolute inset-0 bg-green/10 blur-3xl rounded-full scale-110 pointer-events-none" />
      
      <FloatingContainer>
        <div className={glassCardClass}>
          {/* Top Row: Invoice Metadata */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold font-mono">Invoice Number</p>
              <h4 className="text-sm font-bold text-white font-mono mt-0.5">INV-2026-00231</h4>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Paid
            </span>
          </div>

          {/* Customer & Items */}
          <div className="space-y-3.5">
            <div>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Client</p>
              <p className="text-sm font-semibold text-zinc-200 mt-0.5">Aisha Bello Development Co.</p>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-3.5">
              <div>
                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Item Details</p>
                <p className="text-xs text-zinc-300 mt-0.5">2× Enterprise Office Chairs</p>
              </div>
              <p className="text-base font-bold text-white font-mono">₦90,000</p>
            </div>
          </div>

          {/* Mini decorative bar code */}
          <div className="mt-5 pt-3 border-t border-white/5 flex gap-1 justify-center opacity-30">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-white rounded-sm"
                style={{
                  width: i % 3 === 0 ? "3px" : i % 5 === 0 ? "1px" : "2px",
                  height: "12px"
                }}
              />
            ))}
          </div>
        </div>
      </FloatingContainer>

      {/* Floating Badge (Payment Success) */}
      <motion.div
        animate={{ y: [0, 8, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-6 -right-6 bg-zinc-950/80 border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs">
          <FiCheck />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Payment Status</p>
          <p className="text-xs font-semibold text-white">Settled Instantly</p>
        </div>
      </motion.div>
    </div>
  );
}

export function SignUpIllustration() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-deepgreen/10 blur-3xl rounded-full scale-110 pointer-events-none" />
      
      <FloatingContainer delay={0.5}>
        <div className={glassCardClass}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <FiUserPlus className="text-green text-lg" />
            <h4 className="text-sm font-bold text-zinc-200">Workspace Onboarding</h4>
          </div>

          {/* Members List Mocks */}
          <div className="space-y-3">
            {[
              { name: "Aisha Bello", role: "Owner", initials: "AB", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
              { name: "Bayo Events Co.", role: "Admin", initials: "BE", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
              { name: "New Administrator", role: "Pending...", initials: "??", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", pulse: true }
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${m.color} ${m.pulse ? "animate-pulse" : ""}`}>
                    {m.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">{m.name}</p>
                    <p className="text-[10px] text-zinc-500">{m.role}</p>
                  </div>
                </div>
                {m.pulse ? (
                  <span className="text-[9px] font-bold text-zinc-500 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 animate-pulse">Invited</span>
                ) : (
                  <FiCheck className="text-emerald-400 text-xs mr-1" />
                )}
              </div>
            ))}
          </div>

          {/* Setup Progress */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-[10px] font-semibold text-zinc-400 uppercase">
              <span>Setting up organization</span>
              <span>80%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "80%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-deepgreen to-green"
              />
            </div>
          </div>
        </div>
      </FloatingContainer>
    </div>
  );
}

export function ForgotPasswordIllustration() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-green/10 blur-3xl rounded-full scale-110 pointer-events-none" />

      <FloatingContainer delay={1}>
        <div className={`${glassCardClass} flex flex-col items-center justify-center py-8 text-center`}>
          <div className="w-14 h-14 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center text-green text-xl shadow-inner mb-4">
            <FiLock />
          </div>
          
          <h4 className="text-sm font-bold text-white mb-1.5">Reset Flow Triggered</h4>
          <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">
            A confirmation link is packaged and encrypted for your safety.
          </p>

          <div className="w-full mt-6 bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-green/20 border border-green/30 flex items-center justify-center text-green text-xs shrink-0">
              <FiMail />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-zinc-500">Security Email</p>
              <p className="text-xs text-zinc-200 truncate">reset-link@invoxa.com</p>
            </div>
          </div>
        </div>
      </FloatingContainer>

      {/* Floating status alert */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -left-6 bg-zinc-950/80 border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs">
          <FiCheck />
        </div>
        <p className="text-xs font-medium text-zinc-200">Email Dispatched</p>
      </motion.div>
    </div>
  );
}

export function VerifyAccountIllustration() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-green/10 blur-3xl rounded-full scale-110 pointer-events-none" />

      <FloatingContainer yOffset={8}>
        <div className={glassCardClass}>
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
            <FiShield className="text-green text-lg" />
            <h4 className="text-sm font-bold text-zinc-200">2-Factor Security</h4>
          </div>

          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2.5">Verification Code</p>
          
          {/* Digital Inputs Simulation */}
          <div className="grid grid-cols-6 gap-2">
            {["5", "9", "2", "_", "", ""].map((char, idx) => {
              const isCursor = char === "_";
              const isFilled = char && !isCursor;
              return (
                <div 
                  key={idx}
                  className={`aspect-square rounded-xl border flex items-center justify-center font-mono text-sm font-bold transition-all ${
                    isFilled 
                      ? "bg-deepgreen/10 border-green text-white" 
                      : isCursor
                      ? "bg-zinc-800 border-green/50 text-green shadow-inner"
                      : "bg-zinc-950/40 border-white/5 text-zinc-600"
                  }`}
                >
                  {isCursor ? (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  ) : (
                    char
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-zinc-500 mt-4 text-center leading-relaxed">
            Enter the 6-digit credential from your registration email.
          </p>
        </div>
      </FloatingContainer>
    </div>
  );
}

export function ResetPasswordIllustration() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-deepgreen/10 blur-3xl rounded-full scale-110 pointer-events-none" />

      <FloatingContainer>
        <div className={glassCardClass}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <FiKey className="text-green text-lg animate-pulse" />
            <h4 className="text-sm font-bold text-zinc-200">Security Credentials</h4>
          </div>

          {/* Password complexity metrics */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-semibold text-zinc-400 uppercase">
                <span>Password Complexity</span>
                <span className="text-emerald-400 font-bold">Strong</span>
              </div>
              <div className="flex gap-1">
                <div className="h-1 flex-1 bg-emerald-500 rounded-full" />
                <div className="h-1 flex-1 bg-emerald-500 rounded-full" />
                <div className="h-1 flex-1 bg-emerald-500 rounded-full" />
                <div className="h-1 flex-1 bg-zinc-800 rounded-full" />
              </div>
            </div>

            <div className="border-t border-white/5 pt-3.5 space-y-2">
              {[
                { label: "At least 6 characters", checked: true },
                { label: "Includes one number", checked: true },
                { label: "Contains special symbol", checked: false }
              ].map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    req.checked 
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                      : "border-white/10 bg-transparent text-zinc-700"
                  }`}>
                    {req.checked && <FiCheck className="text-[10px]" />}
                  </div>
                  <span className={req.checked ? "text-zinc-300" : "text-zinc-500"}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FloatingContainer>
    </div>
  );
}

export function AcceptInviteIllustration() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-green/10 blur-3xl rounded-full scale-110 pointer-events-none" />

      <FloatingContainer delay={0.3}>
        <div className={glassCardClass}>
          {/* Invite details card */}
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-deepgreen to-green flex items-center justify-center text-white text-base font-bold shadow-lg border border-white/10 mx-auto mb-3.5">
              I
            </div>
            
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Invitation Received</p>
            <h4 className="text-sm font-semibold text-zinc-200 mt-1">Invoxa Collaborative Space</h4>

            <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Workspace</span>
                <span className="font-semibold text-zinc-200">Bayo Events Co.</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-zinc-500">Assigned Role</span>
                <span className="px-2 py-0.5 rounded bg-green/10 border border-green/20 text-green font-semibold capitalize text-[10px]">Administrator</span>
              </div>
            </div>

            {/* Click animation simulation */}
            <div className="mt-4 w-full py-2.5 rounded-xl bg-deepgreen text-white text-xs font-semibold relative overflow-hidden flex items-center justify-center gap-1.5 shadow-lg border border-white/5">
              <span>Accepting...</span>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            </div>
          </div>
        </div>
      </FloatingContainer>
    </div>
  );
}
