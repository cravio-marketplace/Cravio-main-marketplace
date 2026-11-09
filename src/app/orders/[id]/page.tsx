import { Suspense } from "react";
import OrderDetailsClient from "./order-details-client";

export default function OrderDetailsPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#fffdfb] p-8 text-center text-sm text-[#8d837b]">Loading order details…</main>}><OrderDetailsClient /></Suspense>;
}
