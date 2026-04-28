"use client";

import { useSyncExternalStore } from "react";
import { Product } from "@/lib/types";
import { getAllProducts } from "@/lib/store";
import BentoGrid from "@/components/BentoGrid";
import mockProductsRaw from "@/lib/mock-products.json";

const mockProducts = mockProductsRaw as Product[];

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(): Product[] {
  return getAllProducts(mockProducts).slice(0, 6);
}

function getServerSnapshot(): Product[] {
  return mockProducts.slice(0, 6);
}

export default function BentoGridHome() {
  const products = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <BentoGrid products={products} />;
}
