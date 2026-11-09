"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Order={id:number;items:Array<{name:string;quantity:number;price:number}>;total_price:number;payment_method:string;payment_status:string;status:string;pickup_code:string|null;pickup_point:string;pickup_instructions:string|null;created_at:string};
const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n/100);
const label=(s:string)=>s.replace(/_/g," ").replace(/\b\w/g,m=>m.toUpperCase());
const stages=["pending","accepted","ready","completed"];

export default function OrderDetailsClient() {
 const {id}=useParams<{id:string}>();
 const [order,setOrder]=useState<Order|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 useEffect(()=>{
  let active=true;
  async function load(){
   try{
    const api=process.env.NEXT_PUBLIC_CRAVIO_API_URL?.replace(/\/$/,"");
    if(!api)throw new Error("Order tracking is not configured. The customer API URL is missing.");
    const supabase=createClient();
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){window.location.assign(`/login?redirect=/orders/${id}`);return;}
    const response=await fetch(`${api}/api/customer/orders/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${session.access_token}`}});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(payload.error||"Unable to load this order.");
    if(active)setOrder(payload.order||null);
   }catch(e){if(active)setError(e instanceof Error?e.message:"Unable to load this order.");}
   finally{if(active)setLoading(false);}
  }
  void load();return()=>{active=false;};
 },[id]);
 const stageIndex=order?stages.indexOf(order.status):-1;
 return <main className="min-h-screen bg-[#fffdfb] text-[#1f1f1f]">
  <header className="border-b border-[#eee9e5] bg-white"><div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5 md:px-8"><Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-[27px] font-bold tracking-[-1.7px]">cravio<span className="text-[#ff6b00]">.</span></Link><span className="text-xs font-semibold text-[#8d837b]">Order details</span></div></header>
  <div className="mx-auto max-w-[760px] px-5 pb-20 pt-9 md:px-8 md:pt-14"><Link href="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-[#8b8179]"><ArrowLeft size={14}/> Back to orders</Link>
   {loading?<div className="mt-8 rounded-3xl border border-[#eee9e5] bg-white p-12 text-center text-sm text-[#8d837b]">Loading order…</div>:error?<div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}<Link href="/orders" className="mt-4 block font-bold underline">Return to order history</Link></div>:!order?<div className="mt-8 rounded-3xl border border-[#eee9e5] bg-white p-12 text-center text-sm text-[#8d837b]">This order could not be found.</div>:<><section className="mt-8 rounded-3xl border border-[#eee9e5] bg-white p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">ORDER CONFIRMATION</p><h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">Order #{order.id}</h1><p className="mt-1 text-xs text-[#8d837b]">{new Date(order.created_at).toLocaleString("en-NG",{dateStyle:"medium",timeStyle:"short"})}</p></div><span className="rounded-full bg-[#fff1e7] px-3 py-2 text-[10px] font-extrabold text-[#a45117]">{label(order.status)}</span></div>
   {order.status==="rejected"?<div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">The vendor could not accept this order. Please contact the vendor for assistance.</div>:<div className="mt-7 grid grid-cols-4 gap-2">{stages.map((stage,index)=><div key={stage}><div className={`h-1.5 rounded-full ${stageIndex>=index?"bg-[#ff6b00]":"bg-[#eee9e5]"}`}/><p className={`mt-2 text-[9px] font-bold sm:text-[10px] ${stageIndex>=index?"text-[#a45117]":"text-[#a49a91]"}`}>{label(stage)}</p></div>)}</div>}
   {order.status==="ready"&&order.pickup_code&&<div className="mt-6 rounded-2xl border border-[#bfe1bd] bg-[#f0faef] p-5 text-center"><p className="text-[10px] font-extrabold tracking-wider text-[#397b40]">YOUR PICKUP CODE</p><p className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-[8px] text-[#245e2b]">{order.pickup_code}</p><p className="mt-2 text-xs text-[#547b57]">Show this code to the vendor when collecting your order.</p></div>}
  </section>
  <section className="mt-4 rounded-2xl border border-[#eee9e5] bg-white p-5"><h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">Items ordered</h2><div className="mt-4 space-y-3">{order.items?.map((item,index)=><div key={index} className="flex justify-between gap-3 text-sm"><span className="text-[#726960]">{item.quantity} × {item.name}</span><strong>{money(item.price*item.quantity)}</strong></div>)}</div><div className="my-4 border-t border-[#eee9e5]"/><div className="flex justify-between text-sm"><span className="text-[#817971]">Total</span><strong className="text-lg">{money(order.total_price)}</strong></div></section>
  <section className="mt-4 rounded-2xl border border-[#eee9e5] bg-white p-5"><h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">Pickup & payment</h2><div className="mt-4 flex gap-3"><MapPin size={17} className="mt-0.5 text-[#ff6b00]"/><div><p className="text-xs font-bold">Pickup point</p><p className="mt-1 text-sm text-[#756b63]">{order.pickup_point}</p>{order.pickup_instructions&&<p className="mt-1 text-xs text-[#8d837b]">{order.pickup_instructions}</p>}</div></div><div className="mt-4 flex gap-3"><ShieldCheck size={17} className="mt-0.5 text-[#ff6b00]"/><div><p className="text-xs font-bold">{label(order.payment_method)} · {label(order.payment_status)}</p><p className="mt-1 text-xs text-[#8d837b]">Pay the vendor when you collect your order.</p></div></div></section>
  </>}
   <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#9a9189]"><Clock3 size={14}/> Vendor status updates appear when you refresh this page.</div>
  </div><footer className="border-t border-[#eee9e5] py-7 text-center text-[11px] text-[#a19891]">© 2026 Cravio · Campus food, without the fuss.</footer>
 </main>;
}
