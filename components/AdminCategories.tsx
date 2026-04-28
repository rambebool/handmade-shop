"use client";

import { useState } from "react";
import { Category } from "@/lib/types";
import { getCategories, addCategory, deleteCategory, updateCategory } from "@/lib/store";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(() => getCategories());
  const [newCatName, setNewCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState("");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    const updated = addCategory(newCatName.trim());
    setCategories(updated);
    setNewCatName("");
    flash("Категория добавлена");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Удалить категорию?")) return;
    const updated = deleteCategory(id);
    setCategories(updated);
    flash("Категория удалена");
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    const updated = updateCategory(id, editName.trim());
    setCategories(updated);
    setEditingId(null);
    flash("Категория обновлена");
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="border-2 border-black/80 bg-[#00E5FF] px-4 py-2 font-mono text-sm font-bold">
          {message}
        </div>
      )}

      <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
        <h2 className="mb-4 font-mono text-lg font-black uppercase">
          Категории ({categories.length})
        </h2>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Новая категория..."
            className="flex-1 border-2 border-black/80 px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          />
          <button
            onClick={handleAdd}
            disabled={!newCatName.trim()}
            className="border-2 border-black/80 bg-[#FF4D00] px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A] transition-all hover:shadow-[1px_1px_0px_#1A1A1A] disabled:bg-gray-300 disabled:shadow-none"
          >
            Добавить
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 border-2 border-gray-200 p-2">
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border-2 border-black/80 px-2 py-1 font-mono text-sm"
                    onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(cat.id); }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="font-mono text-xs font-bold text-green-600 hover:text-green-800"
                  >
                    Сохр.
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="font-mono text-xs text-gray-500 hover:text-black"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-mono text-sm">{cat.name}</span>
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="font-mono text-xs text-gray-500 hover:text-[#FF4D00]"
                  >
                    Ред.
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="font-mono text-xs font-bold text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
