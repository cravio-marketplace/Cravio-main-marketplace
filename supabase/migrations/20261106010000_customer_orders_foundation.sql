-- Cravio customer order foundation.
-- Orders are created only through a trusted server-side endpoint/RPC after price and stock validation.
-- Vendor portal continues to update the existing order lifecycle.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id),
  customer_id uuid not null references auth.users(id) on delete restrict,
  student_name text not null,
  student_phone text not null,
  pickup_point text not null,
  pickup_instructions text,
  payment_method text not null check (payment_method in ('cash','flutterwave')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed','refunded')),
  status text not null default 'pending' check (status in ('pending','accepted','ready','completed','cancelled')),
  items jsonb not null check (jsonb_typeof(items)='array' and jsonb_array_length(items)>0),
  total_price integer not null check (total_price>=0),
  pickup_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_customer_created_idx on public.orders(customer_id,created_at desc);
create index if not exists orders_vendor_created_idx on public.orders(vendor_id,created_at desc);
alter table public.orders enable row level security;
drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders" on public.orders for select to authenticated using (auth.uid()=customer_id);
-- Intentionally no customer INSERT/UPDATE policy. Orders must be created by trusted server-side logic.
