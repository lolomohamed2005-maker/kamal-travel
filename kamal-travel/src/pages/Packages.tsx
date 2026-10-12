import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { usePackages } from '../hooks/usePackages'
import { PackageCard } from '../components/package/PackageCard'
import { kinds } from '../lib/kinds'
import type { Kind } from '../types/database'

export function Packages() {
  const { kind } = useParams<{ kind?: Kind }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const destination = searchParams.get('destination') ?? ''
  const search = searchParams.get('q') ?? ''

  const all = usePackages({})
  const { packages, loading, error } = usePackages({
    kind,
    destination: destination || undefined,
    search: search || undefined,
  })

  const destinations = useMemo(
    () => Array.from(new Set(all.packages.map((item) => item.destination))).sort(),
    [all.packages],
  )

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const title = kind ? (kinds.find((item) => item.value === kind)?.label ?? 'Packages') : 'All packages'
  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : ''

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="text-[11px] uppercase tracking-[0.4em] text-clay">Egypt to Turkey</p>
      <h1 className="mt-3 text-5xl text-forest md:text-7xl">{title}</h1>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {[{ value: undefined, label: 'All' }, ...kinds.map((item) => ({ value: item.value, label: item.short }))].map(
          (item) => (
            <Link
              key={item.label}
              to={`${item.value ? `/packages/${item.value}` : '/packages'}${suffix}`}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${
                kind === item.value ? 'bg-forest text-cream' : 'bg-sand text-ink hover:bg-line'
              }`}
            >
              {item.label}
            </Link>
          ),
        )}

        <select
          value={destination}
          onChange={(event) => update('destination', event.target.value)}
          className="rounded-full bg-sand px-5 py-2 text-sm outline-none"
        >
          <option value="">Any destination</option>
          {destinations.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2 rounded-full bg-sand px-4 py-2">
          <Search size={16} strokeWidth={1.6} className="text-ink/50" />
          <input
            value={search}
            onChange={(event) => update('q', event.target.value)}
            placeholder="Search a trip"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-ink/40"
          />
        </div>
      </div>

      <div className="mt-12">
        {loading && <p className="text-sm text-ink/50">Loading packages...</p>}
        {error && <p className="text-sm text-clay">{error}</p>}
        {!loading && !error && packages.length === 0 && (
          <p className="text-sm text-ink/50">No packages match these filters yet.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((item, index) => (
            <PackageCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
