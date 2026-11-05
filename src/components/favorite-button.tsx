"use client";

import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites-provider";

type Props = {
  itemKey: string;
  itemType: "meal" | "vendor";
  name: string;
  vendorName?: string | null;
  vendorSlug?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  className?: string;
};

export function FavoriteButton({ itemKey, itemType, name, vendorName = null, vendorSlug = null, price = null, imageUrl = null, className = "" }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();
  const saved = isFavorite(itemKey);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const result = await toggleFavorite({
      item_key: itemKey,
      item_type: itemType,
      name,
      vendor_name: vendorName,
      vendor_slug: vendorSlug,
      price,
      image_url: imageUrl,
    });
    if (result.requiresLogin) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname || "/favorites")}`);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      aria-pressed={saved}
      title={saved ? "Remove from favourites" : "Save to favourites"}
      className={className || "absolute right-3 top-3 z-[3] grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#6d625a] shadow-sm transition hover:scale-105 hover:text-[#e94e48]"}
    >
      <Heart size={17} fill={saved ? "currentColor" : "none"} className={saved ? "text-[#e94e48]" : ""} />
    </button>
  );
}
