"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { Product } from "@/lib/types";
import { getAllProducts } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import mockProductsRaw from "@/lib/mock-products.json";

const mockProductsTyped = mockProductsRaw as Product[];
const PAGE_SIZE = 8;

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(): Product[] {
  return getAllProducts(mockProductsTyped);
}

function getServerSnapshot(): Product[] {
  return mockProductsTyped;
}

export default function CatalogPage() {
  const products = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [category, setCategory] = useState("Все");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["Все", ...cats];
  }, [products]);

  const filtered = useMemo(
    () =>
      category === "Все"
        ? products
        : products.filter((p) => p.category === category),
    [products, category]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-mono text-3xl font-black uppercase text-[#1A1A1A] md:text-4xl">
        Каталог
      </h1>
      <p className="mt-1 font-mono text-sm text-gray-500">
        {filtered.length}{" "}
        {filtered.length === 1
          ? "товар"
          : filtered.length < 5
            ? "товара"
            : "товаров"}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`border-2 border-black/80 px-4 py-1.5 font-mono text-xs font-bold uppercase transition-all ${
              category === cat
                ? "bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#FF4D00]"
                : "bg-white text-[#1A1A1A] shadow-[3px_3px_0px_#F4F1EA] hover:shadow-[3px_3px_0px_#00E5FF]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="border-2 border-black/80 bg-white px-8 py-3 font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_#FF4D00] transition-all hover:shadow-[2px_2px_0px_#FF4D00] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Загрузить ещё →
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="font-mono text-lg font-bold text-gray-400">
            Товаров в этой категории нет
          </p>
        </div>
      )}
    </div>
  );
}
