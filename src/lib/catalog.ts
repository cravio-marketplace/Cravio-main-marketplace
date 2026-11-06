"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export type CampusVendor = { id:string; slug:string; name:string; description:string|null; address:string|null; logo_url:string|null; cover_url:string|null; is_accepting_orders:boolean; status:string; opening_hours:string|null; verification_status:string };
export type CampusMenuItem = { id:number; vendor_id:string; name:string; price:number; category:string|null; available:boolean; quantity:number|null; meal_time:string[]|null; image_url:string|null; item_variants?:{id:number;name:string;price:number;available:boolean;quantity:number|null}[] };
const slugify=(value:string)=>value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export function useCampusCatalog(){
 const [vendors,setVendors]=useState<CampusVendor[]>([]);const [menu,setMenu]=useState<CampusMenuItem[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{let active=true;async function load(){try{const supabase=createClient();const [vr,mr]=await Promise.all([supabase.from("vendors").select("id,business_name,description,address,logo_url,cover_url,is_accepting_orders,status,opening_hours,verification_status").eq("verification_status","accepted").eq("is_accepting_orders",true).eq("status","open").order("business_name"),supabase.from("menu_items").select("id,vendor_id,name,price,category,available,quantity,meal_time,image_url,item_variants(id,name,price,available,quantity)").eq("available",true).order("id")]);if(vr.error)throw vr.error;if(mr.error)throw mr.error;if(!active)return;setVendors((vr.data??[]).map(v=>({...v,slug:slugify(v.business_name||v.id),name:v.business_name||"Campus vendor"})) as CampusVendor[]);setMenu((mr.data??[]) as CampusMenuItem[]);setError("");}catch(e){if(active)setError(e instanceof Error?e.message:"Could not load campus catalog.");}finally{if(active)setLoading(false)}}void load();return()=>{active=false}},[]);
 return {vendors,menu,loading,error};
}
