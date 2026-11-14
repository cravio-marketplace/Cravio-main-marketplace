"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type CampusVendor = {
 id:string;
 slug:string;
 name:string;
 description:string|null;
 address:string|null;
 logo_url:string|null;
 cover_url:string|null;
 is_accepting_orders:boolean;
 status:string;
 opening_hours:string|null;
 verification_status:string;
};

export type CampusMenuVariant = {
 id:number;
 name:string;
 price:number;
 available:boolean;
 quantity:number|null;
};

export type CampusMenuItem = {
 id:number;
 vendor_id:string;
 name:string;
 price:number;
 category:string|null;
 available:boolean;
 quantity:number|null;
 meal_time:string[]|null;
 image_url:string|null;
 item_variants?:CampusMenuVariant[];
};

const slugify=(value:string)=>value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

// Null quantity means the vendor does not track stock for this item.
// A tracked quantity of zero (or less) must never be offered to customers.
const hasStock=(quantity:number|null|undefined)=>quantity==null||quantity>0;
const isVariantOrderable=(variant:CampusMenuVariant)=>variant.available===true&&hasStock(variant.quantity);
const isMenuItemOrderable=(item:CampusMenuItem)=>item.available===true&&hasStock(item.quantity)&&(!item.item_variants?.length||item.item_variants.some(isVariantOrderable));

export function useCampusCatalog(){
 const [vendors,setVendors]=useState<CampusVendor[]>([]);
 const [menu,setMenu]=useState<CampusMenuItem[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");

 useEffect(()=>{
  let active=true;
  const supabase=createClient();

  async function load(){
   try{
    const [vr,mr]=await Promise.all([
     supabase.from("vendors")
      .select("id,business_name,description,address,logo_url,cover_url,is_accepting_orders,status,opening_hours,verification_status")
      .eq("verification_status","accepted")
      .eq("is_accepting_orders",true)
      .eq("status","open")
      .order("business_name"),
     supabase.from("menu_items")
      .select("id,vendor_id,name,price,category,available,quantity,meal_time,image_url,item_variants(id,name,price,available,quantity)")
      .eq("available",true)
      .order("id")
    ]);

    if(vr.error)throw vr.error;
    if(mr.error)throw mr.error;
    if(!active)return;

    const eligibleVendors=(vr.data??[]).map(v=>({
     ...v,
     slug:slugify(v.business_name||v.id),
     name:v.business_name||"Campus vendor"
    })) as CampusVendor[];
    const eligibleVendorIds=new Set(eligibleVendors.map(v=>String(v.id)));

    const eligibleMenu=(mr.data??[]).filter(raw=>{
     const item=raw as CampusMenuItem;
     return eligibleVendorIds.has(String(item.vendor_id))&&isMenuItemOrderable(item);
    }).map(raw=>{
     const item=raw as CampusMenuItem;
     return {
      ...item,
      item_variants:(item.item_variants??[]).filter(isVariantOrderable)
     };
    }) as CampusMenuItem[];

    setVendors(eligibleVendors);
    setMenu(eligibleMenu);
    setError("");
   }catch(e){
    if(active)setError(e instanceof Error?e.message:"Could not load campus catalog.");
   }finally{
    if(active)setLoading(false);
   }
  }

  void load();
  const channel=supabase.channel("customer-live-catalog")
   .on("postgres_changes",{event:"*",schema:"public",table:"menu_items"},()=>{void load()})
   .on("postgres_changes",{event:"*",schema:"public",table:"item_variants"},()=>{void load()})
   .on("postgres_changes",{event:"*",schema:"public",table:"vendors"},()=>{void load()})
   .subscribe();

  return()=>{
   active=false;
   void supabase.removeChannel(channel);
  };
 },[]);

 return {vendors,menu,loading,error};
}
