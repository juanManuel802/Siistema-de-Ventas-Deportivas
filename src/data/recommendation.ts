import { Product } from "../app/components/product-card";

// Eagerly load all CSV files as raw text
const csvFiles = import.meta.glob('./user-behavior/*.csv', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function getRecommendations(userId: string, products: Product[]): Product[] {
  const filePath = `./user-behavior/${userId}.csv`;
  const fileContent = csvFiles[filePath];

  if (!fileContent) {
    return [...products];
  }

  const lines = fileContent.trim().split('\n');
  if (lines.length < 2) return [...products];

  const headers = lines[0].split(',').map(h => h.trim());
  const values = lines[1].split(',').map(v => v.trim());

  const weights: Record<string, number> = {};
  for (let i = 1; i < headers.length; i++) {
    weights[headers[i]] = parseFloat(values[i]) || 0;
  }

  const scoredProducts = products.map(p => {
    const score = weights[p.category] || 0;
    return { product: p, score };
  });

  scoredProducts.sort((a, b) => b.score - a.score);

  return scoredProducts.map(sp => sp.product);
}
