import { PhoneModel } from "./types";

export const UNIVERSAL_MODEL: PhoneModel = {
  id: "universal",
  brand: "Универсальный",
  name: "Универсальный макет",
  caseWidth: 73,
  caseHeight: 150,
  cornerRadius: 18,
  cameraLayout: "pill",
};

export const phoneModels: PhoneModel[] = [
  // Apple iPhone
  { id: "iphone-16-pro-max", brand: "Apple", name: "iPhone 16 Pro Max", caseWidth: 77.6, caseHeight: 163, cornerRadius: 24, cameraLayout: "island" },
  { id: "iphone-16-pro", brand: "Apple", name: "iPhone 16 Pro", caseWidth: 71.5, caseHeight: 149.6, cornerRadius: 22, cameraLayout: "island" },
  { id: "iphone-16-plus", brand: "Apple", name: "iPhone 16 Plus", caseWidth: 77.8, caseHeight: 160.9, cornerRadius: 24, cameraLayout: "pill" },
  { id: "iphone-16", brand: "Apple", name: "iPhone 16", caseWidth: 71.6, caseHeight: 147.6, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-15-pro-max", brand: "Apple", name: "iPhone 15 Pro Max", caseWidth: 76.7, caseHeight: 159.9, cornerRadius: 24, cameraLayout: "island" },
  { id: "iphone-15-pro", brand: "Apple", name: "iPhone 15 Pro", caseWidth: 70.6, caseHeight: 146.6, cornerRadius: 22, cameraLayout: "island" },
  { id: "iphone-15-plus", brand: "Apple", name: "iPhone 15 Plus", caseWidth: 77.8, caseHeight: 160.9, cornerRadius: 24, cameraLayout: "pill" },
  { id: "iphone-15", brand: "Apple", name: "iPhone 15", caseWidth: 71.6, caseHeight: 147.6, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-14-pro-max", brand: "Apple", name: "iPhone 14 Pro Max", caseWidth: 77.6, caseHeight: 160.7, cornerRadius: 24, cameraLayout: "island" },
  { id: "iphone-14-pro", brand: "Apple", name: "iPhone 14 Pro", caseWidth: 71.5, caseHeight: 147.5, cornerRadius: 22, cameraLayout: "island" },
  { id: "iphone-14-plus", brand: "Apple", name: "iPhone 14 Plus", caseWidth: 78.1, caseHeight: 160.8, cornerRadius: 24, cameraLayout: "pill" },
  { id: "iphone-14", brand: "Apple", name: "iPhone 14", caseWidth: 71.5, caseHeight: 146.7, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-13-pro-max", brand: "Apple", name: "iPhone 13 Pro Max", caseWidth: 78.1, caseHeight: 160.8, cornerRadius: 24, cameraLayout: "island" },
  { id: "iphone-13-pro", brand: "Apple", name: "iPhone 13 Pro", caseWidth: 71.5, caseHeight: 146.7, cornerRadius: 22, cameraLayout: "island" },
  { id: "iphone-13", brand: "Apple", name: "iPhone 13", caseWidth: 71.5, caseHeight: 146.7, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-13-mini", brand: "Apple", name: "iPhone 13 Mini", caseWidth: 64.2, caseHeight: 131.5, cornerRadius: 20, cameraLayout: "pill" },
  { id: "iphone-12", brand: "Apple", name: "iPhone 12", caseWidth: 71.5, caseHeight: 146.7, cornerRadius: 22, cameraLayout: "pill" },
  { id: "iphone-se-3", brand: "Apple", name: "iPhone SE (3rd gen)", caseWidth: 67.3, caseHeight: 138.4, cornerRadius: 16, cameraLayout: "circle" },

  // Samsung Galaxy S
  { id: "galaxy-s25-ultra", brand: "Samsung", name: "Galaxy S25 Ultra", caseWidth: 77.6, caseHeight: 162.8, cornerRadius: 14, cameraLayout: "rect" },
  { id: "galaxy-s25-plus", brand: "Samsung", name: "Galaxy S25+", caseWidth: 75.8, caseHeight: 158.4, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-s25", brand: "Samsung", name: "Galaxy S25", caseWidth: 70.5, caseHeight: 146.9, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-s24-ultra", brand: "Samsung", name: "Galaxy S24 Ultra", caseWidth: 79, caseHeight: 162.3, cornerRadius: 14, cameraLayout: "rect" },
  { id: "galaxy-s24-plus", brand: "Samsung", name: "Galaxy S24+", caseWidth: 75.9, caseHeight: 158.5, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-s24", brand: "Samsung", name: "Galaxy S24", caseWidth: 70.6, caseHeight: 147, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-s23-ultra", brand: "Samsung", name: "Galaxy S23 Ultra", caseWidth: 78.1, caseHeight: 163.4, cornerRadius: 14, cameraLayout: "rect" },
  { id: "galaxy-s23-plus", brand: "Samsung", name: "Galaxy S23+", caseWidth: 76.2, caseHeight: 157.8, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-s23", brand: "Samsung", name: "Galaxy S23", caseWidth: 70.9, caseHeight: 146.3, cornerRadius: 16, cameraLayout: "rect" },
  // Samsung Galaxy A
  { id: "galaxy-a55", brand: "Samsung", name: "Galaxy A55", caseWidth: 77.4, caseHeight: 161.7, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-a35", brand: "Samsung", name: "Galaxy A35", caseWidth: 78.7, caseHeight: 162.1, cornerRadius: 16, cameraLayout: "rect" },
  { id: "galaxy-a15", brand: "Samsung", name: "Galaxy A15", caseWidth: 78.7, caseHeight: 160.1, cornerRadius: 14, cameraLayout: "rect" },

  // Google Pixel
  { id: "pixel-9-pro-xl", brand: "Google", name: "Pixel 9 Pro XL", caseWidth: 76.6, caseHeight: 162.8, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-9-pro", brand: "Google", name: "Pixel 9 Pro", caseWidth: 72.5, caseHeight: 152.8, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-9", brand: "Google", name: "Pixel 9", caseWidth: 72.5, caseHeight: 152.8, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-8-pro", brand: "Google", name: "Pixel 8 Pro", caseWidth: 76.5, caseHeight: 162.6, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-8", brand: "Google", name: "Pixel 8", caseWidth: 70.8, caseHeight: 150.5, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-8a", brand: "Google", name: "Pixel 8a", caseWidth: 72.7, caseHeight: 152.1, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-7-pro", brand: "Google", name: "Pixel 7 Pro", caseWidth: 76.6, caseHeight: 162.9, cornerRadius: 18, cameraLayout: "pill" },
  { id: "pixel-7", brand: "Google", name: "Pixel 7", caseWidth: 73.2, caseHeight: 155.6, cornerRadius: 18, cameraLayout: "pill" },

  // Xiaomi
  { id: "xiaomi-14-ultra", brand: "Xiaomi", name: "Xiaomi 14 Ultra", caseWidth: 75.3, caseHeight: 161.4, cornerRadius: 20, cameraLayout: "circle" },
  { id: "xiaomi-14-pro", brand: "Xiaomi", name: "Xiaomi 14 Pro", caseWidth: 75.3, caseHeight: 161.4, cornerRadius: 20, cameraLayout: "circle" },
  { id: "xiaomi-14", brand: "Xiaomi", name: "Xiaomi 14", caseWidth: 71.5, caseHeight: 152.8, cornerRadius: 18, cameraLayout: "circle" },
  { id: "xiaomi-13t-pro", brand: "Xiaomi", name: "Xiaomi 13T Pro", caseWidth: 76.0, caseHeight: 162.2, cornerRadius: 16, cameraLayout: "circle" },
  { id: "redmi-note-13-pro-plus", brand: "Xiaomi", name: "Redmi Note 13 Pro+", caseWidth: 74.2, caseHeight: 161.4, cornerRadius: 16, cameraLayout: "rect" },
  { id: "redmi-note-13-pro", brand: "Xiaomi", name: "Redmi Note 13 Pro", caseWidth: 76.2, caseHeight: 161.2, cornerRadius: 16, cameraLayout: "rect" },
  { id: "redmi-note-13", brand: "Xiaomi", name: "Redmi Note 13", caseWidth: 76.3, caseHeight: 162.2, cornerRadius: 14, cameraLayout: "rect" },
  { id: "poco-x6-pro", brand: "Xiaomi", name: "POCO X6 Pro", caseWidth: 75.5, caseHeight: 160.5, cornerRadius: 16, cameraLayout: "rect" },

  // Honor
  { id: "honor-magic6-pro", brand: "Honor", name: "Honor Magic6 Pro", caseWidth: 75.8, caseHeight: 162.5, cornerRadius: 20, cameraLayout: "circle" },
  { id: "honor-200-pro", brand: "Honor", name: "Honor 200 Pro", caseWidth: 75.2, caseHeight: 163.3, cornerRadius: 18, cameraLayout: "circle" },
  { id: "honor-200", brand: "Honor", name: "Honor 200", caseWidth: 75.2, caseHeight: 161.5, cornerRadius: 18, cameraLayout: "circle" },
  { id: "honor-x9b", brand: "Honor", name: "Honor X9b", caseWidth: 75.3, caseHeight: 161.5, cornerRadius: 16, cameraLayout: "circle" },
  { id: "honor-90", brand: "Honor", name: "Honor 90", caseWidth: 74.1, caseHeight: 161.9, cornerRadius: 18, cameraLayout: "circle" },

  // Huawei
  { id: "huawei-p60-pro", brand: "Huawei", name: "Huawei P60 Pro", caseWidth: 74.5, caseHeight: 161, cornerRadius: 20, cameraLayout: "circle" },
  { id: "huawei-nova-12", brand: "Huawei", name: "Huawei nova 12", caseWidth: 74.4, caseHeight: 162.4, cornerRadius: 18, cameraLayout: "circle" },
  { id: "huawei-mate-60-pro", brand: "Huawei", name: "Huawei Mate 60 Pro", caseWidth: 76.0, caseHeight: 162.6, cornerRadius: 20, cameraLayout: "circle" },

  // OnePlus
  { id: "oneplus-12", brand: "OnePlus", name: "OnePlus 12", caseWidth: 76.2, caseHeight: 164.3, cornerRadius: 18, cameraLayout: "circle" },
  { id: "oneplus-12r", brand: "OnePlus", name: "OnePlus 12R", caseWidth: 75.3, caseHeight: 163.3, cornerRadius: 18, cameraLayout: "circle" },
  { id: "oneplus-nord-4", brand: "OnePlus", name: "OnePlus Nord 4", caseWidth: 75, caseHeight: 162.6, cornerRadius: 16, cameraLayout: "circle" },
  { id: "oneplus-nord-ce4", brand: "OnePlus", name: "OnePlus Nord CE 4", caseWidth: 75.4, caseHeight: 162.2, cornerRadius: 16, cameraLayout: "circle" },

  // Nothing
  { id: "nothing-phone-2a", brand: "Nothing", name: "Nothing Phone (2a)", caseWidth: 76.3, caseHeight: 161.1, cornerRadius: 18, cameraLayout: "circle" },
  { id: "nothing-phone-2", brand: "Nothing", name: "Nothing Phone (2)", caseWidth: 76.4, caseHeight: 162.1, cornerRadius: 18, cameraLayout: "circle" },
  { id: "nothing-phone-1", brand: "Nothing", name: "Nothing Phone (1)", caseWidth: 75.8, caseHeight: 159.2, cornerRadius: 18, cameraLayout: "circle" },

  // Realme
  { id: "realme-gt5-pro", brand: "Realme", name: "Realme GT5 Pro", caseWidth: 75.7, caseHeight: 162, cornerRadius: 18, cameraLayout: "circle" },
  { id: "realme-12-pro-plus", brand: "Realme", name: "Realme 12 Pro+", caseWidth: 74.7, caseHeight: 161.5, cornerRadius: 16, cameraLayout: "circle" },
  { id: "realme-c67", brand: "Realme", name: "Realme C67", caseWidth: 76.1, caseHeight: 165.7, cornerRadius: 14, cameraLayout: "rect" },

  // Tecno
  { id: "tecno-camon-30-pro", brand: "Tecno", name: "Tecno Camon 30 Pro", caseWidth: 76.1, caseHeight: 163.6, cornerRadius: 16, cameraLayout: "circle" },
  { id: "tecno-spark-20-pro", brand: "Tecno", name: "Tecno Spark 20 Pro", caseWidth: 76.1, caseHeight: 163.7, cornerRadius: 14, cameraLayout: "rect" },

  // Vivo
  { id: "vivo-x100-pro", brand: "Vivo", name: "Vivo X100 Pro", caseWidth: 75.2, caseHeight: 164.1, cornerRadius: 18, cameraLayout: "circle" },
  { id: "vivo-v30-pro", brand: "Vivo", name: "Vivo V30 Pro", caseWidth: 74.5, caseHeight: 162.4, cornerRadius: 18, cameraLayout: "circle" },

  // OPPO
  { id: "oppo-find-x7-ultra", brand: "OPPO", name: "OPPO Find X7 Ultra", caseWidth: 76.2, caseHeight: 164.8, cornerRadius: 20, cameraLayout: "circle" },
  { id: "oppo-reno-11-pro", brand: "OPPO", name: "OPPO Reno 11 Pro", caseWidth: 74.8, caseHeight: 162.4, cornerRadius: 18, cameraLayout: "circle" },

  // Motorola
  { id: "moto-edge-50-ultra", brand: "Motorola", name: "Moto Edge 50 Ultra", caseWidth: 74.6, caseHeight: 161.1, cornerRadius: 18, cameraLayout: "circle" },
  { id: "moto-g84", brand: "Motorola", name: "Moto G84", caseWidth: 74.4, caseHeight: 160.3, cornerRadius: 16, cameraLayout: "rect" },
];

export const caseMaterials = [
  { id: "silicone", name: "Силикон" },
  { id: "plastic", name: "Пластик (поликарбонат)" },
  { id: "leather", name: "Кожа / Экокожа" },
  { id: "textile", name: "Текстиль / Ткань" },
  { id: "glass", name: "Закалённое стекло" },
  { id: "tpu", name: "TPU (термополиуретан)" },
  { id: "hybrid", name: "Гибридный (TPU + пластик)" },
  { id: "unknown", name: "Не знаю / моего нет в списке" },
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
  { id: "purple", name: "Фиолетовый", hex: "#7C3AED", alpha: 1 },
  { id: "navy", name: "Тёмно-синий", hex: "#1E3A5F", alpha: 1 },
  { id: "unknown", name: "Другой / не знаю", hex: "#999999", alpha: 1 },
];

export const brandGroups = phoneModels.reduce<Record<string, PhoneModel[]>>((acc, m) => {
  if (!acc[m.brand]) acc[m.brand] = [];
  acc[m.brand].push(m);
  return acc;
}, {});
