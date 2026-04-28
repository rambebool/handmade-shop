"use client";

import { useState } from "react";
import { AdBlock } from "@/lib/types";
import { getAds, saveAd, deleteAd } from "@/lib/store";

const PLACEMENTS: { value: AdBlock["placement"]; label: string }[] = [
  { value: "header", label: "Шапка сайта" },
  { value: "home-banner", label: "Баннер на главной" },
  { value: "catalog-top", label: "Каталог (сверху)" },
  { value: "catalog-side", label: "Каталог (сбоку)" },
  { value: "product-bottom", label: "Страница товара (снизу)" },
  { value: "footer", label: "Подвал сайта" },
];

const emptyAd: Omit<AdBlock, "id" | "createdAt"> = {
  title: "",
  content: "",
  imageUrl: "",
  linkUrl: "",
  placement: "home-banner",
  active: true,
};

export default function AdminAds() {
  const [ads, setAds] = useState<AdBlock[]>(() => getAds());
  const [form, setForm] = useState({ ...emptyAd });
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    const ad: AdBlock = {
      ...form,
      id: editing || `ad-${Date.now()}`,
      createdAt: editing
        ? (ads.find((a) => a.id === editing)?.createdAt || new Date().toISOString())
        : new Date().toISOString(),
    };
    const updated = saveAd(ad);
    setAds(updated);
    setForm({ ...emptyAd });
    setEditing(null);
    flash(editing ? "Рекламный блок обновлён" : "Рекламный блок добавлен");
  };

  const handleEdit = (ad: AdBlock) => {
    setForm({
      title: ad.title,
      content: ad.content,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      placement: ad.placement,
      active: ad.active,
    });
    setEditing(ad.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Удалить рекламный блок?")) return;
    const updated = deleteAd(id);
    setAds(updated);
    flash("Рекламный блок удалён");
  };

  const handleToggle = (ad: AdBlock) => {
    const updated = saveAd({ ...ad, active: !ad.active });
    setAds(updated);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="border-2 border-black/80 bg-[#00E5FF] px-4 py-2 font-mono text-sm font-bold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-2 border-black/80 bg-white p-4 shadow-[6px_6px_0px_#F4F1EA] md:p-6">
        <h2 className="mb-4 font-mono text-lg font-black uppercase">
          {editing ? "Редактировать блок" : "Добавить рекламный блок"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Заголовок *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="Скидка 20%"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Размещение</label>
            <select
              value={form.placement}
              onChange={(e) => setForm({ ...form, placement: e.target.value as AdBlock["placement"] })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm"
            >
              {PLACEMENTS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Содержимое (HTML/текст) *</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={3}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="Используйте промокод SALE20..."
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">URL изображения</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">URL ссылки</label>
            <input
              type="url"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="h-4 w-4 accent-[#FF4D00]"
            />
            <span className="font-mono text-xs">Активен</span>
          </label>
          <button
            type="submit"
            className="border-2 border-black/80 bg-[#FF4D00] px-6 py-2 font-mono text-xs font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A]"
          >
            {editing ? "Обновить" : "Добавить"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => { setForm({ ...emptyAd }); setEditing(null); }}
              className="font-mono text-xs text-gray-500 underline hover:text-black"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* Ad list */}
      <div className="space-y-3">
        {ads.length === 0 ? (
          <p className="font-mono text-sm text-gray-500 text-center py-8">Нет рекламных блоков</p>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className={`border-2 p-3 ${ad.active ? "border-black/80 bg-white" : "border-gray-300 bg-gray-50 opacity-60"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-sm font-bold">{ad.title}</span>
                  <span className="ml-2 font-mono text-xs text-gray-400">
                    [{PLACEMENTS.find((p) => p.value === ad.placement)?.label}]
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggle(ad)} className="font-mono text-xs text-gray-500 hover:text-black">
                    {ad.active ? "Выкл." : "Вкл."}
                  </button>
                  <button onClick={() => handleEdit(ad)} className="font-mono text-xs text-[#FF4D00] hover:underline">
                    Ред.
                  </button>
                  <button onClick={() => handleDelete(ad.id)} className="font-mono text-xs font-bold text-red-500">
                    ✕
                  </button>
                </div>
              </div>
              <p className="mt-1 font-mono text-xs text-gray-500 line-clamp-2">{ad.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
