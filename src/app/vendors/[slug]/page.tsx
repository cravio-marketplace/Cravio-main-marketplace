import { Suspense } from "react";
import VendorStorefrontClient from "./vendor-storefront-client";

export default function VendorStorefrontPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center text-sm text-[#8b8179]">Loading vendor storefront…</main>}>
      <VendorStorefrontClient />
    </Suspense>
  );
}
