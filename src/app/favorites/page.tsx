import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FavoritesPage(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 return <main className="min-h-screen bg-[#fffdfb] px-5 py-10 text-[#1f1f1f]"><div className="mx-auto max-w-4xl"><Link href="/profile" className="inline-flex items-center gap-2 text-xs font-bold text-[#8b8179]"><ArrowLeft size={14}/> Back to profile</Link><p className="mt-7 text-[10px] font-extrabold tracking-[1.8px] text-[#b27a53]">YOUR PERSONAL SHORTLIST</p><h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-[-2px]">Favourites<span className="text-[#ff6b00]">.</span></h1><section className="mt-8 rounded-3xl border border-[#eee9e5] bg-white px-5 py-16 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6b00]"><Heart size={27}/></span><h2 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">Your favourites will show up here</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8d837b]">Save meals and vendors you love so you can find them quickly next time. Saving and syncing favourites is the next feature to connect.</p><Link href="/explore" className="mt-6 inline-flex rounded-xl bg-[#ff6b00] px-5 py-3 text-xs font-bold text-white">Explore campus food</Link></section></div></main>;
}
