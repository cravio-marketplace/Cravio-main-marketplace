"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type CartItem = {
  id: string;
  name: string;
  vendorSlug: string;
  vendorId?: string;
  menuItemId?: string;
  vendorName: string;
  price: number;
  image: string;
  quantity: number;
  specialInstructions?: string;
};

type CartContextValue = {
  items: CartItem[];
  vendorName: string | null;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => boolean;
  setQuantity: (id: string, quantity: number) => void;
  setSpecialInstructions: (id: string, instructions: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cravio-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems((parsed as CartItem[]).filter(item => Boolean(item && item.vendorId && item.menuItemId)));
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    if (items.length && items[0].vendorSlug !== item.vendorSlug) return false;
    const found = items.find(row => row.id === item.id);
    setItems(found
      ? items.map(row => row.id === item.id ? { ...row, quantity: row.quantity + 1 } : row)
      : [...items, { ...item, quantity: 1 }]);
    return true;
  }, [items]);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems(current => quantity <= 0
      ? current.filter(item => item.id !== id)
      : current.map(item => item.id === id ? { ...item, quantity } : item));
  }, []);

  const setSpecialInstructions = useCallback((id: string, instructions: string) => {
    setItems(current => current.map(item => item.id === id
      ? { ...item, specialInstructions: instructions.slice(0, 300) }
      : item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const menuItemKey = items.map(item => item.menuItemId).filter(Boolean).sort().join(",");
  const cartVendorId = items[0]?.vendorId;

  // Keep persisted cart prices aligned with the live vendor catalogue.
  // Items that are deleted, hidden or sold out are removed from the cart.
  useEffect(() => {
    if (!ready || !menuItemKey || !cartVendorId) return;
    let active = true;
    const supabase = createClient();
    const itemIds = menuItemKey.split(",").filter(Boolean);

    const syncCart = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id,vendor_id,name,price,image_url,available,quantity")
        .in("id", itemIds);
      if (error || !active) return;

      const liveItems = new Map((data || []).map(item => [String(item.id), item]));
      setItems(current => current.flatMap(item => {
        if (item.vendorId !== cartVendorId) return [item];
        const live = liveItems.get(String(item.menuItemId));
        if (!live || live.available !== true || (live.quantity !== null && live.quantity <= 0)) return [];
        return [{
          ...item,
          name: live.name || item.name,
          price: live.price,
          image: live.image_url || item.image,
        }];
      }));
    };

    void syncCart();
    const refreshTimer = window.setInterval(() => { void syncCart(); }, 30000);
    window.addEventListener("focus", syncCart);
    const channel = supabase
      .channel(`cart-menu-sync-${cartVendorId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => {
        void syncCart();
      })
      .subscribe();

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", syncCart);
      void supabase.removeChannel(channel);
    };
  }, [ready, menuItemKey, cartVendorId]);

  const value = useMemo(() => ({
    items,
    vendorName: items[0]?.vendorName ?? null,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    addItem,
    setQuantity,
    setSpecialInstructions,
    removeItem,
    clearCart,
  }), [items, addItem, setQuantity, setSpecialInstructions, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
