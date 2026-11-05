"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ClipboardList, Clock3, PackageCheck, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const hasOrders = false;

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#1f1f1f]">
      <header className="border-b border-[#eee9e5] bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-[27px] font-bold tracking-[-1.7px]">cravio<span className="text-[#ff6b00]">.</span></Link>
          <Link href="/profile" className="text-xs font-bold text-[#766d65] hover:text-[#ff6b00]">My account</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1050px] px-5 pb-20 pt-9 md:px-8 md:pt-14">
        <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-bold text-[#8b8179]"><ArrowLeft size={14}/> Back to profile</Link>
        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">YOUR CRAVIO ACTIVITY</p>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-[-2px]">Your orders<span className="text-[#ff6b00]">.</span></h1>
            <p className="mt-2 text-sm text-[#898078]">Keep track of your campus cravings, from checkout to pickup.</p>
          </div>
          <Link href="/explore" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b00] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#e85f00]">Explore food <ArrowUpRight size={14}/></Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "All orders", icon: ClipboardList, value: "—" },
            { label: "In progress", icon: Clock3, value: "—" },
            { label: "Completed", icon: PackageCheck, value: "—" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#eee9e5] bg-white p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1e7] text-[#ff6b00]"><item.icon size={18}/></span>
              <div><p className="text-[11px] text-[#91877f]">{item.label}</p><p className="mt-0.5 text-lg font-bold">{item.value}</p></div>
            </div>
          ))}
        </div>

        <section className="mt-6 rounded-3xl border border-[#eee9e5] bg-white px-5 py-16 text-center sm:py-20">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6b00]"><ShoppingBag size={27}/></div>
          <h2 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">Your order history will live here</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8d837b]">
            Once order placement is connected to your Cravio account, you’ll be able to see active orders, pickup updates and previous purchases here.
          </p>
          <Link href="/explore" className="mt-6 inline-flex rounded-xl bg-[#ff6b00] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#e85f00]">Find your next meal</Link>
        </section>
        <p className="mt-4 text-center text-[10px] leading-5 text-[#a19891]">Order history is not connected to Supabase yet. No sample orders are being shown as real purchases.</p>
      </div>
      <footer className="border-t border-[#eee9e5] py-7 text-center text-[11px] text-[#a19891]">© {new Date().getFullYear()} Cravio · Campus food, without the fuss.</footer>
    </main>
  );
}
