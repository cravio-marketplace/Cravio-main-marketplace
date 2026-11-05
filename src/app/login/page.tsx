"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Utensils } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [show,setShow]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  useEffect(() => { if (new URLSearchParams(window.location.search).get("error") === "auth_callback") setError("Your sign-in link could not be verified. Please try again."); }, []);

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const supabase=createClient();
      const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
      if(error) throw error;
      const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
      router.replace(redirectTo?.startsWith("/") ? redirectTo : "/profile"); router.refresh();
    } catch(err) { setError(err instanceof Error?err.message:"Unable to sign in. Please try again."); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-[#fff8f3] px-5 py-10 text-[#1f1f1f]">
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_#572b1110] md:grid-cols-2">
      <section className="hidden flex-col justify-between bg-[#ff6b00] p-10 text-white md:flex">
        <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-2px]">cravio.</Link>
        <div><Utensils size={30}/><h1 className="mt-6 font-[family-name:var(--font-space-grotesk)] text-5xl font-bold leading-[1.05] tracking-[-2px]">Your campus cravings, sorted.</h1><p className="mt-4 max-w-xs text-sm leading-6 text-white/80">Sign in and get back to the good stuff. Great food is closer than you think.</p></div>
        <p className="text-xs text-white/70">Campus food, without the fuss.</p>
      </section>
      <section className="flex items-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-2px] md:hidden">cravio<span className="text-[#ff6b00]">.</span></Link>
          <p className="mt-8 text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">WELCOME BACK</p>
          <h2 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-1.5px]">Sign in to Cravio</h2>
          <p className="mt-2 text-sm text-[#8d837b]">Your next great meal is just around the corner.</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-xs font-bold">Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-[#eae4de] px-4 text-sm font-normal outline-none focus:border-[#ff6b00]"/></label>
            <label className="block text-xs font-bold">Password<span className="relative mt-2 block"><input required type={show?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" className="h-12 w-full rounded-xl border border-[#eae4de] px-4 pr-12 text-sm font-normal outline-none focus:border-[#ff6b00]"/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Hide password":"Show password"} className="absolute right-3 top-3.5 text-[#8d837b]">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
            <div className="text-right"><Link href="/forgot-password" className="text-xs font-bold text-[#ff6b00] hover:underline">Forgot password?</Link></div>
            {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
            <button disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ff6b00] text-sm font-bold text-white transition hover:bg-[#e85f00] disabled:opacity-60">{busy?"Signing in...":"Sign in"} <ArrowRight size={16}/></button>
          </form>
          <p className="mt-7 text-center text-sm text-[#817971]">New to Cravio? <Link href="/signup" className="font-bold text-[#ff6b00]">Create an account</Link></p>
          <p className="mt-10 text-center text-[10px] text-[#aaa19a]">By continuing, you agree to Cravio’s terms and privacy policy.</p>
        </div>
      </section>
    </div>
  </main>;
}
