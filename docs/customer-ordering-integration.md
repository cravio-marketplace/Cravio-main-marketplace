# Customer ordering integration

## What is connected

The customer checkout now submits orders to the existing vendor backend:

- `POST /api/customer/orders` creates a Cash on Pickup order.
- `GET /api/customer/orders` lists the signed-in customer's orders.
- `GET /api/customer/orders/:orderId` returns one order owned by that customer.
- The API authenticates Supabase access tokens and uses the backend-only service-role client.
- Vendor, menu item ownership, availability, current prices and stock quantities are checked on the server.
- A per-checkout UUID prevents duplicate orders when the same request is retried.
- New orders are inserted into the existing `public.orders` table with `status = pending`, so the vendor dashboard's existing order feed can see them.

## Required deployment configuration

### Customer Next.js app

Set this environment variable in local `.env.local` and the Vercel project:

```env
NEXT_PUBLIC_CRAVIO_API_URL=https://YOUR-DEPLOYED-VENDOR-API
```

Use the backend's public HTTPS origin only. Do not put Supabase service-role credentials in the customer app.

### Vendor Express backend

For local development, create `backend/.env` from `backend/.env.example` and set:

```env
PORT=5000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
FRONTEND_URL=http://localhost:3000
```

Start the backend from its `backend` directory with `npm install` followed by `npm run dev`. Keep the service-role key only in this backend `.env`; never put it in the customer app. For production, set `FRONTEND_URL` to the real customer site origin and deploy the backend.

The service-role key must remain server-side. If the customer app has both production and preview domains, include the exact allowed origins as a comma-separated `FRONTEND_URL` value.

Deploy the vendor backend after pulling the latest changes. The new route is mounted at `/api/customer/orders`.

## Database migration

Apply `supabase/migrations/20261109000000_customer_order_idempotency.sql` to the same Supabase project used by both apps. It adds `client_order_id` and a unique customer/request index. The earlier customer-order foundation migration must already have been applied.

## Important inventory behaviour

The current vendor app decrements inventory when an order is marked completed. The customer API checks current availability and stock before inserting an order, but it does not reserve stock at checkout. Two customers ordering the last unit at nearly the same time could therefore both pass the pre-check. Before a high-volume launch, move stock reservation into a single atomic database transaction and update the vendor completion/rejection flow so stock is neither double-decremented nor stranded.

## Current payment scope

Only Cash on Pickup is accepted by the customer API. Flutterwave is intentionally rejected until payment initialization, webhook verification, payment reconciliation and refund handling are implemented.
