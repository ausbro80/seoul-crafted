-- Web Push subscriptions.
-- One row per (subscriber_email, endpoint). Endpoint is the push service
-- URL returned by the browser when subscribe() succeeds.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscriber_email text not null,
  role text not null check (role in ('customer', 'admin')),
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  unique (subscriber_email, endpoint)
);

create index if not exists push_subs_email_idx
  on public.push_subscriptions(subscriber_email);

alter table public.push_subscriptions enable row level security;

-- Admin (authenticated + in admins table) can read/write everything.
drop policy if exists admin_all on public.push_subscriptions;
create policy admin_all on public.push_subscriptions
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
