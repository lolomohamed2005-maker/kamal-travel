export type Kind = 'trip' | 'study' | 'summer'

export type PackageRow = {
  id: string
  created_at: string
  title: string
  slug: string
  kind: Kind
  destination: string
  duration_days: number
  price_usd: number
  compare_at_price: number | null
  summary: string
  description: string
  highlights: string[]
  includes: string[]
  departures: string[]
  images: string[]
  seats: number
  is_featured: boolean
}

export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled'

export type BookingRow = {
  id: string
  created_at: string
  package_id: string | null
  package_title: string
  full_name: string
  phone: string
  email: string
  university: string
  travelers: number
  preferred_date: string
  message: string
  status: BookingStatus
}

export type AdminRow = {
  user_id: string
  created_at: string
}

export type SiteSettingRow = {
  key: string
  value: string
  updated_at: string
}

type TableDefinition<Row, InsertOmit extends keyof Row> = {
  Row: Row
  Insert: Omit<Row, InsertOmit>
  Update: Partial<Omit<Row, InsertOmit>>
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      packages: TableDefinition<PackageRow, 'id' | 'created_at'>
      booking_requests: {
        Row: BookingRow
        Insert: Omit<BookingRow, 'id' | 'created_at' | 'status'>
        Update: Partial<Omit<BookingRow, 'id' | 'created_at'>>
        Relationships: []
      }
      admins: TableDefinition<AdminRow, 'created_at'>
      site_settings: TableDefinition<SiteSettingRow, 'updated_at'>
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
