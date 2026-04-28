"use client";

import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface BentoGridProps {
  products: Product[];
  onCartUpdate?: () => void;
}

export default function BentoGrid({ products, onCartUpdate }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          featured={i === 0 || i === 5}
          onCartUpdate={onCartUpdate}
        />
      ))}
    </div>
  );
}
