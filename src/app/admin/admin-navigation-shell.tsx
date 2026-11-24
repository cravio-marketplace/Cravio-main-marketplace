"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft, LayoutDashboard, Store, ClipboardList, Users, Wallet,
  MessageSquareWarning, ScrollText, Settings, ShieldCheck, UserRound,
  Menu, X
} from "lucide-react";

const links = [
  { label: "Overview", href: "/admin", Icon: LayoutDashboard },
  { label: "Vendors", href: "/admin/vendors", Icon: Store },
  { label: "Orders", href: "/admin/orders", Icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", Icon: Users },
  { label: "Settlements", href: "/admin/settlements", Icon: Wallet },
  { label: "Disputes", href: "/admin/disputes", Icon: MessageSquareWarning },
  { label: "Audit log", href: "/admin/audit-logs", Icon: ScrollText },
  { label: "Platform settings", href: "/admin/settings", Icon: Settings },
  { label: "Administrators", href: "/admin/admins", Icon: ShieldCheck },
  { label: "Admin profile", href: "/admin/profile", Icon: UserRound },
];

function backHref(path: string) {
  if (path.startsWith("/admin/vendors/")) return "/admin/vendors";
  if (path.startsWith("/admin/orders/")) return "/admin/orders";
  if (path.startsWith("/admin/customers/")) return "/admin/customers";
  return "/admin";
}

export default function AdminNavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The dashboard already has its own desktop navigation.
  if (pathname === "/admin" || pathname === "/admin/login") return <>{children}</>;

  const nav = (
    <nav className="space-y-1">
      {links.filter((item) => item.href !== "/admin").map(({ label, href, Icon }) => {
        const active = pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-[#fff2e8] font-semibold text-[#e96000]" : "text-[#69635e] hover:bg-[#faf7f4]"}`}>
            <Icon size={17} />{label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[245px] border-r border-[#eee7e1] bg-white p-5 lg:block">
        <Link href="/admin" className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-[-2px]">cravio<span className="text-[#ff6b00]">.</span></Link>
        <p className="mb-8 mt-1 text-[10px] font-bold tracking-[2px] text-[#a19a93]">ADMIN CONSOLE</p>
        {nav}
        <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-[#fff8f2] p-3 text-xs text-[#8a7665]">Campus operations<br/><strong className="text-[#1f1f1f]">MIU · Pickup only</strong></div>
      </aside>

      <div className="lg:pl-[245px]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#eee7e1] bg-white/95 px-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation" : "Open navigation"} className="grid size-10 place-items-center rounded-lg border border-[#eee7e1]">
            {open ? <X size={19}/> : <Menu size={19}/>}
          </button>
          <Link href="/admin" className="font-bold tracking-tight">cravio<span className="text-[#ff6b00]">.</span> <span className="ml-1 text-xs font-medium text-[#8a837c]">Admin</span></Link>
          <Link href={backHref(pathname)} className="flex items-center gap-1 text-sm font-medium text-[#e96000]"><ArrowLeft size={16}/>Back</Link>
        </header>

        {open && <button aria-label="Close navigation overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/30 lg:hidden"/>}
        <div className={`fixed bottom-0 left-0 top-14 z-40 w-[280px] border-r border-[#eee7e1] bg-white p-5 transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <p className="mb-5 text-[10px] font-bold tracking-[2px] text-[#a19a93]">ADMIN NAVIGATION</p>
          {nav}
        </div>

        <div className="hidden h-12 items-center border-b border-[#eee7e1] bg-white px-8 lg:flex">
          <Link href={backHref(pathname)} className="flex items-center gap-2 text-sm font-medium text-[#e96000] hover:underline"><ArrowLeft size={16}/>Back</Link>
          <span className="ml-4 text-xs text-[#a19a93]">Cravio Admin Console</span>
        </div>
        {children}
      </div>
    </div>
  );
}
