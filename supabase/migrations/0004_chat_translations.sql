-- Chat auto-translation: per-message source language + cached translations.
-- Apply in Supabase SQL editor.

alter table public.messages
  add column if not exists source_lang text,
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- Optional: lightweight index on source_lang (not strictly needed yet).
create index if not exists messages_source_lang_idx on public.messages(source_lang);
