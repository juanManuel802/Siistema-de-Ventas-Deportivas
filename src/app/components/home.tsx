import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { SearchBar } from "./search-bar";
import { getRecommendations } from "../../data/recommendation";
import { PRODUCTS } from "../../data/products";

export function Home({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  console.log("Active user:", userId);
  const [query, setQuery] = useState("");

  const recommended = useMemo(() => {
    return getRecommendations(userId, PRODUCTS);
  }, [userId]);

  const filtered = useMemo(() => {
    if (!query.trim()) return recommended;
    const q = query.toLowerCase();
    return recommended.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query, recommended]);

  const searchSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    const seenCategories = new Set<string>();
    for (const p of PRODUCTS) {
      if (!seenCategories.has(p.category)) {
        seenCategories.add(p.category);
        suggestions.push(p.name);
      }
      if (suggestions.length >= 5) break;
    }
    return suggestions;
  }, []);

  return (
    <div className="min-h-screen w-full bg-white">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#e5e5e5] z-40 flex items-center justify-between px-8">
        <div className="tracking-widest text-black">BRAND</div>
        <SearchBar value={query} onChange={setQuery} suggestions={searchSuggestions} />
        <button
          onClick={onLogout}
          className="tracking-widest text-black bg-transparent border-none cursor-pointer text-sm hover:opacity-60 transition-opacity"
        >
          SIGN OUT
        </button>
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
