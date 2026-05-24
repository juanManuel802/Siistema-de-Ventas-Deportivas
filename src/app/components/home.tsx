import { useMemo, useState, useCallback } from "react";
import { ProductCard } from "./product-card";
import type { Product } from "./product-card";
import { SearchBar } from "./search-bar";
import {
  getRecommendations,
  cargarPesosIniciales,
  leerPerfilPersistido,
  guardarPerfilPersistido,
} from "../../data/recommendation";
import { PRODUCTS } from "../../data/products";

export function Home({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const [query, setQuery] = useState("");

  // ── Cálculo de PageRank ──────────────────────────────────────────────────
  // Se ejecuta UNA SOLA VEZ por montaje de Home (o cuando cambia userId).
  // Lee el perfil de localStorage; si no existe, usa el CSV como semilla y
  // lo persiste de inmediato para futuras sesiones.
  const recommended = useMemo<Product[]>(() => {
    let pesos = leerPerfilPersistido(userId);
    if (!pesos) {
      pesos = cargarPesosIniciales(userId);
      guardarPerfilPersistido(userId, pesos);
    }
    return getRecommendations(PRODUCTS, pesos);
  }, [userId]);

  // ── Filtrado por búsqueda ────────────────────────────────────────────────
  // Opera sobre el orden congelado de `recommended`; no dispara PageRank.
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

  // ── Handler de clic ──────────────────────────────────────────────────────
  // Solo actualiza localStorage (sin setState → sin re-render).
  // El nuevo orden será visible en la próxima carga de página.
  const onProductClick = useCallback(
    (product: Product) => {
      const current = leerPerfilPersistido(userId) ?? cargarPesosIniciales(userId);
      const updated = {
        ...current,
        [product.category]: (current[product.category] ?? 0) + 0.3,
      };
      guardarPerfilPersistido(userId, updated);
    },
    [userId],
  );

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