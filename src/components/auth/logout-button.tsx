"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton(){
 const [busy,setBusy]=useState(false);const router=useRouter();
 async function logout(){setBusy(true);const supabase=createClient();await supabase.auth.signOut();router.replace("/login");router.refresh();}
 return <button type="button" onClick={logout} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-[#f0dfd5] px-4 py-3 text-xs font-bold text-[#a04432] hover:bg-[#fff5f2] disabled:opacity-60"><LogOut size={15}/>{busy?"Signing out...":"Sign out"}</button>;
}
