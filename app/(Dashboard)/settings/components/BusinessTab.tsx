


// 'use client'

// import { useState } from 'react'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../../components/OrganizationProvider'
// import { Card } from '@/app/components/ui/Card'
// import { Input } from '@/app/components/ui/Input'
// import { Button } from '@/app/components/ui/Button'
// import { useToast } from '@/app/components/ui/Toast'

// function BusinessTab() {
//   const supabase = getSupabaseClient()
//   const { organization } = useOrganization()
//   const toast = useToast()

//   const [saving, setSaving] = useState(false)
//   const [uploading, setUploading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

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

//       toast.success('Business profile updated')
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Update failed'
//       setError(message)
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <Card className="space-y-6">
//       <form onSubmit={handleSubmit} noValidate className="space-y-6">
//         <h2 className="text-lg font-semibold text-dark">Business Profile</h2>

//         {error && <p className="text-sm text-red-600">{error}</p>}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input label="Business name" name="name" value={form.name} onChange={handleChange} />
//           <Input label="Email" name="email" value={form.email} onChange={handleChange} />
//           <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
//           <Input label="Address" name="address" value={form.address} onChange={handleChange} />
//         </div>

//         <div className="space-y-3">
//           <label className="text-sm font-medium text-dark">Business Logo</label>

//           {form.logo_url && (
//             <img
//               src={form.logo_url}
//               alt="Logo"
//               className="h-16 w-16 object-cover rounded-xl border border-border"
//             />
//           )}

//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files?.[0]
//               if (file) handleLogoUpload(file)
//             }}
//             className="border border-border p-2 rounded-xl w-full text-sm"
//           />

//           {uploading && <p className="text-sm text-muted">Uploading...</p>}
//         </div>

//         <Button type="submit" loading={saving}>
//           Save Changes
//         </Button>
//       </form>
//     </Card>
//   )
// }

// export default BusinessTab


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../../components/OrganizationProvider'
import { Card } from '@/app/components/ui/Card'
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/ui/Button'
import { useToast } from '@/app/components/ui/Toast'

function BusinessTab() {
  const supabase = getSupabaseClient()
  const router = useRouter()
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
      // Same reasoning as InvoiceTab — the org context elsewhere in the app
      // is seeded server-side and won't pick this up without a refresh.
      router.refresh()
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
        <h2 className="text-lg font-bold text-dark dark:text-white">Business Profile</h2>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Business name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="space-y-3 flex flex-col">
          <label className="text-sm font-medium text-zinc-750 dark:text-zinc-200">Business Logo</label>

          {form.logo_url && (
            <div className="mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.logo_url}
                crossOrigin="anonymous"
                alt="Logo"
                className="h-16 w-16 object-cover rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleLogoUpload(file)
            }}
            className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#202023] text-zinc-700 dark:text-zinc-300 p-2.5 rounded-xl w-full text-sm cursor-pointer focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/40 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-950/60"
          />

          {uploading && <p className="text-sm text-zinc-400">Uploading...</p>}
        </div>

        <Button type="submit" loading={saving} className="bg-[#1E3A8A] text-white border border-blue-700/50 hover:bg-blue-700 font-semibold px-6 py-2.5">
          Save Changes
        </Button>
      </form>
    </Card>
  )
}

export default BusinessTab
