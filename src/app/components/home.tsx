import { useMemo, useState } from "react";
import { ProductCard, type Product } from "./product-card";
import { SearchBar } from "./search-bar";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Ultra Runner",
    description: "Lightweight road running shoe",
    price: "$160",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
  {
    id: "2",
    name: "Core Track Jacket",
    description: "Classic three-stripe training jacket",
    price: "$85",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
  },
  {
    id: "3",
    name: "Field Pro Boots",
    description: "Firm ground football boots",
    price: "$220",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600",
  },
  {
    id: "4",
    name: "Heritage Low",
    description: "Everyday classic sneaker",
    price: "$95",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600",
  },
  {
    id: "5",
    name: "Train Tee",
    description: "Breathable performance t-shirt",
    price: "$35",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600",
  },
  {
    id: "6",
    name: "Studio Shorts",
    description: "Lightweight training shorts",
    price: "$45",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600",
  },
  {
    id: "7",
    name: "Court Classic",
    description: "Leather tennis-inspired sneaker",
    price: "$110",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600",
  },
  {
    id: "8",
    name: "Run Cap",
    description: "Adjustable running cap",
    price: "$28",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
  },
];

export function Home() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return PRODUCTS;
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen w-full bg-white">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#e5e5e5] z-40 flex items-center justify-between px-8">
        <div className="tracking-widest text-black">BRAND</div>
        <SearchBar value={query} onChange={setQuery} />
      </nav>

      <main className="pt-24 pb-16 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
