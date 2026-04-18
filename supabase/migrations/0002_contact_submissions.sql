-- ============================================================
-- Contact form submissions
-- Run this in Supabase SQL Editor after 0001.
-- ============================================================

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  email text not null,
  interest text,
  message text,
  source text default 'homepage',
  ip_hash text,
  user_agent text,
  read_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_submissions_created on public.contact_submissions(created_at desc);
create index if not exists idx_contact_submissions_unread on public.contact_submissions(read_at) where read_at is null;

alter table public.contact_submissions enable row level security;

-- Anonymous visitors CAN insert (so the form works) but cannot read.
drop policy if exists contact_submissions_insert_public on public.contact_submissions;
create policy contact_submissions_insert_public
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

-- Only authenticated (admin) can read and update.
drop policy if exists contact_submissions_read_admin on public.contact_submissions;
create policy contact_submissions_read_admin
  on public.contact_submissions for select
  to authenticated
  using (true);

drop policy if exists contact_submissions_update_admin on public.contact_submissions;
create policy contact_submissions_update_admin
  on public.contact_submissions for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists contact_submissions_delete_admin on public.contact_submissions;
create policy contact_submissions_delete_admin
  on public.contact_submissions for delete
  to authenticated
  using (true);

select 'Contact submissions table ready' as status;
