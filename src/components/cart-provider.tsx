"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
};
type CartContextValue = {
  items: CartItem[];
  vendorName: string | null;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem,"quantity">) => boolean;
  setQuantity: (id: string, quantity: number) => void;\n  setSpecialInstructions: (id: string, instructions: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cravio-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,setItems] = useState<CartItem[]>([]);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems((parsed as CartItem[]).filter(item => Boolean(item && item.vendorId && item.menuItemId)));
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
    setReady(true);
  },[]);
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY,JSON.stringify(items));
  },[items,ready]);
  const addItem = useCallback((item: Omit<CartItem,"quantity">) => {
    if (items.length && items[0].vendorSlug !== item.vendorSlug) return false;
    const found = items.find(row=>row.id===item.id);
    setItems(found
      ? items.map(row=>row.id===item.id?{...row,quantity:row.quantity+1}:row)
      : [...items,{...item,quantity:1}]);
    return true;
  },[items]);
  const setQuantity = useCallback((id:string,quantity:number) => setItems(current=>quantity<=0?current.filter(x=>x.id!==id):current.map(x=>x.id===id?{...x,quantity}:x)),[]);
  const setSpecialInstructions = useCallback((id:string,instructions:string)=>setItems(current=>current.map(item=>item.id===id?{...item,specialInstructions:instructions.slice(0,300)}:item)),[]);\n  const removeItem = useCallback((id:string)=>setItems(current=>current.filter(x=>x.id!==id)),[]);
  const clearCart = useCallback(()=>setItems([]),[]);
  const value = useMemo(()=>({items,vendorName:items[0]?.vendorName??null,itemCount:items.reduce((n,x)=>n+x.quantity,0),subtotal:items.reduce((n,x)=>n+x.price*x.quantity,0),addItem,setQuantity,setSpecialInstructions,removeItem,clearCart}),[items,addItem,setQuantity,setSpecialInstructions,removeItem,clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context=useContext(CartContext);
  if(!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
