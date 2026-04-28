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
