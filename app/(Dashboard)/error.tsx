// 'use client'

// import React from 'react'

// export default function DashboardError({
//   error,
//   unstable_retry,
// }: {
//   error: Error & { digest?: string }
//   unstable_retry: () => void
// }) {
//   React.useEffect(() => {
//     console.error('Dashboard Error:', error)
//   }, [error])

//   return (
//     <div className="min-h-[60vh] flex items-center justify-center p-6">
//       <div className="max-w-md w-full text-center space-y-6 bg-slate-50 border border-slate-200/60 p-8 rounded-3xl shadow-sm">
//         <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//         </div>

//         <div className="space-y-2">
//           <h2 className="text-xl font-bold text-gray-900">Dashboard segment error</h2>
//           <p className="text-sm text-gray-500">
//             Failed to load dashboard data. This could be due to a brief network issue.
//           </p>
//         </div>

//         {error?.message && (
//           <p className="text-xs bg-gray-100 border border-gray-200 text-gray-600 p-3 rounded-xl max-h-24 overflow-auto font-mono text-left">
//             {error.message}
//           </p>
//         )}

//         <div className="flex gap-3 pt-2">
//           <button
//             onClick={() => unstable_retry()}
//             className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition cursor-pointer"
//           >
//             Retry request
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import React from 'react'

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  React.useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-50 border border-slate-200/60 p-8 rounded-3xl shadow-sm">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Dashboard segment error</h2>
          <p className="text-sm text-gray-500">
            Failed to load dashboard data. This could be due to a brief network issue.
          </p>
        </div>

        {error?.message && (
          <p className="text-xs bg-gray-100 border border-gray-200 text-gray-600 p-3 rounded-xl max-h-24 overflow-auto font-mono text-left">
            {error.message}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => unstable_retry()}
            className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition cursor-pointer"
          >
            Retry request
          </button>
        </div>
      </div>
    </div>
  )
}
