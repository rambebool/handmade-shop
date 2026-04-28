"use client";

import { useState, useSyncExternalStore } from "react";
import { Product } from "@/lib/types";
import {
  getAdminProducts,
  saveAdminProduct,
  deleteAdminProduct,
  getCategories,
} from "@/lib/store";

const emptyProduct: Product = {
  id: "",
  name: "",
  price: 0,
  category: "Керамика",
  specs: [],
  image: "/placeholder-mug.svg",
  badge: "",
  description: "",
  inStock: true,
};

let adminVersion = 0;
const listeners = new Set<() => void>();

function notifyAdmin() {
  adminVersion++;
  listeners.forEach((cb) => cb());
}

function subscribeAdmin(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const SERVER_ADMIN: Product[] = [];

let cachedAdminSnapshot: Product[] = SERVER_ADMIN;
let cachedAdminKey = "";

function getAdminSnapshot(): Product[] {
  const fresh = getAdminProducts();
  const key = `${adminVersion}:${JSON.stringify(fresh)}`;
  if (key !== cachedAdminKey) {
    cachedAdminKey = key;
    cachedAdminSnapshot = fresh;
  }
  return cachedAdminSnapshot;
}

function getAdminServerSnapshot(): Product[] {
  return SERVER_ADMIN;
}

export default function AdminForm() {
  const products = useSyncExternalStore(
    subscribeAdmin,
    getAdminSnapshot,
    getAdminServerSnapshot
  );
  const [form, setForm] = useState<Product>({ ...emptyProduct });
  const [specsText, setSpecsText] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [categories] = useState<string[]>(() => getCategories().map((c) => c.name));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...form,
      id: form.id || `admin-${Date.now()}`,
      specs: specsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    saveAdminProduct(product);
    notifyAdmin();
    setForm({ ...emptyProduct });
    setSpecsText("");
    setEditing(false);
    setMessage(editing ? "Товар обновлён" : "Товар добавлен");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setSpecsText(product.specs.join("\n"));
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить товар?")) {
      deleteAdminProduct(id);
      notifyAdmin();
      if (form.id === id) {
        setForm({ ...emptyProduct });
        setSpecsText("");
        setEditing(false);
      }
      setMessage("Товар удалён");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setForm({ ...emptyProduct });
    setSpecsText("");
    setEditing(false);
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className="border-2 border-black/80 bg-[#00E5FF] px-4 py-2 font-mono text-sm font-bold text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-2 border-black/80 bg-white p-4 shadow-[6px_6px_0px_#F4F1EA] md:p-6"
      >
        <h2 className="mb-4 font-mono text-lg font-black uppercase text-[#1A1A1A]">
          {editing ? "Редактировать товар" : "Добавить товар"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Название *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="Керамическая кружка"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Цена (₽) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.price || ""}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="1800"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Категория
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Бейдж
            </label>
            <input
              type="text"
              value={form.badge || ""}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="Хит, Новинка, -20%"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Описание
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="Описание товара..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Характеристики (каждая с новой строки)
            </label>
            <textarea
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              rows={4}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder={"Объём: 350 мл\nМатериал: глина\nРучная работа"}
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              URL изображения
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="/placeholder-mug.svg"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 font-mono text-sm font-bold">
              <input
                type="checkbox"
                checked={form.inStock ?? true}
                onChange={(e) =>
                  setForm({ ...form, inStock: e.target.checked })
                }
                className="h-4 w-4 accent-[#FF4D00]"
              />
              В наличии
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="border-2 border-black/80 bg-[#FF4D00] px-6 py-2 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_#1A1A1A] transition-all hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            {editing ? "Сохранить" : "Добавить"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancel}
              className="border-2 border-black/80 bg-white px-6 py-2 font-mono text-sm font-bold uppercase text-[#1A1A1A] shadow-[4px_4px_0px_#F4F1EA] transition-all hover:shadow-[2px_2px_0px_#F4F1EA] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {products.length > 0 && (
        <div>
          <h2 className="mb-4 font-mono text-lg font-black uppercase text-[#1A1A1A]">
            Добавленные товары ({products.length})
          </h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-2 border-black/80 bg-white p-3 shadow-[3px_3px_0px_#F4F1EA]"
              >
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#1A1A1A]">
                    {p.name}
                  </h3>
                  <p className="font-mono text-xs text-gray-500">
                    {p.category} · {p.price.toLocaleString("ru-RU")} ₽
                    {p.inStock === false && " · Нет в наличии"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="border-2 border-black/80 bg-[#00E5FF] px-3 py-1 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#1A1A1A] transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    Ред.
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="border-2 border-black/80 bg-[#FF4D00] px-3 py-1 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#1A1A1A] transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
