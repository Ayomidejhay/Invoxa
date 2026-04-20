

// 'use client'

// import { useState } from 'react'
// import { createBrowserClient } from '@supabase/ssr'
// import { Eye, EyeOff } from 'lucide-react'

// export function AccountTab() {
//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

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

//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault()
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

//     setLoading(true)

//     const { error } = await supabase.auth.updateUser({
//       password: form.new_password,
//     })

//     if (error) {
//       setError(error.message)
//     } else {
//       setSuccess('Password updated successfully')
//       setForm({ current_password: '', new_password: '', confirm_password: '' })
//     }

//     setLoading(false)
//   }

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8">
//       <h2 className="text-lg font-semibold">Account Settings</h2>

//       {/* Change Password */}
//       <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
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
//               onClick={() => toggleVisibility('current')}
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
//               onClick={() => toggleVisibility('new')}
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
//               onClick={() => toggleVisibility('confirm')}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-deepgreen text-light px-6 py-2 rounded-lg disabled:opacity-50"
//         >
//           {loading ? 'Updating...' : 'Update Password'}
//         </button>
//       </form>

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

export function AccountTab() {
  const supabase = getSupabaseClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
    setSuccess(null)

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
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user?.email) {
        throw new Error('Session expired. Please log in again.')
      }

      // Re-authenticate
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: form.current_password,
      })

      if (signInError) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: form.new_password,
      })

      if (updateError) throw updateError

      setSuccess('Password updated successfully')

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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8">
      <h2 className="text-lg font-semibold">Account Settings</h2>

      <div className="space-y-5 max-w-md">
        <h3 className="font-medium">Change Password</h3>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* Current Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Current Password</label>
          <div className="relative">
            <input
              type={showPassword.current ? 'text' : 'password'}
              name="current_password"
              value={form.current_password}
              onChange={handleChange}
              placeholder="Enter current password"
              className="border p-3 rounded-lg w-full pr-10"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                toggleVisibility('current')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword.new ? 'text' : 'password'}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="border p-3 rounded-lg w-full pr-10"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                toggleVisibility('new')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="border p-3 rounded-lg w-full pr-10"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                toggleVisibility('confirm')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handlePasswordChange}
          disabled={loading}
          className="bg-deepgreen text-light px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-6 space-y-3">
        <h3 className="font-medium text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-600">This action will sign you out.</p>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  )
}