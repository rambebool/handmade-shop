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
