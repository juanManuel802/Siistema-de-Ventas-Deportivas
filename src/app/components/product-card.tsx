import { ImageWithFallback } from "./figma/ImageWithFallback";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square w-full bg-[#f4f4f4] overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 px-1">
        <div className="font-bold text-black">{product.name}</div>
        <div className="text-[#888] text-sm">{product.description}</div>
        <div className="text-black mt-1">{product.price}</div>
      </div>
    </div>
  );
}
