import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { formatPrice } from '../../lib/format'
import { kindLabel } from '../../lib/kinds'
import type { PackageRow } from '../../types/database'

export function PackageCard({ item, index = 0 }: { item: PackageRow; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/package/${item.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(16,33,43,0.06)] ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(11,58,83,0.45)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <img
            src={item.images[0]}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-forest">
            {kindLabel[item.kind]}
          </span>
          {item.compare_at_price && (
            <span className="absolute right-3 top-3 rounded-full bg-clay px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cream">
              Offer
            </span>
          )}
          <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-cream text-forest opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4 text-xs text-ink/60">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.6} />
              {item.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.6} />
              {item.duration_days} days
            </span>
          </div>
          <h3 className="mt-3 text-2xl leading-tight text-forest">{item.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-ink/60">{item.summary}</p>
          <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink/40">From, per person</p>
              <p className="font-display text-3xl text-forest">{formatPrice(item.price_usd)}</p>
            </div>
            {item.compare_at_price && (
              <p className="text-sm text-ink/40 line-through">{formatPrice(item.compare_at_price)}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
