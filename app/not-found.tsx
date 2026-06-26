import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-6 antialiased font-sans">
      <div className="max-w-md w-full text-center space-y-8 p-8 bg-white border border-gray-200/80 rounded-3xl shadow-xl">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <span className="text-3xl font-extrabold tracking-widest font-mono">404</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Page Not Found</h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/dashboard"
            className="w-full bg-[#355834] hover:bg-[#355834]/90 text-white font-medium py-3 rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.01] text-center"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-2xl border border-gray-200 transition-colors text-center"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  )
}
