-- Seoul Crafted — initial schema
-- Tables, enums, triggers, RLS policies, storage bucket

create extension if not exists "pgcrypto";

-- ============================================================
-- Admin allowlist (invite-only ops team)
-- ============================================================
create table if not exists public.admins (
  email text primary key,
  name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public, auth
as $$
  select exists(
    select 1 from public.admins
    where email = (select auth.jwt() ->> 'email')
  );
$$;

-- ============================================================
-- Guides
-- ============================================================
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  languages text[] not null default array[]::text[],
  bio text,
  active boolean not null default true,
  rating numeric(3,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Routes (tours)
-- ============================================================
do $$ begin
  create type public.route_tier as enum ('curated', 'guided_custom', 'route_only');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.route_category as enum ('culture', 'food', 'nature', 'shopping', 'nightlife', 'family', 'photo', 'craft');
exception when duplicate_object then null; end $$;

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  tier public.route_tier not null default 'curated',
  category public.route_category,
  price_cents integer not null default 0,
  duration_min integer not null default 180,
  hero_image_url text,
  theme_color text,
  badge text,
  tags text[] not null default array[]::text[],
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Route translations
-- ============================================================
do $$ begin
  create type public.lang_code as enum ('en', 'zh', 'ja', 'vi');
exception when duplicate_object then null; end $$;

create table if not exists public.routes_i18n (
  route_id uuid not null references public.routes(id) on delete cascade,
  lang public.lang_code not null,
  title text,
  subtitle text,
  description text,
  primary key (route_id, lang)
);

-- ============================================================
-- Route stops (itinerary)
-- ============================================================
create table if not exists public.route_stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  position integer not null,
  time_label text,
  title text not null,
  duration_min integer,
  note text,
  unique (route_id, position)
);

-- ============================================================
-- Bookings
-- ============================================================
do $$ begin
  create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  customer_name text,
  route_id uuid references public.routes(id) on delete set null,
  guide_id uuid references public.guides(id) on delete set null,
  booking_date date,
  people integer not null default 1 check (people between 1 and 6),
  status public.booking_status not null default 'pending',
  price_cents integer not null default 0,
  stripe_payment_intent_id text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists bookings_date_idx on public.bookings(booking_date);

-- ============================================================
-- Conversations + Messages
-- ============================================================
do $$ begin
  create type public.chat_channel as enum ('guide', 'support');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.message_sender as enum ('customer', 'guide', 'support');
exception when duplicate_object then null; end $$;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  channel public.chat_channel not null,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (customer_email, channel)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender public.message_sender not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at desc);

-- ============================================================
-- i18n strings (generic UI strings, not route content)
-- ============================================================
create table if not exists public.i18n_strings (
  key text primary key,
  en text,
  zh text,
  ja text,
  vi text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Media library (metadata; binaries live in Storage bucket)
-- ============================================================
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  filename text not null,
  mime text,
  size_bytes integer,
  width integer,
  height integer,
  uploaded_by text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Settings (singleton)
-- ============================================================
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  brand_name text default 'Seoul Crafted',
  tagline text,
  contact_email text,
  support_hours text,
  max_party_size integer not null default 6,
  curated_cap_min integer not null default 180,
  guided_cap_min integer not null default 300,
  promo_codes jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.settings (id) values (1) on conflict do nothing;

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

do $$
declare t text;
begin
  for t in select unnest(array['guides','routes','bookings','settings','i18n_strings'])
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%1$I;
       create trigger set_updated_at before update on public.%1$I
       for each row execute function public.tg_set_updated_at();',
      t
    );
  end loop;
end $$;

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table public.admins enable row level security;
alter table public.guides enable row level security;
alter table public.routes enable row level security;
alter table public.routes_i18n enable row level security;
alter table public.route_stops enable row level security;
alter table public.bookings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.i18n_strings enable row level security;
alter table public.media enable row level security;
alter table public.settings enable row level security;

-- Admin (authenticated + in admins table) — full access on everything
do $$
declare t text;
begin
  for t in select unnest(array[
    'admins','guides','routes','routes_i18n','route_stops',
    'bookings','conversations','messages','i18n_strings','media','settings'
  ])
  loop
    execute format(
      'drop policy if exists admin_all on public.%1$I;
       create policy admin_all on public.%1$I
       for all to authenticated
       using (public.is_admin()) with check (public.is_admin());',
      t
    );
  end loop;
end $$;

-- Public read for mobile app surface
drop policy if exists public_read_published_routes on public.routes;
create policy public_read_published_routes on public.routes
  for select to anon, authenticated using (published = true);

drop policy if exists public_read_routes_i18n on public.routes_i18n;
create policy public_read_routes_i18n on public.routes_i18n
  for select to anon, authenticated using (
    exists (select 1 from public.routes r where r.id = route_id and r.published)
  );

drop policy if exists public_read_route_stops on public.route_stops;
create policy public_read_route_stops on public.route_stops
  for select to anon, authenticated using (
    exists (select 1 from public.routes r where r.id = route_id and r.published)
  );

drop policy if exists public_read_active_guides on public.guides;
create policy public_read_active_guides on public.guides
  for select to anon, authenticated using (active = true);

drop policy if exists public_read_i18n_strings on public.i18n_strings;
create policy public_read_i18n_strings on public.i18n_strings
  for select to anon, authenticated using (true);

-- ============================================================
-- Storage: media bucket (public read for route/guide images)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies: admins can write, public can read
drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');
