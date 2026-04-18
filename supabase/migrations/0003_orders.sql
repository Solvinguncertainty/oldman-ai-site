-- ============================================================
-- Orders — records of Stripe Checkout completions
-- Run this in Supabase SQL Editor after 0002.
-- ============================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  stripe_payment_intent text,
  status text not null default 'pending' check (status in ('pending','paid','fulfilled','refunded','canceled','failed')),
  customer_email text,
  customer_name text,
  shipping_name text,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text,
  subtotal_cents integer,
  shipping_cents integer,
  tax_cents integer,
  total_cents integer,
  currency text default 'CAD',
  fulfilled_at timestamptz,
  notes text,
  raw_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_snapshot jsonb not null default '{}'::jsonb,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null,
  line_total_cents integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Only authenticated (admin) can read/write orders
drop policy if exists orders_admin_all on public.orders;
create policy orders_admin_all
  on public.orders for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists order_items_admin_all on public.order_items;
create policy order_items_admin_all
  on public.order_items for all
  to authenticated
  using (true)
  with check (true);

select 'Orders tables ready' as status;
