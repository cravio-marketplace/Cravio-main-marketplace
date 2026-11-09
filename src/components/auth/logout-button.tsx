"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Unable to sign out. Please try again.");
      }

      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign out. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={logout}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl border border-[#f0dfd5] px-4 py-3 text-xs font-bold text-[#a04432] hover:bg-[#fff5f2] disabled:opacity-60"
      >
        <LogOut size={15} />
        {busy ? "Signing out..." : "Sign out"}
      </button>
      {error && <p role="alert" className="max-w-xs text-right text-xs text-red-600">{error}</p>}
    </div>
  );
}
