


'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

function BusinessTab() {
  const supabase = getSupabaseClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [orgId, setOrgId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    logo_url: '',
  })

  // Handle input changes (optimized)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Fetch organization data
  useEffect(() => {
    let isMounted = true

    const fetchOrg = async () => {
      setLoading(true)
      setError(null)

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw new Error('User not authenticated')
        }

        // Fetch profile + org in sequence (cannot fully parallel due to dependency)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single()

        if (profileError || !profile?.organization_id) {
          throw new Error('No organization found')
        }

        if (!isMounted) return
        setOrgId(profile.organization_id)

        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single()

        if (orgError) throw orgError

        if (org && isMounted) {
          setForm({
            name: org.name || '',
            email: org.email || '',
            phone: org.phone || '',
            address: org.address || '',
            logo_url: org.logo_url || '',
          })
        }
      } catch (err) {
        if (!isMounted) return
        const message =
          err instanceof Error ? err.message : 'Failed to load data'
        setError(message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchOrg()

    return () => {
      isMounted = false
    }
  }, [supabase])

  // Handle logo upload (improved)
  const handleLogoUpload = async (file: File) => {
    if (!orgId) {
      setError('Organization ID not set')
      return
    }

    // Validation
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
      const filePath = `logos/${orgId}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath)

      if (data?.publicUrl) {
        setForm((prev) => ({ ...prev, logo_url: data.publicUrl }))
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Upload failed'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  // Handle submit (cleaned)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orgId) {
      setError('Organization ID not set')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          logo_url: form.logo_url,
        })
        .eq('id', orgId)

      if (error) throw error

      setSuccess('Business profile updated successfully!')

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Update failed'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        Loading...
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white p-6 rounded-2xl shadow-sm space-y-6 relative"
    >
      <h2 className="text-lg font-semibold">Business Profile</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {success && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['name', 'email', 'phone', 'address'] as const).map((field) => (
          <div key={field} className="flex flex-col gap-1">
            <label className="capitalize">
              {field.replace('_', ' ')}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className="space-y-3">
        <label className="text-sm">Business Logo</label>

        {form.logo_url && (
          <img
            src={form.logo_url}
            alt="Logo"
            className="h-16 w-16 object-cover rounded-lg border"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleLogoUpload(file)
          }}
          className="border p-2 rounded-lg w-full"
        />

        {uploading && (
          <p className="text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-deepgreen text-white px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

export default BusinessTab


