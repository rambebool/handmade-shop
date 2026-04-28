import { PhoneModel } from "./types";

export const phoneModels: PhoneModel[] = [
  // Apple iPhone
  { id: "iphone-16-pro-max", brand: "Apple", name: "iPhone 16 Pro Max", caseWidth: 77.6, caseHeight: 163, cornerRadius: 24, cameraLayout: "island" },
  { id: "iphone-16-pro", brand: "Apple", name: "iPhone 16 Pro", caseWidth: 71.5, caseHeight: 149.6, cornerRadius: 22, cameraLayout: "island" },
  { id: "iphone-16", brand: "Apple", name: "iPhone 16", caseWidth: 71.6, caseHeight: 147.6, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-15-pro-max", brand: "Apple", name: "iPhone 15 Pro Max", caseWidth: 76.7, caseHeight: 159.9, cornerRadius: 24, cameraLayout: "island" },
  { id: "iphone-15-pro", brand: "Apple", name: "iPhone 15 Pro", caseWidth: 70.6, caseHeight: 146.6, cornerRadius: 22, cameraLayout: "island" },
  { id: "iphone-15", brand: "Apple", name: "iPhone 15", caseWidth: 71.6, caseHeight: 147.6, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-14-pro-max", brand: "Apple", name: "iPhone 14 Pro Max", caseWidth: 77.6, caseHeight: 160.7, cornerRadius: 24, cameraLayout: "island" },
  { id: "iphone-14-pro", brand: "Apple", name: "iPhone 14 Pro", caseWidth: 71.5, caseHeight: 147.5, cornerRadius: 22, cameraLayout: "island" },
  { id: "iphone-14", brand: "Apple", name: "iPhone 14", caseWidth: 71.5, caseHeight: 146.7, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-13", brand: "Apple", name: "iPhone 13", caseWidth: 71.5, caseHeight: 146.7, cornerRadius: 22, cameraLayout: "pill" },

  // Samsung Galaxy
  { id: "galaxy-s24-ultra", brand: "Samsung", name: "Galaxy S24 Ultra", caseWidth: 79, caseHeight: 162.3, cornerRadius: 14, cameraLayout: "rect" },
  { id: "galaxy-s24-plus", brand: "Samsung", name: "Galaxy S24+", caseWidth: 75.9, caseHeight: 158.5, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-s24", brand: "Samsung", name: "Galaxy S24", caseWidth: 70.6, caseHeight: 147, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-s23-ultra", brand: "Samsung", name: "Galaxy S23 Ultra", caseWidth: 78.1, caseHeight: 163.4, cornerRadius: 14, cameraLayout: "rect" },
  { id: "galaxy-s23", brand: "Samsung", name: "Galaxy S23", caseWidth: 70.9, caseHeight: 146.3, cornerRadius: 16, cameraLayout: "rect" },

  // Google Pixel
  { id: "pixel-9-pro", brand: "Google", name: "Pixel 9 Pro", caseWidth: 72.5, caseHeight: 152.8, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-9", brand: "Google", name: "Pixel 9", caseWidth: 72.5, caseHeight: 152.8, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-8-pro", brand: "Google", name: "Pixel 8 Pro", caseWidth: 76.5, caseHeight: 162.6, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-8", brand: "Google", name: "Pixel 8", caseWidth: 70.8, caseHeight: 150.5, cornerRadius: 18, cameraLayout: "pill" },

  // Xiaomi
  { id: "xiaomi-14-pro", brand: "Xiaomi", name: "Xiaomi 14 Pro", caseWidth: 75.3, caseHeight: 161.4, cornerRadius: 20, cameraLayout: "circle" },
  { id: "xiaomi-14", brand: "Xiaomi", name: "Xiaomi 14", caseWidth: 71.5, caseHeight: 152.8, cornerRadius: 18, cameraLayout: "circle" },
  { id: "redmi-note-13-pro", brand: "Xiaomi", name: "Redmi Note 13 Pro", caseWidth: 76.2, caseHeight: 161.2, cornerRadius: 16, cameraLayout: "rect" },
];

export const caseColors = [
  { id: "transparent", name: "Прозрачный", hex: "#FFFFFF", alpha: 0.3 },
  { id: "white", name: "Белый", hex: "#FFFFFF", alpha: 1 },
  { id: "black", name: "Чёрный", hex: "#1A1A1A", alpha: 1 },
  { id: "red", name: "Красный", hex: "#FF4D00", alpha: 1 },
  { id: "blue", name: "Синий", hex: "#2563EB", alpha: 1 },
  { id: "cyan", name: "Бирюзовый", hex: "#00E5FF", alpha: 1 },
  { id: "green", name: "Зелёный", hex: "#16A34A", alpha: 1 },
  { id: "pink", name: "Розовый", hex: "#EC4899", alpha: 1 },
  { id: "yellow", name: "Жёлтый", hex: "#EAB308", alpha: 1 },
  { id: "cream", name: "Кремовый", hex: "#F4F1EA", alpha: 1 },
];

export const brandGroups = phoneModels.reduce<Record<string, PhoneModel[]>>((acc, m) => {
  if (!acc[m.brand]) acc[m.brand] = [];
  acc[m.brand].push(m);
  return acc;
}, {});
