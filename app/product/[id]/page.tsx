"use client";

import { useState, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { getAllProducts, addToCart } from "@/lib/store";
import mockProductsRaw from "@/lib/mock-products.json";

const mockProducts = mockProductsRaw as Product[];
const SERVER_SNAPSHOT = mockProducts;

let cachedSnapshot: Product[] = SERVER_SNAPSHOT;
let cachedKey = "";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(): Product[] {
  const fresh = getAllProducts(mockProducts);
  const key = JSON.stringify(fresh);
  if (key !== cachedKey) {
    cachedKey = key;
    cachedSnapshot = fresh;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): Product[] {
  return SERVER_SNAPSHOT;
}

export default function ProductPage() {
  const params = useParams();
  const allProducts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const product = allProducts.find((p) => p.id === params.id) || null;
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product);
    window.dispatchEvent(new Event("cart-update"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center md:px-8">
        <h1 className="font-mono text-2xl font-black uppercase text-[#1A1A1A]">
          Товар не найден
        </h1>
        <Link
          href="/catalog"
          className="mt-4 inline-block border-2 border-black/80 bg-[#FF4D00] px-5 py-2 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A]"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <nav className="mb-6 font-mono text-xs text-gray-500">
        <Link href="/" className="hover:text-[#FF4D00]">
          Главная
        </Link>
        {" / "}
        <Link href="/catalog" className="hover:text-[#FF4D00]">
          Каталог
        </Link>
        {" / "}
        <span className="text-[#1A1A1A]">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square border-2 border-black/80 bg-white shadow-[6px_6px_0px_#F4F1EA]">
          {product.badge && (
            <div className="absolute left-0 top-4 z-10 border-r-2 border-b-2 border-black/80 bg-[#FF4D00] px-3 py-1 font-mono text-xs font-bold uppercase text-white">
              {product.badge}
            </div>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00E5FF]">
            {product.category}
          </span>

          <h1 className="mt-2 font-mono text-2xl font-black uppercase leading-tight text-[#1A1A1A] md:text-3xl">
            {product.name}
          </h1>

          <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          <div className="mt-6 border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
            <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
              Характеристики
            </h3>
            <ul className="space-y-1">
              {product.specs.map((spec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-mono text-sm text-[#1A1A1A]"
                >
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 bg-[#FF4D00]" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="font-mono text-3xl font-black text-[#1A1A1A]">
              {product.price.toLocaleString("ru-RU")} ₽
            </span>

            <span
              className={`border-2 px-3 py-1 font-mono text-xs font-bold uppercase ${
                product.inStock !== false
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-red-600 bg-red-50 text-red-700"
              }`}
            >
              {product.inStock !== false ? "В наличии" : "Нет в наличии"}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.inStock === false}
            className={`mt-4 w-full border-2 border-black/80 py-3 font-mono text-sm font-bold uppercase transition-all md:w-auto md:px-8 ${
              added
                ? "bg-[#00E5FF] text-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]"
                : product.inStock === false
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-[#FF4D00] text-white shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
            }`}
          >
            {added
              ? "Добавлено!"
              : product.inStock === false
                ? "Нет в наличии"
                : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}
