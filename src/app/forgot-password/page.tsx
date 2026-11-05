"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage(){
 const [email,setEmail]=useState("");const [busy,setBusy]=useState(false);const [sent,setSent]=useState(false);const [error,setError]=useState("");
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");try{const supabase=createClient();const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/auth/callback?next=/reset-password`});if(error)throw error;setSent(true);}catch(err){setError(err instanceof Error?err.message:"Unable to send reset email.");}finally{setBusy(false);}}
 return <main className="grid min-h-screen place-items-center bg-[#fff8f3] px-5 py-12"><section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_24px_80px_#572b1110] sm:p-10"><Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#827970]"><ArrowLeft size={14}/> Back to sign in</Link><span className="mt-8 grid h-12 w-12 place-items-center rounded-xl bg-[#fff1e7] text-[#ff6b00]"><MailCheck size={22}/></span><h1 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-1.3px]">Forgot your password?</h1><p className="mt-2 text-sm leading-6 text-[#8d837b]">Enter the email address linked to your Cravio account and we’ll send you a reset link.</p>
 {sent?<div role="status" className="mt-6 rounded-xl bg-[#eaf8e7] p-4 text-sm leading-6 text-[#397b40]">If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox.</div>:<form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-xs font-bold">Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-[#eae4de] px-4 text-sm font-normal outline-none focus:border-[#ff6b00]"/></label>{error&&<p role="alert" className="text-xs text-red-600">{error}</p>}<button disabled={busy} className="h-12 w-full rounded-xl bg-[#ff6b00] text-sm font-bold text-white hover:bg-[#e85f00] disabled:opacity-60">{busy?"Sending link...":"Send reset link"}</button></form>}
 </section></main>;
}
