"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { addToCart } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  onCartUpdate?: () => void;
}

export default function ProductCard({
  product,
  featured = false,
  onCartUpdate,
}: ProductCardProps) {
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    window.dispatchEvent(new Event("cart-update"));
    onCartUpdate?.();
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group relative flex flex-col border-2 border-black/80 bg-white transition-all hover:shadow-[6px_6px_0px_#FF4D00] hover:-translate-x-[2px] hover:-translate-y-[2px] ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-0 top-3 z-10 border-r-2 border-b-2 border-black/80 bg-[#FF4D00] px-3 py-1 font-mono text-xs font-bold uppercase text-white">
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div
        className={`relative w-full overflow-hidden border-b-2 border-black/80 bg-[#F4F1EA] ${
          featured ? "aspect-square md:aspect-[4/3]" : "aspect-square"
        }`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes={featured ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 100vw, 25vw"}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-3 md:p-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">
            {product.category}
          </span>
          <h3 className="mt-1 font-mono text-sm font-bold leading-snug text-[#1A1A1A] md:text-base">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="font-mono text-lg font-black text-[#1A1A1A] md:text-xl">
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
          <button
            onClick={handleAdd}
            className="border-2 border-black/80 bg-[#1A1A1A] px-3 py-1.5 font-mono text-xs font-bold uppercase text-white shadow-[3px_3px_0px_#FF4D00] transition-all hover:shadow-[1px_1px_0px_#FF4D00] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          >
            В корзину
          </button>
        </div>
      </div>
    </Link>
  );
}
