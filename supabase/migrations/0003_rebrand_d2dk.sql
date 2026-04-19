-- Rebrand: Seoul Crafted → Day to Day Korea (D2DK)
-- Apply this in the Supabase SQL editor after pulling the rebrand commit.

-- Update the singleton settings row (no-op if brand_name was already changed).
update public.settings
  set brand_name = 'Day to Day Korea',
      tagline = coalesce(tagline, 'Live Seoul like a local, one day at a time.')
  where id = 1 and brand_name = 'Seoul Crafted';

-- Change the column default so future rows pick up the new name.
alter table public.settings
  alter column brand_name set default 'Day to Day Korea';
