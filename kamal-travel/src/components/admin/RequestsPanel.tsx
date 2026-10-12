import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { whatsappLink } from '../layout/WhatsAppButton'
import type { BookingRow, BookingStatus } from '../../types/database'

const statuses: BookingStatus[] = ['new', 'contacted', 'confirmed', 'cancelled']

export function RequestsPanel() {
  const [requests, setRequests] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('booking_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
    } else {
      setError(null)
      setRequests(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function updateStatus(id: string, status: BookingStatus) {
    const { error: updateError } = await supabase.from('booking_requests').update({ status }).eq('id', id)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setRequests((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status } : entry)))
  }

  async function remove(id: string) {
    if (!confirm('Delete this request?')) return
    const { error: deleteError } = await supabase.from('booking_requests').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setRequests((prev) => prev.filter((entry) => entry.id !== id))
  }

  if (loading) return <p className="text-sm text-ink/50">Loading requests...</p>
  if (error) return <p className="text-sm text-clay">{error}</p>
  if (requests.length === 0) return <p className="text-sm text-ink/50">No booking requests yet.</p>

  return (
    <div className="space-y-5">
      {requests.map((request) => (
        <div key={request.id} className="border border-line bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl text-forest">{request.package_title || 'Deleted package'}</p>
              <p className="mt-1 text-xs text-ink/50">{new Date(request.created_at).toLocaleString()}</p>
            </div>
            <select
              value={request.status}
              onChange={(event) => updateStatus(request.id, event.target.value as BookingStatus)}
              className="border border-line bg-transparent px-3 py-1.5 text-sm outline-none focus:border-forest"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            <div className="space-y-1 text-ink/75">
              <p className="font-medium text-ink">{request.full_name}</p>
              <p>
                <a href={`tel:${request.phone}`} className="underline underline-offset-2">
                  {request.phone}
                </a>
              </p>
              {request.email && <p>{request.email}</p>}
              {request.university && <p>{request.university}</p>}
            </div>
            <div className="space-y-1 text-ink/75">
              <p>Travelers: {request.travelers}</p>
              <p>Preferred date: {request.preferred_date || 'Not set'}</p>
              {request.message && <p>{request.message}</p>}
            </div>
          </div>

          <div className="mt-4 flex gap-5 text-xs">
            <a
              href={whatsappLink(request.phone, `Hello ${request.full_name}, this is Kamal about ${request.package_title}.`)}
              target="_blank"
              rel="noreferrer"
              className="text-forest underline"
            >
              Open WhatsApp
            </a>
            <button onClick={() => remove(request.id)} className="text-clay underline">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
