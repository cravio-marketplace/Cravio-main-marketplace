"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type FavoriteItem = {
  id: string;
  item_key: string;
  item_type: "meal" | "vendor";
  name: string;
  vendor_name: string | null;
  vendor_slug: string | null;
  price: number | null;
  image_url: string | null;
  created_at: string;
};

type FavoriteInput = Omit<FavoriteItem, "id" | "created_at">;
type FavoriteContextValue = {
  items: FavoriteItem[];
  loading: boolean;
  userId: string | null;
  error: string;
  isFavorite: (itemKey: string) => boolean;
  toggleFavorite: (item: FavoriteInput) => Promise<{ requiresLogin: boolean; error?: string }>;
  removeFavorite: (itemKey: string) => Promise<void>;
};

const FavoriteContext = createContext<FavoriteContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = useCallback(async (uid: string) => {
    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("customer_favorites")
      .select("id,item_key,item_type,name,vendor_name,vendor_slug,price,image_url,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (queryError) {
      setError(queryError.message);
      setItems([]);
      return;
    }
    setError("");
    setItems((data ?? []) as FavoriteItem[]);
  }, []);

  useEffect(() => {
    let alive = true;
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
      supabase.auth.getUser().then(({ data, error: authError }) => {
        if (!alive) return;
        if (authError) setError(authError.message);
        const uid = data.user?.id ?? null;
        setUserId(uid);
        if (uid) void loadFavorites(uid);
        else setLoading(false);
      }).catch((err: unknown) => {
        if (alive) {
          setError(err instanceof Error ? err.message : "Unable to load favourites.");
          setLoading(false);
        }
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!alive) return;
        const uid = session?.user.id ?? null;
        setUserId(uid);
        if (uid) {
          setLoading(true);
          void loadFavorites(uid).finally(() => setLoading(false));
        } else {
          setItems([]);
          setLoading(false);
        }
      });
      return () => {
        alive = false;
        listener.subscription.unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Supabase is not configured.");
      setLoading(false);
    }
  }, [loadFavorites]);

  const isFavorite = useCallback((itemKey: string) => items.some((item) => item.item_key === itemKey), [items]);

  const toggleFavorite = useCallback(async (item: FavoriteInput) => {
    if (!userId) return { requiresLogin: true };
    const existing = items.find((row) => row.item_key === item.item_key);
    const supabase = createClient();
    if (existing) {
      const { error: deleteError } = await supabase.from("customer_favorites").delete().eq("id", existing.id);
      if (deleteError) {
        setError(deleteError.message);
        return { requiresLogin: false, error: deleteError.message };
      }
      setItems((current) => current.filter((row) => row.id !== existing.id));
    } else {
      const { data, error: insertError } = await supabase
        .from("customer_favorites")
        .insert({ ...item, user_id: userId })
        .select("id,item_key,item_type,name,vendor_name,vendor_slug,price,image_url,created_at")
        .single();
      if (insertError) {
        setError(insertError.message);
        return { requiresLogin: false, error: insertError.message };
      }
      setError("");
      setItems((current) => [data as FavoriteItem, ...current]);
    }
    return { requiresLogin: false };
  }, [items, userId]);

  const removeFavorite = useCallback(async (itemKey: string) => {
    const existing = items.find((row) => row.item_key === itemKey);
    if (!existing) return;
    const { error: deleteError } = await createClient().from("customer_favorites").delete().eq("id", existing.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setItems((current) => current.filter((row) => row.id !== existing.id));
  }, [items]);

  const value = useMemo(() => ({ items, loading, userId, error, isFavorite, toggleFavorite, removeFavorite }), [items, loading, userId, error, isFavorite, toggleFavorite, removeFavorite]);
  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
