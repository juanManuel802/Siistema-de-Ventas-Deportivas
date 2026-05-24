/// <reference types="vite/client" />
import { Product } from "../app/components/product-card";
import { calcularPageRank, Vector } from "./pagerank";

// ─────────────────────────────────────────────────────────────────────────────
// Adaptador: traduce el dominio "productos + preferencias del usuario" al
// lenguaje del PDF (N nodos, predicado de enlaces, vector de personalización v)
// y delega todo el cálculo matemático a pagerank.ts.
//
// Este módulo es el único que conoce el formato del CSV. Home.tsx solo
// interactúa con él a través de dos funciones:
//
//   - cargarPesosIniciales(userId): lee el CSV una sola vez (semilla)
//   - getRecommendations(products, pesos): calcula el orden actual
// ─────────────────────────────────────────────────────────────────────────────

export type PesosCategoria = Record<string, number>;

// Carga eager de los CSV de comportamiento de usuario
const csvFiles = import.meta.glob('./user-behavior/*.csv', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;


/**
 * Lee el CSV del usuario y devuelve un mapa { categoria → peso }.
 * Esta es la "semilla" del perfil: se invoca una sola vez al montar Home.
 * A partir de ahí, las preferencias evolucionan en memoria.
 *
 * Formato esperado del CSV:
 *
 *     userId,cycling,running,swimming,fitness,football
 *     user1,0.8,0.1,0.0,0.5,0.2
 */
export function cargarPesosIniciales(userId: string): PesosCategoria {
  const filePath = `./user-behavior/${userId}.csv`;
  const fileContent = csvFiles[filePath];
  if (!fileContent) return {};

  const lines = fileContent.trim().split('\n');
  if (lines.length < 2) return {};

  const headers = lines[0].split(',').map(h => h.trim());
  const values = lines[1].split(',').map(v => v.trim());

  const pesos: PesosCategoria = {};
  for (let i = 1; i < headers.length; i++) {
    pesos[headers[i]] = parseFloat(values[i]) || 0;
  }
  return pesos;
}


/**
 * Construye el vector de personalización v a partir de los pesos por categoría.
 *
 *   - El peso de cada categoría se reparte uniformemente entre los productos
 *     de esa categoría.
 *   - v se normaliza para que Σ v[i] = 1 (requisito del PDF: v debe ser una
 *     distribución de probabilidad).
 *
 * Si todos los pesos son 0, devuelve null para que pagerank.ts use v = e/N.
 */
function construirVectorPersonalizacion(
  products: Product[],
  pesos: PesosCategoria,
): Vector | null {
  const N = products.length;

  // Conteo de productos por categoría
  const conteoCat: Record<string, number> = {};
  for (const p of products) {
    conteoCat[p.category] = (conteoCat[p.category] ?? 0) + 1;
  }

  // v[i] = peso(categoria_i) / cantidad_productos_de_esa_categoria
  const v: Vector = new Array(N).fill(0);
  for (let i = 0; i < N; i++) {
    const cat = products[i].category;
    const peso = pesos[cat] ?? 0;
    const n_cat = conteoCat[cat] ?? 1;
    v[i] = peso / n_cat;
  }

  // Normalización para que Σ v = 1
  const suma = v.reduce((acc, x) => acc + x, 0);
  if (suma === 0) return null;
  for (let i = 0; i < N; i++) v[i] /= suma;

  return v;
}


/**
 * Devuelve los productos ordenados según el vector PageRank.
 *
 * Modelado del problema en términos del PDF:
 *
 *   - Cada producto es un nodo del grafo.
 *   - Existe enlace de i a j si y solo si comparten categoría (i ≠ j).
 *   - El vector v se personaliza según los pesos por categoría actuales
 *     del usuario (que evolucionan con cada clic).
 *
 * El cálculo del PageRank se delega completamente a pagerank.ts.
 */
export function getRecommendations(
  products: Product[],
  pesos: PesosCategoria,
): Product[] {
  const N = products.length;

  // Predicado de enlaces: misma categoría
  const hayEnlace = (i: number, j: number): boolean =>
    products[i].category === products[j].category;

  // Vector de personalización a partir de los pesos actuales
  const v = construirVectorPersonalizacion(products, pesos);

  // Cálculo del PageRank (si v es null, pagerank.ts usa v = e/N)
  const pi = calcularPageRank(N, hayEnlace, v ?? undefined);

  // Ordenar productos por π descendente
  const indices = products.map((_, i) => i);
  indices.sort((a, b) => pi[b] - pi[a]);

  return indices.map(i => products[i]);
}


// ─────────────────────────────────────────────────────────────────────────────
// Persistencia del perfil de usuario en localStorage
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'pagerank_pesos_';

/**
 * Lee el perfil persistido de `localStorage` para el usuario dado.
 * Devuelve null si no existe ninguna entrada o si el JSON está corrupto.
 */
export function leerPerfilPersistido(userId: string): PesosCategoria | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw) as PesosCategoria;
  } catch {
    return null;
  }
}

/**
 * Guarda los pesos del usuario en `localStorage` bajo la clave
 * `pagerank_pesos_<userId>`.
 */
export function guardarPerfilPersistido(userId: string, pesos: PesosCategoria): void {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(pesos));
}