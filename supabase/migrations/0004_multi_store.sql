-- ============================================================
-- Multi-store: tag products + orders by which store they belong to.
-- Run this in Supabase SQL Editor on project apgfonbjqwtynbqxmmaq
-- after 0003.
-- ============================================================

-- Products: add store_slug with a default so existing rows populate.
alter table public.products
  add column if not exists store_slug text not null default 'the-craft';

-- Drop any older version of the check constraint before recreating
alter table public.products
  drop constraint if exists products_store_slug_check;

alter table public.products
  add constraint products_store_slug_check
  check (store_slug in ('the-craft', 'joy-inc'));

create index if not exists idx_products_store on public.products(store_slug);

-- Allow the same slug in different stores (one product per store)
alter table public.products
  drop constraint if exists products_slug_key;

alter table public.products
  drop constraint if exists products_store_slug_slug_key;

alter table public.products
  add constraint products_store_slug_slug_key unique (store_slug, slug);

-- Orders: tag every order with which store it came from.
alter table public.orders
  add column if not exists store_slug text not null default 'the-craft';

alter table public.orders
  drop constraint if exists orders_store_slug_check;

alter table public.orders
  add constraint orders_store_slug_check
  check (store_slug in ('the-craft', 'joy-inc'));

create index if not exists idx_orders_store on public.orders(store_slug);

select 'Multi-store schema ready' as status;
