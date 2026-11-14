"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, MailWarning } from "lucide-react";

export default function EmailConfirmedContent() {
  const searchParams = useSearchParams();
  const failed = searchParams.get("status") === "error";

  return (
    <main className="grid min-h-screen place-items-center bg-[#fff8f3] px-5 py-10 text-[#1f1f1f]">
      <section className="w-full max-w-md rounded-[28px] border border-[#f1e9e2] bg-white px-7 py-10 text-center shadow-[0_24px_80px_#572b1110] sm:px-10">
        <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-1.8px]">crav<span className="text-[#ff6b00]">io</span></Link>
        <div className={`mx-auto mt-9 grid h-16 w-16 place-items-center rounded-2xl ${failed ? "bg-red-50 text-red-600" : "bg-[#e9f8e6] text-[#368447]"}`}>
          {failed ? <MailWarning size={32} /> : <CheckCircle2 size={32} />}
        </div>
        <p className="mt-6 text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">{failed ? "CONFIRMATION LINK ISSUE" : "EMAIL VERIFIED"}</p>
        <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-1.4px]">{failed ? "We couldn’t confirm your email" : "Your email has been confirmed!"}</h1>
        <p className="mt-3 text-sm leading-6 text-[#817971]">{failed ? "This link may have expired or already been used. Return to Cravio and request a new confirmation email if you still need one." : "You’re all set. Return to Cravio to continue exploring campus food and placing your orders."}</p>
        <Link href={failed ? "/login" : "/"} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ff6b00] px-5 text-sm font-bold text-white transition hover:bg-[#e85f00]">{failed ? "Return to sign in" : "Return to Cravio"} <ArrowRight size={16}/></Link>
        <p className="mt-5 text-xs text-[#aaa19a]">Welcome to the Cravio community.</p>
      </section>
    </main>
  );
}
