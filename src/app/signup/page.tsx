"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Utensils, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router=useRouter();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState(""); const [password,setPassword]=useState(""); const [show,setShow]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [sent,setSent]=useState(false);

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const supabase=createClient();
      const {data,error}=await supabase.auth.signUp({
        email:email.trim(),password,
        options:{emailRedirectTo:`${window.location.origin}/auth/callback?next=/`,data:{full_name:name.trim(),phone:phone.trim()}}
      });
      if(error) throw error;
      if(data.session){router.replace("/");router.refresh();}
      else setSent(true);
    } catch(err){setError(err instanceof Error?err.message:"Unable to create your account.");}
    finally{setBusy(false);}
  }

  if(sent)return <main className="grid min-h-screen place-items-center bg-[#fff8f3] px-5"><section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e9f8e6] text-[#3c8a45]"><CheckCircle2 size={27}/></span><h1 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">Check your inbox</h1><p className="mt-3 text-sm leading-6 text-[#817971]">We sent a verification link to <strong>{email}</strong>. Verify your email to finish creating your Cravio account.</p><Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#ff6b00] px-5 py-3 text-sm font-bold text-white">Go to sign in</Link></section></main>;

  return <main className="min-h-screen bg-[#fff8f3] px-5 py-10 text-[#1f1f1f]"><div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_#572b1110] md:grid-cols-2">
    <section className="hidden flex-col justify-between bg-[#ff6b00] p-10 text-white md:flex"><Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-2px]">cravio.</Link><div><Utensils size={30}/><h1 className="mt-6 font-[family-name:var(--font-space-grotesk)] text-5xl font-bold leading-[1.05] tracking-[-2px]">Good food. Better breaks.</h1><p className="mt-4 max-w-xs text-sm leading-6 text-white/80">Discover campus vendors, order ahead, and make every break count.</p></div><p className="text-xs text-white/70">Campus food, without the fuss.</p></section>
    <section className="flex items-center px-6 py-10 sm:px-12"><div className="mx-auto w-full max-w-sm"><Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-2px] md:hidden">cravio<span className="text-[#ff6b00]">.</span></Link><p className="mt-7 text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">JOIN THE CAMPUS TABLE</p><h2 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-1.5px]">Create your account</h2><p className="mt-2 text-sm text-[#8d837b]">A better way to find and order your campus favourites.</p>
      <form onSubmit={submit} className="mt-6 space-y-3.5">
        <label className="block text-xs font-bold">Full name<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Your full name" className="mt-1.5 h-11 w-full rounded-xl border border-[#eae4de] px-4 text-sm font-normal outline-none focus:border-[#ff6b00]"/></label>
        <label className="block text-xs font-bold">Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="mt-1.5 h-11 w-full rounded-xl border border-[#eae4de] px-4 text-sm font-normal outline-none focus:border-[#ff6b00]"/></label>
        <label className="block text-xs font-bold">Phone number<input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" placeholder="080 1234 5678" className="mt-1.5 h-11 w-full rounded-xl border border-[#eae4de] px-4 text-sm font-normal outline-none focus:border-[#ff6b00]"/></label>
        <label className="block text-xs font-bold">Password<span className="relative mt-1.5 block"><input required minLength={8} type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" className="h-11 w-full rounded-xl border border-[#eae4de] px-4 pr-12 text-sm font-normal outline-none focus:border-[#ff6b00]"/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Hide password":"Show password"} className="absolute right-3 top-3 text-[#8d837b]">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
        {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        <button disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ff6b00] text-sm font-bold text-white transition hover:bg-[#e85f00] disabled:opacity-60">{busy?"Creating account...":"Create account"} <ArrowRight size={16}/></button>
      </form>
      <p className="mt-5 text-center text-sm text-[#817971]">Already have an account? <Link href="/login" className="font-bold text-[#ff6b00]">Sign in</Link></p>
      <p className="mt-6 text-center text-[10px] leading-5 text-[#aaa19a]">By creating an account, you agree to Cravio’s terms and privacy policy.</p>
    </div></section>
  </div></main>;
}
