"use client";

import { Product, CartItem, Order, Review, Question, AdBlock, SiteSettings, Category, PageLayout, PageBlock } from "./types";

const CART_KEY = "handmade-shop-cart";
const ADMIN_PRODUCTS_KEY = "handmade-shop-admin-products";
const ORDERS_KEY = "handmade-shop-orders";
const REVIEWS_KEY = "handmade-shop-reviews";
const QUESTIONS_KEY = "handmade-shop-questions";
const ADS_KEY = "handmade-shop-ads";
const SETTINGS_KEY = "handmade-shop-settings";
const CATEGORIES_KEY = "handmade-shop-categories";
const PAGE_LAYOUTS_KEY = "handmade-shop-page-layouts";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Керамика", order: 0 },
  { id: "cat-2", name: "Дерево", order: 1 },
  { id: "cat-3", name: "Текстиль", order: 2 },
  { id: "cat-4", name: "Свечи", order: 3 },
  { id: "cat-5", name: "Кожа", order: 4 },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  primaryColor: "#FF4D00",
  accentColor: "#00E5FF",
  bgColor: "#F4F1EA",
  fontFamily: "var(--font-geist-mono)",
  heroTitle: "Уникальные изделия ручной работы",
  heroSubtitle: "Керамика, дерево, текстиль и кожа от мастеров со всей России",
  heroBadge: "HAND2025 — скидка 15%",
  footerText: "HANDMADE.SHOP — Изделия ручной работы © 2025",
};

// ─── Cart ─────────────────────────────────────────

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

// ─── Products ─────────────────────────────────────

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

// ─── Orders ───────────────────────────────────────

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUserOrders(userId: string): Order[] {
  return getOrders().filter((o) => o.userId === userId);
}

export function createOrder(userId: string, items: CartItem[], total: number): Order {
  const order: Order = {
    id: `order-${Date.now()}`,
    userId,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
}

export function updateOrderStatus(orderId: string, status: Order["status"]): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    orders[idx].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

// ─── Reviews ──────────────────────────────────────

export function getReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getProductReviews(productId: string): Review[] {
  return getReviews().filter((r) => r.productId === productId);
}

export function addReview(review: Omit<Review, "id" | "createdAt">): Review {
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const reviews = getReviews();
  reviews.push(newReview);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  return newReview;
}

export function deleteReview(reviewId: string): void {
  const reviews = getReviews().filter((r) => r.id !== reviewId);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// ─── Questions ────────────────────────────────────

export function getQuestions(): Question[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getProductQuestions(productId: string): Question[] {
  return getQuestions().filter((q) => q.productId === productId);
}

export function addQuestion(question: Omit<Question, "id" | "createdAt">): Question {
  const newQ: Question = {
    ...question,
    id: `q-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const questions = getQuestions();
  questions.push(newQ);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  return newQ;
}

export function answerQuestion(questionId: string, answer: string, answeredBy: string): void {
  const questions = getQuestions();
  const idx = questions.findIndex((q) => q.id === questionId);
  if (idx >= 0) {
    questions[idx].answer = answer;
    questions[idx].answeredBy = answeredBy;
    questions[idx].answeredAt = new Date().toISOString();
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  }
}

// ─── Categories ───────────────────────────────────

export function getCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function addCategory(name: string): Category[] {
  const cats = getCategories();
  cats.push({ id: `cat-${Date.now()}`, name, order: cats.length });
  saveCategories(cats);
  return cats;
}

export function deleteCategory(catId: string): Category[] {
  const cats = getCategories().filter((c) => c.id !== catId);
  saveCategories(cats);
  return cats;
}

export function updateCategory(catId: string, name: string): Category[] {
  const cats = getCategories();
  const idx = cats.findIndex((c) => c.id === catId);
  if (idx >= 0) cats[idx].name = name;
  saveCategories(cats);
  return cats;
}

// ─── Ad Blocks ────────────────────────────────────

export function getAds(): AdBlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getActiveAds(placement: AdBlock["placement"]): AdBlock[] {
  return getAds().filter((a) => a.active && a.placement === placement);
}

export function saveAd(ad: AdBlock): AdBlock[] {
  const ads = getAds();
  const idx = ads.findIndex((a) => a.id === ad.id);
  if (idx >= 0) {
    ads[idx] = ad;
  } else {
    ads.push(ad);
  }
  localStorage.setItem(ADS_KEY, JSON.stringify(ads));
  return ads;
}

export function deleteAd(adId: string): AdBlock[] {
  const ads = getAds().filter((a) => a.id !== adId);
  localStorage.setItem(ADS_KEY, JSON.stringify(ads));
  return ads;
}

// ─── Site Settings ────────────────────────────────

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("settings-update"));
}

// ─── Page Layouts (Block Editor) ────────────────────

const AVAILABLE_PAGES = [
  { id: "home-top", label: "Главная — верх (после баннера)" },
  { id: "home-bottom", label: "Главная — низ (после товаров)" },
  { id: "catalog-top", label: "Каталог — верх" },
  { id: "catalog-bottom", label: "Каталог — низ" },
  { id: "custom-1", label: "Доп. секция 1" },
  { id: "custom-2", label: "Доп. секция 2" },
];

export { AVAILABLE_PAGES };

function getAllLayouts(): PageLayout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PAGE_LAYOUTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAllLayouts(layouts: PageLayout[]): void {
  localStorage.setItem(PAGE_LAYOUTS_KEY, JSON.stringify(layouts));
  window.dispatchEvent(new Event("layout-update"));
}

export function getPageLayout(pageId: string): PageBlock[] {
  const layouts = getAllLayouts();
  const found = layouts.find((l) => l.pageId === pageId);
  return found ? found.blocks : [];
}

export function savePageLayout(pageId: string, blocks: PageBlock[]): void {
  const layouts = getAllLayouts();
  const idx = layouts.findIndex((l) => l.pageId === pageId);
  if (idx >= 0) {
    layouts[idx].blocks = blocks;
  } else {
    layouts.push({ pageId, blocks });
  }
  saveAllLayouts(layouts);
}

export function getPageLayouts(): PageLayout[] {
  return getAllLayouts();
}
