-- Extend the existing vendor orders table; do not replace its established columns.
-- Vendor portal continues using student_name, items, total_price, payment_method,
-- status and pickup_code as before.
alter table public.orders
  add column if not exists customer_id uuid references auth.users(id) on delete set null,
  add column if not exists student_phone text,
  add column if not exists pickup_point text,
  add column if not exists pickup_instructions text,
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists updated_at timestamptz not null default now();

create index if not exists orders_customer_created_idx
  on public.orders(customer_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders"
  on public.orders for select to authenticated
  using (auth.uid() = customer_id);

-- No customer INSERT/UPDATE policy intentionally.
-- Trusted server-side order creation will validate customer, vendor, current prices,
-- availability and stock before writing. Vendor RLS remains in place.
