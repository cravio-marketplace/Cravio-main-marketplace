"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ClipboardList, Headphones, PackageCheck } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#1f1f1f]">
      <header className="border-b border-[#eee9e5] bg-white"><div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5 md:px-8"><Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-[27px] font-bold tracking-[-1.7px]">cravio<span className="text-[#ff6b00]">.</span></Link><span className="text-xs font-semibold text-[#8d837b]">Order details</span></div></header>
      <div className="mx-auto max-w-[760px] px-5 pb-20 pt-9 md:px-8 md:pt-14"><Link href="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-[#8b8179]"><ArrowLeft size={14}/> Back to orders</Link>
        <section className="mt-8 rounded-3xl border border-[#eee9e5] bg-white px-5 py-14 text-center sm:px-10"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6b00]"><PackageCheck size={27}/></div><p className="mt-5 text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">ORDER TRACKING</p><h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-[-1px]">We can’t load this order yet</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8d837b]">Order <span className="font-semibold text-[#514941]">{id}</span> cannot be looked up until Cravio’s order database and customer authentication are connected. We have not created or assumed an order for you.</p><div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-xl bg-[#f8f5f2] p-4 text-left"><ClipboardList size={17} className="mt-0.5 shrink-0 text-[#ff6b00]"/><p className="text-xs leading-5 text-[#756b63]">When the backend is connected, this page will show vendor acceptance, preparation progress, pickup instructions, payment status and order items.</p></div><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/orders" className="rounded-xl border border-[#eae4de] px-5 py-3 text-xs font-bold text-[#514941] hover:bg-[#faf7f4]">View all orders</Link><Link href="/explore" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b00] px-5 py-3 text-xs font-bold text-white hover:bg-[#e85f00]">Explore food</Link></div></section><div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#9a9189]"><Headphones size={14}/> Need help? Customer support will be available here.</div></div>
      <footer className="border-t border-[#eee9e5] py-7 text-center text-[11px] text-[#a19891]">© 2026 Cravio · Campus food, without the fuss.</footer>
    </main>
  );
}
