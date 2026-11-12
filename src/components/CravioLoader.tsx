"use client";

import Image from "next/image";

type CravioLoaderProps = { size?: "sm" | "md" | "lg"; label?: string; fullScreen?: boolean };

export function CravioLoader({ size = "md", label = "Loading Cravio", fullScreen = false }: CravioLoaderProps) {
  const dimension = size === "sm" ? 28 : size === "lg" ? 64 : 42;
  return (
    <div className={fullScreen ? "cravio-loader-screen" : "cravio-loader"} role="status" aria-label={label}>
      <Image src="/brand/cravio-icon.png" alt="" width={dimension} height={dimension} className="cravio-loader-mark" priority />
      {fullScreen && <span className="cravio-loader-label">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}
