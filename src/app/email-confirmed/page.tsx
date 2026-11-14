import { Suspense } from "react";
import EmailConfirmedContent from "./email-confirmed-content";

export const metadata = {
  title: "Email confirmation | Cravio",
  description: "Confirm your Cravio email address.",
};

function EmailConfirmedFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fff8f3] px-5 py-10 text-[#1f1f1f]">
      <p className="text-sm text-[#817971]">Checking your confirmation status...</p>
    </main>
  );
}

export default function EmailConfirmedPage() {
  return (
    <Suspense fallback={<EmailConfirmedFallback />}>
      <EmailConfirmedContent />
    </Suspense>
  );
}
