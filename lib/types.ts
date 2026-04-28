export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  specs: string[];
  image: string;
  badge?: string;
  description?: string;
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type UserRole = "user" | "moderator" | "admin";

export interface User {
  id: string;
  login: string;
  passwordHash: string;
  email?: string;
  displayName?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userLogin: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Question {
  id: string;
  productId: string;
  userId: string;
  userLogin: string;
  text: string;
  answer?: string;
  answeredBy?: string;
  createdAt: string;
  answeredAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AdBlock {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  placement: "header" | "catalog-top" | "catalog-side" | "product-bottom" | "home-banner" | "footer";
  active: boolean;
  createdAt: string;
}

export interface SiteSettings {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  fontFamily: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  footerText: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface PhoneModel {
  id: string;
  brand: string;
  name: string;
  caseWidth: number;
  caseHeight: number;
  cornerRadius: number;
  cameraLayout: "island" | "pill" | "circle" | "rect";
}

export interface DesignLayer {
  id: string;
  type: "image" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  imageData?: string;
}

export interface CaseDesign {
  phoneModel: PhoneModel | null;
  caseColor: string;
  layers: DesignLayer[];
  externalLink: string;
  sendOwnCase: boolean;
}

export type PageBlockType =
  | "heading"
  | "text"
  | "image"
  | "banner"
  | "divider"
  | "spacer"
  | "html"
  | "columns"
  | "button";

export interface PageBlock {
  id: string;
  type: PageBlockType;
  props: Record<string, string>;
}

export interface PageLayout {
  pageId: string;
  blocks: PageBlock[];
}
