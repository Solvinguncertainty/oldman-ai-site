-- ============================================================
-- The Craft — products schema + storage + RLS
-- Run this in Supabase SQL Editor on project apgfonbjqwtynbqxmmaq
-- ============================================================

-- Helper: updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------- Products ----------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'CAD' check (currency in ('CAD', 'USD')),
  inventory_count integer not null default 0 check (inventory_count >= 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  materials text,
  dimensions text,
  weight_grams integer,
  lead_time_days integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_slug on public.products(slug);

-- ---------------- Product Images ----------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  position integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on public.product_images(product_id);

-- ---------------- RLS ----------------
alter table public.products enable row level security;
alter table public.product_images enable row level security;

-- Public can read active products
drop policy if exists products_public_read on public.products;
create policy products_public_read
  on public.products for select
  to anon, authenticated
  using (status = 'active');

-- Authenticated (admin) can do everything — since signups are disabled,
-- any authenticated user is the admin.
drop policy if exists products_admin_all on public.products;
create policy products_admin_all
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- Product images follow product visibility
drop policy if exists product_images_public_read on public.product_images;
create policy product_images_public_read
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.status = 'active'
    )
  );

drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all
  on public.product_images for all
  to authenticated
  using (true)
  with check (true);

-- ---------------- Storage bucket ----------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS
drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- Done.
select 'The Craft schema ready' as status;
