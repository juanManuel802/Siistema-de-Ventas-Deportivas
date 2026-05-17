import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  // Algorithm integration point: called when user selects a product
  onClick?: (product: Product) => void;
}) {
  const [pulse, setPulse] = useState(false);

  const handleClick = () => {
    setPulse(true);
    setTimeout(() => {
      setPulse(false);
      onClick?.(product);
    }, 150);
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex flex-col gap-3 rounded-xl shadow-sm cursor-pointer
        transition-all duration-[250ms] ease-in-out
        hover:scale-[1.03] hover:shadow-md
        ${pulse ? "scale-[1.06]" : ""}`}
    >
      <div className="aspect-square w-full bg-[#f4f4f4] overflow-hidden rounded-t-xl">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 px-3 pb-3">
        <div className="font-bold text-black">{product.name}</div>
        <div className="text-[#888] text-sm opacity-0 group-hover:opacity-100 transition-all duration-[250ms] ease-in-out">
          {product.description}
        </div>
        <div className="text-black mt-1">${product.price.toLocaleString()}</div>
      </div>
    </div>
  );
}
