"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, ClipboardList, Clock3, PackageCheck, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Order = { id:number; vendor_id:string; student_name:string; items:Array<{name:string;quantity:number;price:number}>; total_price:number; status:string; payment_status:string; created_at:string };
const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n);
const label=(s:string)=>s.replace(/_/g," ").replace(/\b\w/g,m=>m.toUpperCase());

export default function OrdersPage() {
 const [orders,setOrders]=useState<Order[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 useEffect(()=>{
  let active=true;
  async function load(){
   try{
    const api=process.env.NEXT_PUBLIC_CRAVIO_API_URL?.replace(/\/$/,"");
    if(!api)throw new Error("Order history is not configured. The customer API URL is missing.");
    const supabase=createClient();
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){window.location.assign("/login?redirect=/orders");return;}
    const response=await fetch(`${api}/api/customer/orders`,{headers:{Authorization:`Bearer ${session.access_token}`}});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(payload.error||"Unable to load your orders.");
    if(active)setOrders(payload.orders||[]);
   }catch(e){if(active)setError(e instanceof Error?e.message:"Unable to load your orders.");}
   finally{if(active)setLoading(false);}
  }
  void load();return()=>{active=false;};
 },[]);
 const activeCount=useMemo(()=>orders.filter(o=>["pending","accepted","ready"].includes(o.status)).length,[orders]);
 const completedCount=useMemo(()=>orders.filter(o=>o.status==="completed").length,[orders]);
 return <main className="min-h-screen bg-[#fffdfb] text-[#1f1f1f]">
  <header className="border-b border-[#eee9e5] bg-white"><div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5 md:px-8"><Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-[27px] font-bold tracking-[-1.7px]">cravio<span className="text-[#ff6b00]">.</span></Link><Link href="/profile" className="text-xs font-bold text-[#766d65] hover:text-[#ff6b00]">My account</Link></div></header>
  <div className="mx-auto max-w-[1050px] px-5 pb-20 pt-9 md:px-8 md:pt-14">
   <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-bold text-[#8b8179]"><ArrowLeft size={14}/> Back to profile</Link>
   <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">YOUR CRAVIO ACTIVITY</p><h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-[-2px]">Your orders<span className="text-[#ff6b00]">.</span></h1><p className="mt-2 text-sm text-[#898078]">Track your campus cravings, from checkout to pickup.</p></div><Link href="/explore" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b00] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#e85f00]">Explore food <ArrowUpRight size={14}/></Link></div>
   <div className="mt-8 grid gap-3 sm:grid-cols-3">
    {[{label:"All orders",icon:ClipboardList,value:String(orders.length)},{label:"In progress",icon:Clock3,value:String(activeCount)},{label:"Completed",icon:PackageCheck,value:String(completedCount)}].map(item=><div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#eee9e5] bg-white p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1e7] text-[#ff6b00]"><item.icon size={18}/></span><div><p className="text-[11px] text-[#91877f]">{item.label}</p><p className="mt-0.5 text-lg font-bold">{item.value}</p></div></div>)}
   </div>
   {error&&<div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
   {loading?<div className="mt-6 rounded-2xl border border-[#eee9e5] bg-white p-12 text-center text-sm text-[#8d837b]">Loading your orders…</div>:orders.length===0&&!error?<section className="mt-6 rounded-3xl border border-[#eee9e5] bg-white px-5 py-16 text-center sm:py-20"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6b00]"><ShoppingBag size={27}/></div><h2 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">No orders yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8d837b]">Your placed orders and pickup updates will appear here.</p><Link href="/explore" className="mt-6 inline-flex rounded-xl bg-[#ff6b00] px-5 py-3 text-xs font-bold text-white">Find your next meal</Link></section>:<div className="mt-6 space-y-3">{orders.map(order=><Link key={order.id} href={`/orders/${order.id}`} className="block rounded-2xl border border-[#eee9e5] bg-white p-5 transition hover:border-[#ffc49b]"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold tracking-wider text-[#a58b78]">ORDER #{order.id}</p><p className="mt-1 text-sm font-bold">{order.items?.map(x=>`${x.quantity} × ${x.name}`).join(", ")||"Campus order"}</p></div><span className="rounded-full bg-[#fff1e7] px-3 py-1.5 text-[10px] font-bold text-[#a45117]">{label(order.status)}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0ebe6] pt-3 text-xs text-[#8d837b]"><span>{new Date(order.created_at).toLocaleString("en-NG",{dateStyle:"medium",timeStyle:"short"})}</span><strong className="text-sm text-[#1f1f1f]">{money(order.total_price)}</strong></div></Link>)}</div>}
  </div><footer className="border-t border-[#eee9e5] py-7 text-center text-[11px] text-[#a19891]">© 2026 Cravio · Campus food, without the fuss.</footer>
 </main>;
}
