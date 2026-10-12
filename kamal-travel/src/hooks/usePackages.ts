import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Kind, PackageRow } from '../types/database'

export interface PackageFilters {
  kind?: Kind
  destination?: string
  search?: string
  featured?: boolean
  limit?: number
}

export function usePackages(filters: PackageFilters = {}) {
  const [packages, setPackages] = useState<PackageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      let query = supabase.from('packages').select('*').order('created_at', { ascending: false })

      if (filters.kind) query = query.eq('kind', filters.kind)
      if (filters.destination) query = query.eq('destination', filters.destination)
      if (filters.featured) query = query.eq('is_featured', true)
      if (filters.search) query = query.ilike('title', `%${filters.search}%`)
      if (filters.limit) query = query.limit(filters.limit)

      const { data, error: queryError } = await query
      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setPackages([])
      } else {
        setError(null)
        setPackages(data ?? [])
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [filters.kind, filters.destination, filters.featured, filters.search, filters.limit])

  return { packages, loading, error }
}
