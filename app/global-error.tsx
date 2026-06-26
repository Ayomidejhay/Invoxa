'use client'

import React from 'react'

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  React.useEffect(() => {
    console.error('Unhandled Global Error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 antialiased font-sans">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Application Error</h1>
            <p className="text-sm text-slate-400">
              An unexpected issue occurred. We&apos;ve logged this details and are investigating.
            </p>
          </div>

          {error?.message && (
            <div className="p-4 bg-slate-900/50 border border-slate-700/30 rounded-2xl text-left text-xs font-mono text-slate-400 overflow-auto max-h-32">
              {error.message}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => unstable_retry()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium py-3 px-4 rounded-2xl shadow-lg transition-colors cursor-pointer"
            >
              Reload application
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-slate-700/50 hover:bg-slate-700 active:bg-slate-800 text-slate-300 font-medium py-3 px-4 rounded-2xl border border-slate-600/30 transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
