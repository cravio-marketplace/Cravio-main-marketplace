"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n/100);

export default function CheckoutPage(){
 const router=useRouter();
 const {items,vendorName,itemCount,subtotal,clearCart}=useCart();
 const [fullName,setFullName]=useState(""); const [phone,setPhone]=useState(""); const [pickupPoint,setPickupPoint]=useState(""); const [extraInfo,setExtraInfo]=useState(""); const [payment,setPayment]=useState("cash"); const [errors,setErrors]=useState<string[]>([]); const [submitting,setSubmitting]=useState(false); const [submitError,setSubmitError]=useState(""); const [requestId,setRequestId]=useState<string|null>(null); const [serviceFee,setServiceFee]=useState<number|null>(null); const [firstOrder,setFirstOrder]=useState(false); const [feeLoading,setFeeLoading]=useState(true);
 useEffect(()=>{
  let active=true;
  async function loadFeePreview(){
   setFeeLoading(true);
   try{
    const supabase=createClient();
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){if(active){setServiceFee(null);setFirstOrder(false);}return;}
    const apiBase=(process.env.NEXT_PUBLIC_CRAVIO_API_URL || "https://cravio-marketplace-jwlq.onrender.com").replace(/\/$/,"");
    const response=await fetch(`${apiBase}/api/customer/orders/fee-preview?subtotal_kobo=${encodeURIComponent(String(subtotal))}`,{headers:{Authorization:`Bearer ${session.access_token}`}});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(payload.error||"Unable to calculate the service fee.");
    if(active){setServiceFee(Number(payload.service_fee)||0);setFirstOrder(Boolean(payload.is_first_order));}
   }catch{
    if(active)setServiceFee(null);
   }finally{if(active)setFeeLoading(false);}
  }
  void loadFeePreview();
  return()=>{active=false;};
 },[subtotal]);
 const validate=()=>{
  const next:string[]=[];
  if(fullName.trim().length<2)next.push("Enter your full name.");
  if(!/^\+?[0-9\s-]{10,15}$/.test(phone.trim()))next.push("Enter a valid phone number.");
  if(pickupPoint.trim().length<3)next.push("Enter your campus pickup point.");
  setErrors(next); return next.length===0;
 };
 async function placeOrder(){
  if(!validate()||submitting)return;
  setSubmitError("");
  const vendorId=items[0]?.vendorId;
  if(!vendorId||items.some(item=>!item.menuItemId)){
   setSubmitError("This menu item is not connected to the live vendor catalogue yet. Please return to Explore and choose an available menu item.");
   return;
  }
  const apiBase=(process.env.NEXT_PUBLIC_CRAVIO_API_URL || "https://cravio-marketplace-jwlq.onrender.com").replace(/\/$/,"");
  setSubmitting(true);
  try{
   const orderRequestId=requestId||crypto.randomUUID();
   if(!requestId)setRequestId(orderRequestId);
   const supabase=createClient();
   const {data:{session},error:sessionError}=await supabase.auth.getSession();
   if(sessionError||!session){router.push("/login?redirect=/checkout");return;}
   const response=await fetch(`${apiBase}/api/customer/orders`,{
    method:"POST",
    headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},
    body:JSON.stringify({
     vendor_id:vendorId,
     items:items.map(item=>({menu_item_id:item.menuItemId,quantity:item.quantity,special_instructions:(item.specialInstructions||"").trim()})),
     student_name:fullName.trim(),
     student_phone:phone.trim(),
     pickup_point:pickupPoint.trim(),
     pickup_instructions:extraInfo.trim(),
     payment_method:payment,
     client_order_id:orderRequestId
    })
   });
   const payload=await response.json().catch(()=>({}));
   if(!response.ok)throw new Error(payload.error||"We couldn't place your order. Please try again.");
   const orderId=payload.order?.id;
   if(!orderId)throw new Error("The order was received but the server did not return an order reference. Contact support before retrying.");
   clearCart();
   router.replace(`/orders/${orderId}`);
  }catch(error){
   setSubmitError(error instanceof Error?error.message:"Something went wrong while placing your order.");
  }finally{setSubmitting(false);}
 }
 if(items.length===0)return <main className="min-h-screen bg-[#fffdfb] px-5 py-24 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6b00]"><ShoppingBag size={27}/></div><h1 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">Your cart is empty</h1><p className="mt-2 text-sm text-[#8d837b]">Add something delicious before checking out.</p><Link href="/explore" className="mt-6 inline-flex rounded-xl bg-[#ff6b00] px-5 py-3 text-xs font-bold text-white">Explore food</Link></main>;
 return <main className="min-h-screen bg-[#fffdfb] text-[#1f1f1f]">
  <header className="border-b border-[#eee9e5] bg-white"><div className="mx-auto flex h-[66px] max-w-[1080px] items-center justify-between px-5 md:px-8"><Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-[27px] font-bold tracking-[-1.7px]">cravio<span className="text-[#ff6b00]">.</span></Link><span className="flex items-center gap-1.5 text-[11px] font-bold text-[#827970]"><ShieldCheck size={15} className="text-[#43824b]"/> Secure checkout</span></div></header>
  <div className="mx-auto max-w-[1080px] px-5 pb-20 pt-8 md:px-8 md:pt-12"><Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-[#8b8179]"><ArrowLeft size={14}/> Back to cart</Link>
   <div className="mt-5"><p className="text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">ALMOST THERE</p><h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-[-2px]">Checkout<span className="text-[#ff6b00]">.</span></h1><p className="mt-2 text-sm text-[#898078]">Confirm your pickup details and how you’d like to pay.</p></div>
   <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]"><section className="space-y-5">
    <div className="rounded-2xl border border-[#eee9e5] bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff1e7] text-[#ff6b00]"><MapPin size={17}/></span><div><h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">Pickup details</h2><p className="text-[11px] text-[#938980]">Where should you meet the vendor?</p></div></div>
     <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-[#514941]">Full name<input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your name" autoComplete="name" className="mt-2 h-11 w-full rounded-xl border border-[#eae4de] bg-[#fffdfb] px-3 text-sm font-normal outline-none focus:border-[#ff9b5c]"/></label><label className="text-xs font-bold text-[#514941]">Phone number<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="080 1234 5678" autoComplete="tel" inputMode="tel" className="mt-2 h-11 w-full rounded-xl border border-[#eae4de] bg-[#fffdfb] px-3 text-sm font-normal outline-none focus:border-[#ff9b5c]"/></label></div>
     <label className="mt-4 block text-xs font-bold text-[#514941]">Campus pickup point<input value={pickupPoint} onChange={e=>setPickupPoint(e.target.value)} placeholder="e.g. Main cafeteria entrance" className="mt-2 h-11 w-full rounded-xl border border-[#eae4de] bg-[#fffdfb] px-3 text-sm font-normal outline-none focus:border-[#ff9b5b]"/></label>
     <label className="mt-4 block text-xs font-bold text-[#514941]">Extra directions <span className="font-normal text-[#9b9189]">(optional)</span><textarea value={extraInfo} onChange={e=>setExtraInfo(e.target.value)} placeholder="Add a landmark or instructions to help you meet the vendor..." rows={3} className="mt-2 w-full resize-y rounded-xl border border-[#eae4de] bg-[#fffdfb] px-3 py-3 text-sm font-normal outline-none focus:border-[#ff9b5c]"/></label>
    </div>
    <div className="rounded-2xl border border-[#eee9e5] bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff1e7] text-[#ff6b00]"><CheckCircle2 size={17}/></span><div><h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">Payment method</h2><p className="text-[11px] text-[#938980]">Choose how you want to pay.</p></div></div>
     <div className="mt-5 space-y-3"><label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${payment==="cash"?"border-[#ff6b00] bg-[#fff8f2]":"border-[#eee9e5]"}`}><input type="radio" name="payment" value="cash" checked={payment==="cash"} onChange={()=>setPayment("cash")} className="mt-1 accent-[#ff6b00]"/><span className="flex-1"><strong className="block text-sm">Cash on Pickup</strong><span className="mt-1 block text-xs text-[#8e847b]">Pay the vendor when you collect your order.</span></span><span className="rounded-md bg-[#e9f7e7] px-2 py-1 text-[9px] font-bold text-[#397b40]">Available at launch</span></label>
      <label className="flex cursor-not-allowed items-start gap-3 rounded-xl border border-[#eee9e5] p-4 opacity-60"><input type="radio" name="payment" disabled className="mt-1"/><span className="flex-1"><strong className="block text-sm">Pay online with Flutterwave</strong><span className="mt-1 block text-xs text-[#8e847b]">Card, bank transfer and other supported methods.</span></span><span className="rounded-md bg-[#f1eeeb] px-2 py-1 text-[9px] font-bold text-[#827970]">Coming soon</span></label>
     </div>
    </div>
    {errors.length>0&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">{errors.map(e=><p key={e}>{e}</p>)}</div>}
    {submitError&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700">{submitError}</div>}
    <button onClick={placeOrder} disabled={submitting} className="w-full rounded-xl bg-[#ff6b00] px-5 py-4 text-sm font-extrabold text-white shadow-[0_8px_18px_#ff6b0030] transition hover:bg-[#e85f00] disabled:cursor-wait disabled:opacity-60">{submitting?"Placing your order…":"Place order"}</button>
   </section>
   <aside className="h-fit rounded-2xl border border-[#eee9e5] bg-white p-5 lg:sticky lg:top-6"><h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">Order summary</h2><p className="mt-1 text-xs text-[#92877e]">{vendorName} · Pickup</p><div className="mt-5 space-y-3">{items.map(item=><div key={item.id} className="flex justify-between gap-3 text-xs"><span className="min-w-0 text-[#726960]">{item.quantity} × {item.name}</span><strong className="shrink-0">{money(item.price*item.quantity)}</strong>{item.specialInstructions?.trim()&&<p className="mt-1 w-full text-[10px] leading-4 text-[#8d837b]">Prep: {item.specialInstructions}</p>}</div>)}</div><div className="my-5 border-t border-dashed border-[#e8e0d9]"/><div className="flex justify-between text-xs text-[#817971]"><span>Items ({itemCount})</span><strong className="text-[#1f1f1f]">{money(subtotal)}</strong></div><div className="mt-3 flex justify-between text-xs text-[#817971]"><span>Service fee{firstOrder&&serviceFee===0?" · first order waived":""}</span><strong className={serviceFee===0?"text-[#397b40]":"text-[#1f1f1f]"}>{feeLoading?"Calculating…":serviceFee===null?"Sign in to calculate":serviceFee===0?"Free":money(serviceFee)}</strong></div><div className="my-5 border-t border-[#eee9e5]"/><div className="flex justify-between"><strong className="text-sm">Total</strong><strong className="text-xl">{serviceFee===null?money(subtotal):money(subtotal+serviceFee)}</strong></div><div className="mt-5 flex items-start gap-2 rounded-xl bg-[#f7f5f2] p-3 text-[10px] leading-5 text-[#837970]"><Clock3 size={14} className="mt-0.5 shrink-0"/> Your preparation notes will be sent to the vendor with each food item.</div></aside>
   </div>
  </div><footer className="border-t border-[#eee9e5] py-7 text-center text-[11px] text-[#a19891]">© 2026 Cravio · Campus food, without the fuss.</footer>
 </main>;
}