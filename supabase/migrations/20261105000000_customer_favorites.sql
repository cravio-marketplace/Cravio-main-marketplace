-- Customer favourites are stored independently from vendor-owned menu records.
-- Each row is owned by the authenticated customer and stores a display snapshot.
create table if not exists public.customer_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null,
  item_type text not null check (item_type in ('meal', 'vendor')),
  name text not null,
  vendor_name text,
  vendor_slug text,
  price integer check (price is null or price >= 0),
  image_url text,
  created_at timestamptz not null default now(),
  constraint customer_favorites_user_item_unique unique (user_id, item_key)
);

create index if not exists customer_favorites_user_created_idx
  on public.customer_favorites (user_id, created_at desc);

alter table public.customer_favorites enable row level security;

drop policy if exists "Customers read own favourites" on public.customer_favorites;
create policy "Customers read own favourites"
  on public.customer_favorites for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Customers save own favourites" on public.customer_favorites;
create policy "Customers save own favourites"
  on public.customer_favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Customers remove own favourites" on public.customer_favorites;
create policy "Customers remove own favourites"
  on public.customer_favorites for delete
  to authenticated
  using (auth.uid() = user_id);
