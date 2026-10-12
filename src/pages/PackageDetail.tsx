import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Clock, MapPin, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { kindLabel } from '../lib/kinds'
import { BookingForm } from '../components/package/BookingForm'
import { Reveal } from '../components/ui/Reveal'
import type { PackageRow } from '../types/database'

export function PackageDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [item, setItem] = useState<PackageRow | null>(null)
  const [missing, setMissing] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!slug) return
    setItem(null)
    setMissing(false)
    setActive(0)
    supabase
      .from('packages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setItem(data)
        else setMissing(true)
      })
  }, [slug])

  if (missing) {
    return (
      <div className="mx-auto max-w-md px-6 pb-24 pt-40 text-center">
        <h1 className="text-4xl text-forest">Package not found</h1>
        <Link to="/packages" className="mt-6 inline-block text-sm text-clay underline">
          Back to all packages
        </Link>
      </div>
    )
  }

  if (!item) {
    return <div className="mx-auto max-w-7xl px-6 pb-24 pt-40 text-sm text-ink/50">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand">
            <AnimatePresence mode="wait">
              <motion.img
                key={item.images[active]}
                src={item.images[active]}
                alt={item.title}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          {item.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {item.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActive(index)}
                  className={`h-20 w-28 overflow-hidden rounded-xl ring-2 transition-all ${
                    index === active ? 'ring-clay' : 'opacity-70 ring-transparent hover:opacity-100'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <Reveal className="mt-10">
            <span className="rounded-full bg-sand px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-forest">
              {kindLabel[item.kind]}
            </span>
            <h1 className="mt-5 text-5xl leading-[1.05] text-forest md:text-6xl">{item.title}</h1>
            <div className="mt-5 flex flex-wrap gap-6 text-sm text-ink/70">
              <span className="flex items-center gap-2">
                <MapPin size={16} strokeWidth={1.6} className="text-clay" />
                {item.destination}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} strokeWidth={1.6} className="text-clay" />
                {item.duration_days} days
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} strokeWidth={1.6} className="text-clay" />
                {item.seats} seats per departure
              </span>
            </div>
            <p className="mt-8 text-lg leading-relaxed text-ink/75">{item.description || item.summary}</p>
          </Reveal>

          {item.highlights.length > 0 && (
            <Reveal className="mt-12">
              <h2 className="text-3xl text-forest">Highlights</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {item.highlights.map((highlight) => (
                  <div key={highlight} className="rounded-2xl bg-sand px-5 py-4 text-sm">
                    {highlight}
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {item.includes.length > 0 && (
            <Reveal className="mt-12">
              <h2 className="text-3xl text-forest">What is included</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {item.includes.map((entry) => (
                  <li key={entry} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss text-cream">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {entry}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {item.departures.length > 0 && (
            <Reveal className="mt-12">
              <h2 className="text-3xl text-forest">Departure dates</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {item.departures.map((departure) => (
                  <span key={departure} className="rounded-full border border-forest/30 px-5 py-2 text-sm text-forest">
                    {departure}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <BookingForm item={item} />
          </div>
        </div>
      </div>
    </div>
  )
}
