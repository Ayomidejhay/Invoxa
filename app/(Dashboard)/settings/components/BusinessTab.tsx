


// 'use client'

// import { useState } from 'react'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../../components/OrganizationProvider'

// function BusinessTab() {
//   const supabase = getSupabaseClient()
//   const { organization } = useOrganization()

//   const [saving, setSaving] = useState(false)
//   const [uploading, setUploading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)

//   // Seeded directly from the OrganizationProvider context — no loading
//   // spinner needed, the layout already fetched this server-side.
//   const [form, setForm] = useState({
//     name: organization.name || '',
//     email: organization.email || '',
//     phone: organization.phone || '',
//     address: organization.address || '',
//     logo_url: organization.logo_url || '',
//   })

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target
//     setForm((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleLogoUpload = async (file: File) => {
//     if (!file.type.startsWith('image/')) {
//       setError('Only image files are allowed')
//       return
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       setError('File must be less than 2MB')
//       return
//     }

//     setUploading(true)
//     setError(null)

//     try {
//       const fileExt = file.name.split('.').pop()
//       // Path convention enforced by the storage RLS policy: {org_id}/logo.ext
//       const filePath = `${organization.id}/logo.${fileExt}`

//       const { error: uploadError } = await supabase.storage
//         .from('logos')
//         .upload(filePath, file, { upsert: true })

//       if (uploadError) throw uploadError

//       const { data } = supabase.storage.from('logos').getPublicUrl(filePath)

//       if (data?.publicUrl) {
//         // Cache-bust so the new logo shows immediately instead of a stale
//         // CDN-cached version at the same URL.
//         setForm((prev) => ({ ...prev, logo_url: `${data.publicUrl}?t=${Date.now()}` }))
//       }
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Upload failed'
//       setError(message)
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     setSaving(true)
//     setError(null)
//     setSuccess(null)

//     try {
//       const { error } = await supabase
//         .from('organizations')
//         .update({
//           name: form.name,
//           email: form.email,
//           phone: form.phone,
//           address: form.address,
//           logo_url: form.logo_url.split('?')[0],
//         })
//         .eq('id', organization.id)

//       if (error) throw error

//       setSuccess('Business profile updated successfully!')
//       setTimeout(() => setSuccess(null), 3000)
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Update failed'
//       setError(message)
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       noValidate
//       className="bg-white p-6 rounded-2xl shadow-sm space-y-6 relative"
//     >
//       <h2 className="text-lg font-semibold">Business Profile</h2>

//       {error && <p className="text-sm text-red-500">{error}</p>}

//       {success && (
//         <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
//           {success}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {(['name', 'email', 'phone', 'address'] as const).map((field) => (
//           <div key={field} className="flex flex-col gap-1">
//             <label className="capitalize">{field.replace('_', ' ')}</label>
//             <input
//               name={field}
//               value={form[field]}
//               onChange={handleChange}
//               className="border p-3 rounded-lg"
//             />
//           </div>
//         ))}
//       </div>

//       <div className="space-y-3">
//         <label className="text-sm">Business Logo</label>

//         {form.logo_url && (
//           <img
//             src={form.logo_url}
//             alt="Logo"
//             className="h-16 w-16 object-cover rounded-lg border"
//           />
//         )}

//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files?.[0]
//             if (file) handleLogoUpload(file)
//           }}
//           className="border p-2 rounded-lg w-full"
//         />

//         {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
//       </div>

//       <button
//         type="submit"
//         disabled={saving}
//         className="bg-deepgreen text-white px-6 py-2 rounded-lg disabled:opacity-50"
//       >
//         {saving ? 'Saving...' : 'Save Changes'}
//       </button>
//     </form>
//   )
// }

// export default BusinessTab


'use client'

import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../../components/OrganizationProvider'
import { Card } from '@/app/components/ui/Card'
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/ui/Button'
import { useToast } from '@/app/components/ui/Toast'

function BusinessTab() {
  const supabase = getSupabaseClient()
  const { organization } = useOrganization()
  const toast = useToast()

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Seeded directly from the OrganizationProvider context — no loading
  // spinner needed, the layout already fetched this server-side.
  const [form, setForm] = useState({
    name: organization.name || '',
    email: organization.email || '',
    phone: organization.phone || '',
    address: organization.address || '',
    logo_url: organization.logo_url || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File must be less than 2MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      // Path convention enforced by the storage RLS policy: {org_id}/logo.ext
      const filePath = `${organization.id}/logo.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath)

      if (data?.publicUrl) {
        // Cache-bust so the new logo shows immediately instead of a stale
        // CDN-cached version at the same URL.
        setForm((prev) => ({ ...prev, logo_url: `${data.publicUrl}?t=${Date.now()}` }))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          logo_url: form.logo_url.split('?')[0],
        })
        .eq('id', organization.id)

      if (error) throw error

      toast.success('Business profile updated')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="space-y-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <h2 className="text-lg font-semibold text-dark">Business Profile</h2>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Business name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-dark">Business Logo</label>

          {form.logo_url && (
            <img
              src={form.logo_url}
              alt="Logo"
              className="h-16 w-16 object-cover rounded-xl border border-border"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleLogoUpload(file)
            }}
            className="border border-border p-2 rounded-xl w-full text-sm"
          />

          {uploading && <p className="text-sm text-muted">Uploading...</p>}
        </div>

        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </form>
    </Card>
  )
}

export default BusinessTab
