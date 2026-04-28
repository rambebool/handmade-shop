"use client";

import { useState } from "react";
import { SiteSettings } from "@/lib/types";
import { getSiteSettings, saveSiteSettings, DEFAULT_SETTINGS } from "@/lib/store";

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => getSiteSettings());
  const [message, setMessage] = useState("");

  const handleSave = () => {
    saveSiteSettings(settings);
    setMessage("Настройки сохранены");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReset = () => {
    if (!confirm("Сбросить все настройки до стандартных?")) return;
    setSettings({ ...DEFAULT_SETTINGS });
    saveSiteSettings(DEFAULT_SETTINGS);
    setMessage("Настройки сброшены");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="border-2 border-black/80 bg-[#00E5FF] px-4 py-2 font-mono text-sm font-bold">
          {message}
        </div>
      )}

      {/* Colors */}
      <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA] md:p-6">
        <h2 className="mb-4 font-mono text-lg font-black uppercase">Цвета и стили</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Основной цвет</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="h-10 w-10 cursor-pointer border-2 border-black/80"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 border-2 border-black/80 bg-[#F4F1EA] px-2 py-1 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Акцентный цвет</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="h-10 w-10 cursor-pointer border-2 border-black/80"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="flex-1 border-2 border-black/80 bg-[#F4F1EA] px-2 py-1 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Фон сайта</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                className="h-10 w-10 cursor-pointer border-2 border-black/80"
              />
              <input
                type="text"
                value={settings.bgColor}
                onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                className="flex-1 border-2 border-black/80 bg-[#F4F1EA] px-2 py-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 border-2 border-dashed border-gray-300 p-4">
          <p className="mb-2 font-mono text-xs uppercase text-gray-400">Предпросмотр цветов:</p>
          <div className="flex gap-2">
            <div className="h-12 w-12 border-2 border-black/80" style={{ background: settings.primaryColor }} title="Основной" />
            <div className="h-12 w-12 border-2 border-black/80" style={{ background: settings.accentColor }} title="Акцентный" />
            <div className="h-12 w-12 border-2 border-black/80" style={{ background: settings.bgColor }} title="Фон" />
          </div>
        </div>
      </div>

      {/* Texts */}
      <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA] md:p-6">
        <h2 className="mb-4 font-mono text-lg font-black uppercase">Тексты сайта</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Заголовок героя</label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Подзаголовок героя</label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Бейдж промоакции</label>
            <input
              type="text"
              value={settings.heroBadge}
              onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">Текст подвала</label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="border-2 border-black/80 bg-[#FF4D00] px-6 py-2 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A] transition-all hover:shadow-[1px_1px_0px_#1A1A1A]"
        >
          Сохранить настройки
        </button>
        <button
          onClick={handleReset}
          className="border-2 border-black/80 bg-white px-6 py-2 font-mono text-sm font-bold uppercase text-[#1A1A1A] transition-all hover:bg-gray-100"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
