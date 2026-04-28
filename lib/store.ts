"use client";

import { Product, CartItem } from "./types";

const CART_KEY = "handmade-shop-cart";
const ADMIN_PRODUCTS_KEY = "handmade-shop-admin-products";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product: Product): CartItem[] {
  const items = getCart();
  const idx = items.findIndex((i) => i.product.id === product.id);
  if (idx >= 0) {
    items[idx].quantity += 1;
  } else {
    items.push({ product, quantity: 1 });
  }
  saveCart(items);
  return items;
}

export function removeFromCart(productId: string): CartItem[] {
  const items = getCart().filter((i) => i.product.id !== productId);
  saveCart(items);
  return items;
}

export function updateQuantity(
  productId: string,
  quantity: number
): CartItem[] {
  const items = getCart();
  const idx = items.findIndex((i) => i.product.id === productId);
  if (idx >= 0) {
    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].quantity = quantity;
    }
  }
  saveCart(items);
  return items;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

export function getAdminProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAdminProduct(product: Product): Product[] {
  const products = getAdminProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
  return products;
}

export function deleteAdminProduct(productId: string): Product[] {
  const products = getAdminProducts().filter((p) => p.id !== productId);
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
  return products;
}

export function getAllProducts(mockProducts: Product[]): Product[] {
  const adminProducts = getAdminProducts();
  const merged = [...mockProducts];
  for (const ap of adminProducts) {
    const idx = merged.findIndex((p) => p.id === ap.id);
    if (idx >= 0) {
      merged[idx] = ap;
    } else {
      merged.push(ap);
    }
  }
  return merged;
}
