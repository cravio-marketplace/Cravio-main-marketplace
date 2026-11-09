-- Idempotency key for customer checkout retries.
-- The customer order API checks this key before insertion and this unique index
-- closes the race where the same checkout request is submitted concurrently.
alter table public.orders
  add column if not exists client_order_id uuid;

create unique index if not exists orders_customer_client_order_unique
  on public.orders(customer_id, client_order_id)
  where customer_id is not null and client_order_id is not null;
