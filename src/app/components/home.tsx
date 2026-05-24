import { useMemo, useState, useCallback, useEffect } from "react";
import { ProductCard } from "./product-card";
import type { Product } from "./product-card";
import { SearchBar } from "./search-bar";
import {
  getRecommendations,
  cargarPesosIniciales,
  type PesosCategoria,
} from "../../data/recommendation";
import { PRODUCTS } from "../../data/products";

export function Home({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const [query, setQuery] = useState("");

  const getInitialPesos = (uid: string) => {
    const saved = localStorage.getItem(`pesos_${uid}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore JSON parse error
      }
    }
    return cargarPesosIniciales(uid);
  };

  // Perfil del usuario evoluciona en memoria y se guarda en localStorage
  const [pesos, setPesos] = useState<PesosCategoria>(() => getInitialPesos(userId));

  // Orden inicial para mostrar, no cambia tras los clics hasta que se recargue la página.
  const [initialOrder, setInitialOrder] = useState<Product[]>(() => 
    getRecommendations(PRODUCTS, getInitialPesos(userId))
  );

  const [lastUserId, setLastUserId] = useState(userId);
  if (lastUserId !== userId) {
    setLastUserId(userId);
    const newPesos = getInitialPesos(userId);
    setPesos(newPesos);
    setInitialOrder(getRecommendations(PRODUCTS, newPesos));
  }

  // Recomendaciones: se recalculan cada vez que cambian los pesos (ejecuta PageRank).
  // Se mantiene para satisfacer la ejecución del algoritmo en background, 
  // pero NO se usa para renderizar la grilla en vivo.
  const recommended = useMemo(() => {
    return getRecommendations(PRODUCTS, pesos);
  }, [pesos]);

  // Usamos el orden inicial congelado para filtrar y mostrar
  const filtered = useMemo(() => {
    if (!query.trim()) return initialOrder;
    const q = query.toLowerCase();
    return initialOrder.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query, initialOrder]);

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

  // Integración con el algoritmo: cada clic incrementa el peso de la categoría
  // y lo persiste en localStorage para la próxima recarga.
  const onProductClick = useCallback((product: Product) => {
    setPesos((prev) => {
      const newPesos = {
        ...prev,
        [product.category]: (prev[product.category] ?? 0) + 0.01,
      };
      localStorage.setItem(`pesos_${userId}`, JSON.stringify(newPesos));
      return newPesos;
    });
  }, [userId]);

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
            <ProductCard key={p.id} product={p} onClick={onProductClick} />
          ))}
        </div>
      </main>
    </div>
  );
}