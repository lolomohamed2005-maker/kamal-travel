import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { kinds } from '../../lib/kinds'
import { ImageUploadField } from './ImageUploadField'
import type { Kind, PackageRow } from '../../types/database'

interface PackageFormProps {
  item?: PackageRow
  onSaved: () => void
  onCancel: () => void
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function lines(value: string) {
  return value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

const fieldClass =
  'mt-1 w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-forest'

export function PackageForm({ item, onSaved, onCancel }: PackageFormProps) {
  const [title, setTitle] = useState(item?.title ?? '')
  const [kind, setKind] = useState<Kind>(item?.kind ?? 'trip')
  const [destination, setDestination] = useState(item?.destination ?? '')
  const [days, setDays] = useState(item ? String(item.duration_days) : '7')
  const [price, setPrice] = useState(item ? String(item.price_usd) : '')
  const [compareAt, setCompareAt] = useState(item?.compare_at_price ? String(item.compare_at_price) : '')
  const [seats, setSeats] = useState(item ? String(item.seats) : '20')
  const [summary, setSummary] = useState(item?.summary ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [highlights, setHighlights] = useState(item?.highlights.join('\n') ?? '')
  const [includes, setIncludes] = useState(item?.includes.join('\n') ?? '')
  const [departures, setDepartures] = useState(item?.departures.join(', ') ?? '')
  const [featured, setFeatured] = useState(item?.is_featured ?? false)
  const [images, setImages] = useState<string[]>(item?.images ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (images.length === 0) {
      setError('Add at least one image')
      return
    }

    setSaving(true)

    const payload = {
      title,
      slug: item?.slug ?? slugify(title),
      kind,
      destination,
      duration_days: Number(days),
      price_usd: Number(price),
      compare_at_price: compareAt ? Number(compareAt) : null,
      summary,
      description,
      highlights: lines(highlights),
      includes: lines(includes),
      departures: departures
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
      images,
      seats: Number(seats),
      is_featured: featured,
    }

    const { error: saveError } = item
      ? await supabase.from('packages').update(payload).eq('id', item.id)
      : await supabase.from('packages').insert(payload)

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-line bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-ink/70">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="text-sm text-ink/70">Type</label>
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)} className={fieldClass}>
            {kinds.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-ink/70">Destination</label>
          <input
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Istanbul"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm text-ink/70">Duration (days)</label>
          <input required type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="text-sm text-ink/70">Price per person (USD)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm text-ink/70">Old price (optional, USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={compareAt}
            onChange={(e) => setCompareAt(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm text-ink/70">Seats per departure</label>
          <input required type="number" min="0" value={seats} onChange={(e) => setSeats(e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="text-sm text-ink/70">Departure dates (comma separated)</label>
          <input
            value={departures}
            onChange={(e) => setDepartures(e.target.value)}
            placeholder="2026-12-20, 2027-01-10"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-ink/70">Short summary</label>
        <input value={summary} onChange={(e) => setSummary(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label className="text-sm text-ink/70">Full description</label>
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={fieldClass} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-ink/70">Highlights (one per line)</label>
          <textarea rows={5} value={highlights} onChange={(e) => setHighlights(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className="text-sm text-ink/70">What is included (one per line)</label>
          <textarea rows={5} value={includes} onChange={(e) => setIncludes(e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div>
        <p className="text-sm text-ink/70">Images (the first one is the main image)</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={url} className="w-28">
              <img src={url} alt="" className="h-20 w-28 bg-sand object-cover" />
              <div className="mt-1 flex justify-between text-xs">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => setImages((prev) => [url, ...prev.filter((entry) => entry !== url)])}
                    className="text-forest underline"
                  >
                    Main
                  </button>
                ) : (
                  <span className="text-ink/40">Main</span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((entry) => entry !== url))}
                  className="text-clay underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <ImageUploadField label="Add an image" value={null} onChange={(url) => setImages((prev) => [...prev, url])} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 accent-forest"
        />
        Show in Featured packages on the homepage
      </label>

      {error && <p className="text-sm text-clay">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-forest px-6 py-2.5 text-sm text-cream transition-colors hover:bg-forest-dark disabled:opacity-40"
        >
          {saving ? 'Saving...' : item ? 'Save changes' : 'Add package'}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-6 py-2.5 text-sm hover:border-forest">
          Cancel
        </button>
      </div>
    </form>
  )
}
