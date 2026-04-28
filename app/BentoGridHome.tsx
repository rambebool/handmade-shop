"use client";

import { useSyncExternalStore } from "react";
import { Product } from "@/lib/types";
import { getAllProducts } from "@/lib/store";
import BentoGrid from "@/components/BentoGrid";
import mockProductsRaw from "@/lib/mock-products.json";

const mockProducts = mockProductsRaw as Product[];
const SERVER_SNAPSHOT = mockProducts.slice(0, 6);

let cachedSnapshot: Product[] = SERVER_SNAPSHOT;
let cachedKey = "";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(): Product[] {
  const fresh = getAllProducts(mockProducts).slice(0, 6);
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

export default function BentoGridHome() {
  const products = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <BentoGrid products={products} />;
}
