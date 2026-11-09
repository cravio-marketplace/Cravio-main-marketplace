# Cravio Customer Marketplace — Launch Readiness

## Current implementation (code exists; verification still required)
- Next.js customer application foundation and shared layout/design tokens.
- Homepage, Explore, vendor storefront routes, and responsive marketplace UI.
- Local cart state, single-vendor cart rule, quantity controls, cart and checkout preview.
- Customer auth routes: login, signup, forgot password, reset password, auth callback, profile/settings, logout.
- Supabase browser/server clients and Next.js proxy/session refresh.
- Customer favourites schema and UI integration (requires migration and end-to-end verification).
- Homepage/Explore/vendor storefront catalog reads from shared vendor Supabase tables (requires catalog migration/data verification).
- Customer orders schema extension migration; this is schema groundwork only, not order placement.
- Order history/detail screens exist as placeholders.

## P0 — Must complete before internal testing
- [ ] Pull/sync local `main`; reconcile stashed local auth work without overwriting newer files.
- [ ] Confirm environment variables in local and Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [ ] Configure Supabase Auth site URL, redirect URLs, email verification and password-reset redirect.
- [ ] Apply migrations in order and verify policies against actual vendor schema.
- [ ] Run production build; fix TypeScript, lint and runtime errors.
- [ ] Test signup, email verification, login, logout, forgot/reset password.
- [ ] Test guest browsing and customer-only protected routes.
- [ ] Test catalog with approved vendors, unavailable items, empty/loading/error states.
- [ ] Test favourites save/remove/persistence and account isolation.
- [ ] Validate responsive layouts and accessibility (keyboard, labels, focus, contrast).

## P1 — Ordering MVP (before campus pilot)
- [ ] Confirm canonical vendor `orders` and order-item JSON/columns, vendor status transitions, pickup code generation and stock rules.
- [ ] Store cart item IDs/variant IDs; treat browser prices as display-only.
- [ ] Implement secure server-side order action/RPC: authenticate customer, validate one vendor, fetch current menu/variant prices, verify vendor/item availability and stock, calculate totals server-side, prevent duplicate submission, create order compatible with vendor dashboard.
- [ ] Implement Cash on Pickup end-to-end and payment status semantics.
- [ ] Connect customer order history/detail to real orders and realtime/polling status.
- [ ] Confirm vendor dashboard receives and processes customer orders; test accept/reject/ready/completed and pickup code.
- [ ] Add cancellation rules, failed-order handling and inventory rollback/atomicity.
- [ ] Add Flutterwave server-side payment initialization, webhook signature verification, idempotency and reconciliation (only after COD is stable).

## P2 — Operational readiness
- [ ] Campus onboarding/selection and campus-scoped catalog filtering.
- [ ] Customer profile completion and phone handling.
- [ ] Notifications (in-app/email) for order state changes.
- [ ] Vendor opening hours and out-of-stock behavior verified.
- [ ] Admin/support process for vendor verification, refunds, disputes and incidents (can be manual for pilot).
- [ ] Privacy policy, terms, refund/cancellation and vendor/customer support contact.
- [ ] Analytics/error monitoring, logs without sensitive data, backups and recovery plan.
- [ ] Vercel production environment and domain/HTTPS/redirect configuration.

## Testing gates
### Internal QA
- [ ] Unit/integration checks for validation, pricing and order state transitions.
- [ ] Build and smoke test all routes.
- [ ] Security review of RLS, server actions, secrets and payment webhooks.
- [ ] Test multiple accounts and vendor/customer role boundaries.

### MIU pilot / UAT
- [ ] Test with a small group of students and at least 2–3 vendors.
- [ ] Verify real menu accuracy, pickup instructions, vendor acceptance and handoff.
- [ ] Record issues, severity, owner and fix; retest critical/high issues.
- [ ] Agree pilot support hours, vendor training and rollback/stop criteria.

### Go-live checklist
- [ ] Critical/high bugs closed; no known data-loss or payment correctness issue.
- [ ] Production migrations backed up and reviewed.
- [ ] Live auth/email, catalog, ordering and vendor dashboard tested in production.
- [ ] Payment mode explicitly chosen (Cash on Pickup first; Flutterwave only when verified).
- [ ] Vendors trained, support contact published, monitoring active.
- [ ] Soft launch, monitor orders daily, then expand cohort gradually.

## Status definitions
- **Implemented** means code/schema has been added; it does not mean tested or deployed.
- **Verified** means tested against the actual Supabase project and vendor dashboard.
- **Pilot-ready** means all P0 and P1 gates pass, operational owners are assigned, and UAT has no unresolved critical/high defects.
- **Live** means production deployment and soft launch have passed the go-live checklist.
