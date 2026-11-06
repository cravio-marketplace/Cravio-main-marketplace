"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/favorite-button";
import { useCampusCatalog } from "@/lib/catalog";
import {
  ArrowRight, Search, ShoppingBag, Clock3, Star, Heart, Plus,
  Utensils, Coffee, Sandwich, CakeSlice, CupSoda, Salad, MapPin,
} from "lucide-react";

const categories = [
  { name: "Rice & meals", icon: Utensils },
  { name: "Fast food", icon: Sandwich },
  { name: "Snacks", icon: Salad },
  { name: "Drinks", icon: CupSoda },
  { name: "Breakfast", icon: Coffee },
  { name: "Desserts", icon: CakeSlice },
];

const mockVendors = [
  { slug: "mamas-kitchen", name: "Mama’s Kitchen", type: "Local favourites", rating: "4.8", time: "15–25 min", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85", tag: "Student favourite" },
  { slug: "the-grill-spot", name: "The Grill Spot", type: "Grills & wraps", rating: "4.7", time: "10–20 min", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85", tag: "Quick bites" },
  { slug: "chop-and-sip", name: "Chop & Sip", type: "Meals and drinks", rating: "4.9", time: "20–30 min", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85", tag: "Popular" },
];

const mockMeals = [
  { name: "Smoky party jollof", vendor: "Mama’s Kitchen", price: 2500, category: "Rice & meals", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=85", badge: "Bestseller" },
  { name: "Crispy chicken & chips", vendor: "The Grill Spot", price: 3800, category: "Fast food", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=85", badge: "Popular" },
  { name: "Creamy chicken pasta", vendor: "Chop & Sip", price: 3200, category: "Rice & meals", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=85", badge: "New" },
  { name: "Loaded shawarma", vendor: "The Grill Spot", price: 3000, category: "Fast food", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=85", badge: "Student pick" },
];

const money = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);

export default function Home() {
  const { vendors: liveVendors, menu: liveMenu } = useCampusCatalog();
  const vendors = liveVendors.length ? liveVendors.slice(0,3).map(v=>({slug:v.slug,name:v.name,type:v.description||"Campus vendor",rating:"New",time:"Pickup",image:v.cover_url||v.logo_url||"",tag:"Verified campus vendor"})) : mockVendors;
  const meals = liveVendors.length ? liveMenu.slice(0,4).map(m=>{const v=liveVendors.find(v=>v.id===m.vendor_id)!;return {name:m.name,vendor:v.name,price:m.price,category:m.category||"Meals",image:m.image_url||v.cover_url||v.logo_url||"",badge:"Available",vendorSlug:v.slug}}) : mockMeals.map(m=>({...m,vendorSlug:m.vendor==="Mama’s Kitchen"?"mamas-kitchen":m.vendor==="The Grill Spot"?"the-grill-spot":"chop-and-sip"}));
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredMeals = useMemo(() => meals.filter((meal) =>
    (activeCategory === "All" || meal.category === activeCategory) &&
    (meal.name.toLowerCase().includes(query.toLowerCase()) || meal.vendor.toLowerCase().includes(query.toLowerCase()))
  ), [query, activeCategory]);

  return (
    <main className="cravio-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Cravio home">cravio<span>.</span></Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link className="nav-active" href="/">Home</Link><Link href="/explore">Explore</Link><Link href="/favorites">Favorites</Link><Link href="/orders">My orders</Link>
          </nav>
          <div className="header-actions">
            <Link href="/login" className="sign-in">Sign in</Link><Link href="/signup" className="header-signup">Create account</Link>
            <Link href="/cart" className="cart-button" aria-label="Open cart"><ShoppingBag size={19}/><span>Cart</span><b>0</b></Link>
          </div>
        </div>
      </header>

      <section className="hero-wrap">
        <div className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"/> MADE FOR CAMPUS LIFE</div>
            <h1>Your campus cravings,<br/><em>sorted.</em></h1>
            <p>Discover the meals you love, order ahead, and spend less time in queues.</p>
            <div className="hero-ctas"><Link href="/explore" className="btn-primary">Explore meals <ArrowRight size={18}/></Link><Link href="/explore" className="btn-quiet">Browse vendors</Link></div>
            <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>A</span><span>M</span></div><span><strong>Good food, less waiting.</strong><small>Campus life just got tastier.</small></span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image" role="img" aria-label="Delicious jollof rice with chicken"/>
            <div className="floating-note note-rating"><span className="rating-star"><Star size={14} fill="currentColor"/></span><div><strong>4.9/5</strong><small>Loved by students</small></div></div>
            <div className="floating-note note-pickup"><span className="pickup-icon"><Clock3 size={17}/></span><div><strong>Skip the queue</strong><small>Order. Pick up. Enjoy.</small></div></div>
            <div className="hero-spark">✳</div>
          </div>
        </div>
      </section>

      <section className="content-section search-section">
        <div className="search-box"><Search size={20}/><input aria-label="Search meals and vendors" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search meals, vendors, or cravings…"/><kbd>⌘ K</kbd></div>
        <div className="location-chip"><MapPin size={16}/><span>MIU Campus</span><span className="location-chevron">⌄</span></div>
      </section>

      <section className="content-section category-section">
        <div className="section-heading"><div><span className="section-kicker">WHAT ARE YOU IN THE MOOD FOR?</span><h2>Find your kind of food</h2></div><Link href="/explore" className="text-link">See all <ArrowRight size={16}/></Link></div>
        <div className="category-row">
          {categories.map(({name,icon:Icon})=><button key={name} onClick={()=>{setActiveCategory(name);document.getElementById("meals")?.scrollIntoView({behavior:"smooth"})}} className="category-item"><span className="category-icon"><Icon size={21}/></span><span>{name}</span></button>)}
        </div>
      </section>

      <section className="content-section vendors-section">
        <div className="section-heading"><div><span className="section-kicker">THE CAMPUS HOTSPOTS</span><h2>Popular on campus</h2><p className="section-description">The spots students keep coming back to.</p></div><Link href="/explore" className="text-link">All vendors <ArrowRight size={16}/></Link></div>
        <div className="vendor-grid">{vendors.map((vendor)=><Link href={`/vendors/${vendor.slug}`} className="vendor-card" key={vendor.name}><div className="vendor-photo" style={{backgroundImage:`url("${vendor.image}")`}}><span className="vendor-tag">{vendor.tag}</span><FavoriteButton itemKey={`vendor:${vendor.slug}`} itemType="vendor" name={vendor.name} vendorSlug={vendor.slug} imageUrl={vendor.image} /></div><div className="vendor-info"><div><h3>{vendor.name}</h3><p>{vendor.type}</p></div><span className="vendor-rating"><Star size={14} fill="currentColor"/> {vendor.rating}</span></div><div className="vendor-meta"><span><Clock3 size={14}/>{vendor.time}</span><span>Pickup available</span></div></Link>)}</div>
      </section>

      <section className="content-section meals-section" id="meals">
        <div className="section-heading"><div><span className="section-kicker">A LITTLE SOMETHING DELICIOUS</span><h2>Cravings worth ordering</h2><p className="section-description">Good food. Great mood. No long queues.</p></div><Link href="/explore" className="text-link">View menu <ArrowRight size={16}/></Link></div>
        <div className="filter-row"><button className={activeCategory==="All"?"filter-active":"filter"} onClick={()=>setActiveCategory("All")}>All meals</button>{categories.slice(0,4).map(c=><button key={c.name} className={activeCategory===c.name?"filter-active":"filter"} onClick={()=>setActiveCategory(c.name)}>{c.name}</button>)}</div>
        <div className="meal-grid">{filteredMeals.map(meal=><article className="meal-card" key={meal.name}><div className="meal-photo" style={{backgroundImage:`url("${meal.image}")`}}><span className="meal-badge">{meal.badge}</span><FavoriteButton itemKey={`meal:${meal.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`} itemType="meal" name={meal.name} vendorName={meal.vendor} vendorSlug={meal.vendorSlug} price={meal.price} imageUrl={meal.image} /></div><div className="meal-info"><p className="meal-vendor">{meal.vendor}</p><h3>{meal.name}</h3><div className="meal-bottom"><strong>{money(meal.price)}</strong><button className="add-button" aria-label={`Add ${meal.name} to cart`} onClick={()=>window.alert("Cart functionality is coming next.")}><Plus size={18}/></button></div></div></article>)}</div>
        {filteredMeals.length===0&&<div className="empty-results">No meals found. Try another search or category.</div>}
      </section>

      <section className="content-section promo-section"><div className="promo-card"><div><span className="promo-kicker">YOUR NEXT FAVOURITE IS WAITING</span><h2>Good food is closer<br/>than you think.</h2><p>Explore campus vendors and make your next break count.</p><Link href="/explore" className="promo-button">Find your next meal <ArrowRight size={17}/></Link></div><div className="promo-art"><div className="promo-circle"/><span className="promo-star">✳</span><span className="promo-word">YUM.</span></div></div></section>

      <footer className="site-footer"><div className="footer-top"><Link href="/" className="brand">cravio<span>.</span></Link><p>Campus food, without the fuss.</p><div className="footer-links"><Link href="/login">Sign in</Link><Link href="/signup">Create account</Link><Link href="/profile">My account</Link><Link href="/explore">Explore</Link><Link href="/help">Help</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Cravio. Made for campus.</span><span>Good food. Better breaks.</span></div></footer>
      <nav className="mobile-nav"><Link href="/" className="mobile-nav-active"><Utensils size={19}/><span>Home</span></Link><Link href="/explore"><Search size={19}/><span>Explore</span></Link><Link href="/favorites"><Heart size={19}/><span>Saved</span></Link><Link href="/cart"><ShoppingBag size={19}/><span>Cart</span></Link></nav>
    </main>
  );
}
