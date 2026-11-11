"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Store, Utensils, Trash2 } from "lucide-react";
import { useFavorites } from "@/components/favorites-provider";

const money = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount/100);

export default function FavoritesPage() {
  const { items, loading, userId, error, removeFavorite } = useFavorites();

  return (
    <main className="min-h-screen bg-[#fffdfb] px-5 py-9 text-[#1f1f1f] md:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#8b8179]"><ArrowLeft size={14}/> Back to Cravio</Link>
        <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">YOUR PERSONAL SHORTLIST</p>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-[-2px]">Favourites<span className="text-[#ff6b00]">.</span></h1>
            <p className="mt-2 text-sm text-[#8d837b]">The meals and campus spots you want to come back to.</p>
          </div>
          <Link href="/explore" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#ff6b00] px-4 py-3 text-xs font-bold text-white">Explore campus food <Utensils size={15}/></Link>
        </div>

        {!userId && !loading && (
          <section className="mt-8 rounded-3xl border border-[#eee9e5] bg-white px-5 py-16 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6b00]"><Heart size={27}/></span>
            <h2 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">Keep your favourites close</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8d837b]">Sign in to save campus vendors and meals, then find them here whenever you need them.</p>
            <div className="mt-6 flex justify-center gap-3"><Link href="/login?redirectTo=%2Ffavorites" className="rounded-xl bg-[#ff6b00] px-5 py-3 text-xs font-bold text-white">Sign in</Link><Link href="/signup" className="rounded-xl border border-[#eae4de] px-5 py-3 text-xs font-bold">Create account</Link></div>
          </section>
        )}

        {loading && <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3"><div className="h-56 animate-pulse rounded-2xl bg-[#f3efeb]"/><div className="h-56 animate-pulse rounded-2xl bg-[#f3efeb]"/></div>}

        {userId && !loading && error && <div role="alert" className="mt-7 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">Could not load favourites: {error}. Make sure the favourites database setup has been applied in Supabase.</div>}

        {userId && !loading && !error && items.length === 0 && (
          <section className="mt-8 rounded-3xl border border-[#eee9e5] bg-white px-5 py-16 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6b00]"><Heart size={27}/></span>
            <h2 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">Your shortlist is waiting</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8d837b]">Tap the heart on any meal or vendor to save it here.</p>
            <Link href="/explore" className="mt-6 inline-flex rounded-xl bg-[#ff6b00] px-5 py-3 text-xs font-bold text-white">Explore meals and vendors</Link>
          </section>
        )}

        {userId && !loading && !error && items.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between"><p className="text-xs font-semibold text-[#8d837b]">{items.length} saved {items.length === 1 ? "item" : "items"}</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-[#eee9e5] bg-white">
                  <Link href={item.item_type === "vendor" ? `/vendors/${item.vendor_slug}` : `/vendors/${item.vendor_slug}`} className="block">
                    <div className="relative h-32 bg-[#f3efeb] bg-cover bg-center sm:h-40" style={item.image_url ? { backgroundImage: `url("${item.image_url}")` } : undefined}>
                      {!item.image_url && <div className="grid h-full place-items-center text-[#c1b6ad]">{item.item_type === "vendor" ? <Store size={28}/> : <Utensils size={28}/>}</div>}
                      <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-[#655a51]">{item.item_type === "vendor" ? "Vendor" : "Meal"}</span>
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="text-[10px] font-semibold text-[#a18a79]">{item.item_type === "vendor" ? "Campus vendor" : item.vendor_name}</p>
                    <h2 className="mt-1 min-h-10 text-sm font-bold leading-5">{item.name}</h2>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      {item.price !== null ? <strong className="text-xs">{money(item.price)}</strong> : <span className="text-[10px] text-[#9a918a]">View storefront</span>}
                      <button onClick={() => void removeFavorite(item.item_key)} aria-label={`Remove ${item.name} from favourites`} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#fff1e7] text-[#e45b42] transition hover:bg-[#ffe4d7]"><Trash2 size={15}/></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
