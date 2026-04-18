-- Bootstrap the first admin.
-- This must match the email you'll log in with via magic link.
-- Add more admins later from the console or by inserting rows here.

insert into public.admins (email, name)
values ('ausbro80@gmail.com', 'Ausbro')
on conflict (email) do nothing;
