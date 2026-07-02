


// 'use client'

// import { useState } from 'react'
// import { Eye, EyeOff } from 'lucide-react'
// import { getSupabaseClient } from '@/lib/supabase/client'

// export function AccountTab() {
//   const supabase = getSupabaseClient()

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)

//   const [form, setForm] = useState({
//     current_password: '',
//     new_password: '',
//     confirm_password: '',
//   })

//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
//     setShowPassword((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }))
//   }

//   const handlePasswordChange = async () => {
//     setError(null)
//     setSuccess(null)

//     if (form.new_password !== form.confirm_password) {
//       setError('Passwords do not match')
//       return
//     }

//     if (form.new_password.length < 6) {
//       setError('Password must be at least 6 characters')
//       return
//     }

//     if (!form.current_password) {
//       setError('Enter your current password')
//       return
//     }

//     setLoading(true)

//     try {
//       // Get current user
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser()

//       if (userError || !user?.email) {
//         throw new Error('Session expired. Please log in again.')
//       }

//       // Re-authenticate
//       const { error: signInError } = await supabase.auth.signInWithPassword({
//         email: user.email,
//         password: form.current_password,
//       })

//       if (signInError) {
//         throw new Error('Current password is incorrect')
//       }

//       // Update password
//       const { error: updateError } = await supabase.auth.updateUser({
//         password: form.new_password,
//       })

//       if (updateError) throw updateError

//       setSuccess('Password updated successfully')

//       setForm({
//         current_password: '',
//         new_password: '',
//         confirm_password: '',
//       })
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : 'Something went wrong'
//       setError(errorMessage)
//     }

//     setLoading(false)
//   }

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8">
//       <h2 className="text-lg font-semibold">Account Settings</h2>

//       <div className="space-y-5 max-w-md">
//         <h3 className="font-medium">Change Password</h3>

//         {error && <p className="text-sm text-red-500">{error}</p>}
//         {success && <p className="text-sm text-green-600">{success}</p>}

//         {/* Current Password */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium">Current Password</label>
//           <div className="relative">
//             <input
//               type={showPassword.current ? 'text' : 'password'}
//               name="current_password"
//               value={form.current_password}
//               onChange={handleChange}
//               placeholder="Enter current password"
//               className="border p-3 rounded-lg w-full pr-10"
//             />
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault()
//                 toggleVisibility('current')
//               }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         {/* New Password */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium">New Password</label>
//           <div className="relative">
//             <input
//               type={showPassword.new ? 'text' : 'password'}
//               name="new_password"
//               value={form.new_password}
//               onChange={handleChange}
//               placeholder="Enter new password"
//               className="border p-3 rounded-lg w-full pr-10"
//             />
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault()
//                 toggleVisibility('new')
//               }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         {/* Confirm Password */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium">Confirm New Password</label>
//           <div className="relative">
//             <input
//               type={showPassword.confirm ? 'text' : 'password'}
//               name="confirm_password"
//               value={form.confirm_password}
//               onChange={handleChange}
//               placeholder="Confirm new password"
//               className="border p-3 rounded-lg w-full pr-10"
//             />
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault()
//                 toggleVisibility('confirm')
//               }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="button"
//           onClick={handlePasswordChange}
//           disabled={loading}
//           className="bg-deepgreen text-light px-6 py-2 rounded-lg disabled:opacity-50"
//         >
//           {loading ? 'Updating...' : 'Update Password'}
//         </button>
//       </div>

//       {/* Danger Zone */}
//       <div className="border-t pt-6 space-y-3">
//         <h3 className="font-medium text-red-600">Danger Zone</h3>
//         <p className="text-sm text-gray-600">This action will sign you out.</p>

//         <button
//           onClick={async () => {
//             await supabase.auth.signOut()
//             window.location.href = '/login'
//           }}
//           className="bg-red-600 text-white px-4 py-2 rounded-lg"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Card } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { useToast } from '@/app/components/ui/Toast'

export function AccountTab() {
  const supabase = getSupabaseClient()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handlePasswordChange = async () => {
    setError(null)

    if (form.new_password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }

    if (form.new_password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!form.current_password) {
      setError('Enter your current password')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user?.email) {
        throw new Error('Session expired. Please log in again.')
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: form.current_password,
      })

      if (signInError) {
        throw new Error('Current password is incorrect')
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: form.new_password,
      })

      if (updateError) throw updateError

      toast.success('Password updated successfully')

      setForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
    }

    setLoading(false)
  }

  const passwordField = (
    field: 'current' | 'new' | 'confirm',
    name: string,
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</label>
      <div className="relative">
        <input
          type={showPassword[field] ? 'text' : 'password'}
          name={name}
          value={form[name as keyof typeof form]}
          onChange={handleChange}
          placeholder={placeholder}
          className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#202023] text-dark dark:text-white p-2.5 rounded-xl w-full pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 placeholder-zinc-500"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleVisibility(field)
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 cursor-pointer"
        >
          {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="space-y-8">
        <h2 className="text-lg font-bold text-dark dark:text-white">Account Settings</h2>

        <div className="space-y-5 max-w-md">
          <h3 className="font-semibold text-zinc-700 dark:text-zinc-200 text-sm">Change Password</h3>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {passwordField('current', 'current_password', 'Current Password', 'Enter current password')}
          {passwordField('new', 'new_password', 'New Password', 'Enter new password')}
          {passwordField('confirm', 'confirm_password', 'Confirm New Password', 'Confirm new password')}

          <Button onClick={handlePasswordChange} loading={loading} className="bg-[#1E3A8A] text-white border border-blue-700/50 hover:bg-blue-700 font-semibold py-2.5 px-6">
            Update Password
          </Button>
        </div>
      </Card>

      <Card className="space-y-3 border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-[#202023]">
        <h3 className="font-semibold text-red-650 dark:text-red-400">Danger Zone</h3>
        <p className="text-sm text-zinc-550 dark:text-zinc-400">This action will sign you out.</p>

        <Button
          variant="danger"
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
          className="bg-red-800 border border-red-900/50 hover:bg-red-700 font-semibold text-white px-5 py-2.5"
        >
          Logout
        </Button>
      </Card>
    </div>
  )
}
