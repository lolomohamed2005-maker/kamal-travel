import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/format'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { whatsappLink } from '../layout/WhatsAppButton'
import type { PackageRow } from '../../types/database'

const fieldClass =
  'mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-forest'

export function BookingForm({ item }: { item: PackageRow }) {
  const { settings } = useSiteSettings()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [date, setDate] = useState(item.departures[0] ?? '')
  const [message, setMessage] = useState('')
  const [trap, setTrap] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const count = Math.max(1, Number(travelers) || 1)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (trap) {
      setDone(true)
      return
    }

    setSubmitting(true)
    const { error: insertError } = await supabase.from('booking_requests').insert({
      package_id: item.id,
      package_title: item.title,
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      university: university.trim(),
      travelers: count,
      preferred_date: date,
      message: message.trim(),
    })
    setSubmitting(false)

    if (insertError) {
      setError('We could not send your request. Please check your details and try again.')
      return
    }

    setDone(true)
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,58,83,0.5)] ring-1 ring-line">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center"
          >
            <svg viewBox="0 0 52 52" className="mx-auto h-16 w-16 text-moss">
              <motion.circle
                cx="26"
                cy="26"
                r="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }}
              />
              <motion.path
                d="M15 27l8 8 14-16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </svg>
            <h3 className="mt-5 text-3xl text-forest">Request received</h3>
            <p className="mt-2 text-sm text-ink/60">
              Thank you {fullName.split(' ')[0]}. We will contact you on {phone} very soon.
            </p>
            {settings.whatsapp_number && (
              <a
                href={whatsappLink(
                  settings.whatsapp_number,
                  `Hello, I just sent a request for ${item.title}. My name is ${fullName}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm text-white"
              >
                <MessageCircle size={18} />
                Continue on WhatsApp
              </a>
            )}
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink/40">From, per person</p>
                <p className="font-display text-4xl text-forest">{formatPrice(item.price_usd)}</p>
              </div>
              {item.compare_at_price && (
                <p className="text-sm text-ink/40 line-through">{formatPrice(item.compare_at_price)}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-ink/70">Full name</label>
              <input required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <label className="text-sm text-ink/70">Phone (WhatsApp)</label>
                <input
                  required
                  inputMode="tel"
                  minLength={6}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Email (optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
              </div>
            </div>

            <div>
              <label className="text-sm text-ink/70">University or faculty (optional)</label>
              <input value={university} onChange={(e) => setUniversity(e.target.value)} className={fieldClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <label className="text-sm text-ink/70">Travelers</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Preferred departure</label>
                <select value={date} onChange={(e) => setDate(e.target.value)} className={fieldClass}>
                  {item.departures.map((departure) => (
                    <option key={departure} value={departure}>
                      {departure}
                    </option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-ink/70">Message (optional)</label>
              <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={fieldClass} />
            </div>

            <input
              tabIndex={-1}
              autoComplete="off"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
              <span className="text-ink/60">Estimated total</span>
              <span className="font-display text-2xl text-forest">{formatPrice(item.price_usd * count)}</span>
            </div>

            {error && <p className="text-sm text-clay">{error}</p>}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-full bg-clay py-3.5 text-sm tracking-wide text-cream disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send booking request'}
            </motion.button>
            <p className="text-center text-xs text-ink/40">No payment now. We confirm the details with you first.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
