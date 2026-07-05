'use client'

import { useRouter } from 'next/navigation'
import { FiPackage, FiUser, FiFileText, FiCheck, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface OnboardingChecklistProps {
  productCount: number
  customerCount: number
  invoiceCount: number
}

export default function OnboardingChecklist({
  productCount,
  customerCount,
  invoiceCount,
}: OnboardingChecklistProps) {
  const router = useRouter()

  const steps = [
    {
      id: 'products',
      title: 'Configure Inventory',
      description: 'Add the products, rentals, or services you want to invoice.',
      completed: productCount > 0,
      icon: <FiPackage className="text-xl" />,
      actionText: '+ Add Product',
      actionUrl: '/inventory',
    },
    {
      id: 'customers',
      title: 'Add Customers',
      description: 'Register the clients or businesses you deal with.',
      completed: customerCount > 0,
      icon: <FiUser className="text-xl" />,
      actionText: '+ Add Customer',
      actionUrl: '/customers',
    },
    {
      id: 'invoices',
      title: 'Create First Invoice',
      description: 'Issue a sale or rental invoice to request payments.',
      completed: invoiceCount > 0,
      icon: <FiFileText className="text-xl" />,
      actionText: 'Create Invoice',
      actionUrl: '/invoice/create',
      disabled: productCount === 0 || customerCount === 0,
      disabledReason: 'Add products and customers first',
    },
  ]

  const completedCount = steps.filter((s) => s.completed).length
  const progressPercent = Math.round((completedCount / steps.length) * 100)

  // Avoid showing if onboarding is fully complete
  if (completedCount === steps.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#222225] dark:via-[#1E1E21] dark:to-[#161618] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden shadow-xl dark:shadow-2xl mb-8"
    >
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#8BB174]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-dark dark:text-white flex items-center gap-2">
              Welcome to Invoxa ✨
            </h2>
            <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">
              Complete these three quick steps to start sending invoices and tracking sales or rentals.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 min-w-[200px]">
            <div className="flex justify-between w-full text-xs font-semibold text-zinc-500 dark:text-zinc-450">
              <span>Setup Progress</span>
              <span className="text-deepgreen dark:text-lightgreen font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-zinc-850 rounded-full overflow-hidden border border-slate-150 dark:border-zinc-700/20">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-[#355834] via-[#71B48D] to-[#8BB174] rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(113,180,141,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, idx) => {
            const showDisabled = step.disabled && !step.completed

            return (
              <motion.div
                key={step.id}
                whileHover={{ y: -2, borderColor: step.completed ? 'rgba(16,185,129,0.3)' : 'rgba(113,180,141,0.3)' }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col justify-between p-5 rounded-xl border transition-all h-full bg-slate-50/50 dark:bg-[#1A1A1C]/50 relative overflow-hidden group ${
                  step.completed
                    ? 'border-emerald-250 dark:border-emerald-950/50 hover:bg-emerald-50/20 dark:hover:bg-[#1C1F1D]/60'
                    : 'border-slate-200 dark:border-zinc-850 hover:bg-slate-50/60 dark:hover:bg-[#121316]/60'
                }`}
              >
                {step.completed && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`p-2.5 rounded-lg border flex items-center justify-center ${
                        step.completed
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          : showDisabled
                          ? 'text-zinc-400 dark:text-zinc-550 bg-slate-100 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-850'
                          : 'text-deepgreen dark:text-[#8BB174] bg-green-50/50 dark:bg-green-950/20 border-green-150 dark:border-green-900/30 shadow-[0_0_10px_rgba(113,180,141,0.1)]'
                      }`}
                    >
                      {step.icon}
                    </div>

                    {step.completed ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/45 font-medium">
                        <FiCheck size={14} className="stroke-[3]" /> Completed
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-550 dark:text-zinc-500 bg-slate-150 dark:bg-zinc-900/60 px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-850 font-medium">
                        Step {idx + 1}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-dark dark:text-white text-base leading-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-zinc-900/40">
                  {step.completed ? (
                    <button
                      onClick={() => router.push(step.actionUrl)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Manage items <FiArrowRight size={13} />
                    </button>
                  ) : showDisabled ? (
                    <div className="flex flex-col gap-1">
                      <button
                        disabled
                        className="w-full text-center py-2.5 px-3 text-xs bg-slate-100 dark:bg-zinc-900/80 text-zinc-400 dark:text-zinc-550 border border-slate-200 dark:border-zinc-850 rounded-lg cursor-not-allowed font-semibold"
                      >
                        {step.actionText}
                      </button>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center">{step.disabledReason}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push(step.actionUrl)}
                      className="w-full text-center py-2.5 px-3 text-xs bg-gradient-to-r from-[#355834] to-[#71B48D] hover:from-[#2e4c2d] hover:to-[#5ea67c] text-white rounded-lg cursor-pointer transition-all font-semibold shadow-md hover:shadow-lg shadow-green-950/20"
                    >
                      {step.actionText}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
