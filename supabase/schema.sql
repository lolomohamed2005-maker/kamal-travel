create extension if not exists "pgcrypto";

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  kind text not null check (kind in ('trip', 'study', 'summer')),
  destination text not null,
  duration_days integer not null check (duration_days > 0),
  price_usd numeric(10, 2) not null check (price_usd >= 0),
  compare_at_price numeric(10, 2),
  summary text not null default '',
  description text not null default '',
  highlights text[] not null default '{}',
  includes text[] not null default '{}',
  departures text[] not null default '{}',
  images text[] not null default '{}',
  seats integer not null default 20 check (seats >= 0),
  is_featured boolean not null default false
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  package_id uuid references public.packages (id) on delete set null,
  package_title text not null default '',
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 6 and 30),
  email text not null default '' check (char_length(email) <= 160),
  university text not null default '' check (char_length(university) <= 160),
  travelers integer not null default 1 check (travelers between 1 and 20),
  preferred_date text not null default '' check (char_length(preferred_date) <= 60),
  message text not null default '' check (char_length(message) <= 1000),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled'))
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists packages_kind_idx on public.packages (kind);
create index if not exists packages_featured_idx on public.packages (is_featured);
create index if not exists booking_requests_created_idx on public.booking_requests (created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.packages enable row level security;
alter table public.booking_requests enable row level security;
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "packages_read" on public.packages;
drop policy if exists "packages_admin_insert" on public.packages;
drop policy if exists "packages_admin_update" on public.packages;
drop policy if exists "packages_admin_delete" on public.packages;
create policy "packages_read" on public.packages for select using (true);
create policy "packages_admin_insert" on public.packages for insert to authenticated with check (public.is_admin());
create policy "packages_admin_update" on public.packages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "packages_admin_delete" on public.packages for delete to authenticated using (public.is_admin());

drop policy if exists "requests_public_insert" on public.booking_requests;
drop policy if exists "requests_admin_read" on public.booking_requests;
drop policy if exists "requests_admin_update" on public.booking_requests;
drop policy if exists "requests_admin_delete" on public.booking_requests;
create policy "requests_public_insert" on public.booking_requests for insert to anon, authenticated with check (status = 'new');
create policy "requests_admin_read" on public.booking_requests for select to authenticated using (public.is_admin());
create policy "requests_admin_update" on public.booking_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "requests_admin_delete" on public.booking_requests for delete to authenticated using (public.is_admin());

drop policy if exists "admins_read_own" on public.admins;
create policy "admins_read_own" on public.admins for select to authenticated using (user_id = auth.uid());

drop policy if exists "settings_read" on public.site_settings;
drop policy if exists "settings_admin_insert" on public.site_settings;
drop policy if exists "settings_admin_update" on public.site_settings;
create policy "settings_read" on public.site_settings for select using (true);
create policy "settings_admin_insert" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "settings_admin_update" on public.site_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "images_public_read" on storage.objects;
drop policy if exists "images_admin_insert" on storage.objects;
drop policy if exists "images_admin_update" on storage.objects;
drop policy if exists "images_admin_delete" on storage.objects;
create policy "images_public_read" on storage.objects for select using (bucket_id = 'images');
create policy "images_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and public.is_admin());
create policy "images_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'images' and public.is_admin());
create policy "images_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'images' and public.is_admin());
