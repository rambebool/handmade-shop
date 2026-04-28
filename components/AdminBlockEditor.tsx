"use client";

import { useState, useRef } from "react";
import { PageBlock, PageBlockType } from "@/lib/types";
import { getPageLayout, savePageLayout, AVAILABLE_PAGES } from "@/lib/store";

let blockIdCounter = 0;
function nextBlockId(): string {
  blockIdCounter++;
  return "blk-" + blockIdCounter + "-" + String(performance.now()).replace(".", "");
}

const BLOCK_TYPES: { type: PageBlockType; label: string; icon: string }[] = [
  { type: "heading", label: "Заголовок", icon: "H" },
  { type: "text", label: "Текст", icon: "T" },
  { type: "image", label: "Изображение", icon: "🖼" },
  { type: "banner", label: "Баннер", icon: "📢" },
  { type: "button", label: "Кнопка", icon: "▶" },
  { type: "columns", label: "Колонки", icon: "▥" },
  { type: "divider", label: "Разделитель", icon: "—" },
  { type: "spacer", label: "Отступ", icon: "↕" },
  { type: "html", label: "HTML", icon: "</>" },
];

function defaultProps(type: PageBlockType): Record<string, string> {
  switch (type) {
    case "heading": return { text: "Новый заголовок", size: "24px", color: "#1A1A1A", align: "left" };
    case "text": return { text: "Текст абзаца...", color: "#374151", align: "left" };
    case "image": return { src: "", alt: "", maxHeight: "400px", align: "center" };
    case "banner": return { text: "Акция!", subtitle: "", bgColor: "#FF4D00", textColor: "#ffffff", linkUrl: "", linkText: "" };
    case "button": return { text: "Кнопка", linkUrl: "/catalog", bgColor: "#FF4D00", textColor: "#ffffff", align: "center" };
    case "columns": return { count: "2", col1: "Колонка 1", col2: "Колонка 2", col3: "" };
    case "divider": return { color: "#1A1A1A", thickness: "2px" };
    case "spacer": return { height: "40px" };
    case "html": return { content: "<p>HTML содержимое</p>" };
    default: return {};
  }
}

const PROP_LABELS: Record<string, string> = {
  text: "Текст",
  size: "Размер (px)",
  color: "Цвет текста",
  align: "Выравнивание",
  src: "URL изображения",
  alt: "Alt текст",
  maxHeight: "Макс. высота",
  bgColor: "Цвет фона",
  textColor: "Цвет текста",
  linkUrl: "Ссылка",
  linkText: "Текст ссылки",
  subtitle: "Подзаголовок",
  count: "Кол-во колонок",
  col1: "Колонка 1",
  col2: "Колонка 2",
  col3: "Колонка 3",
  thickness: "Толщина",
  height: "Высота",
  content: "HTML",
};

export default function AdminBlockEditor() {
  const [selectedPage, setSelectedPage] = useState(AVAILABLE_PAGES[0].id);
  const [blocks, setBlocks] = useState<PageBlock[]>(() => getPageLayout(selectedPage));
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const loadPage = (pageId: string) => {
    setSelectedPage(pageId);
    setBlocks(getPageLayout(pageId));
    setEditingBlock(null);
  };

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const addBlock = (type: PageBlockType) => {
    const newBlock: PageBlock = {
      id: nextBlockId(),
      type,
      props: defaultProps(type),
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (editingBlock === id) setEditingBlock(null);
  };

  const updateBlockProp = (blockId: string, key: string, value: string) => {
    setBlocks(blocks.map((b) =>
      b.id === blockId ? { ...b, props: { ...b.props, [key]: value } } : b
    ));
  };

  const moveBlock = (fromIdx: number, toIdx: number) => {
    const updated = [...blocks];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setBlocks(updated);
  };

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };

  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      moveBlock(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSave = () => {
    savePageLayout(selectedPage, blocks);
    flash("Макет сохранён!");
  };

  const duplicateBlock = (id: string) => {
    const original = blocks.find((b) => b.id === id);
    if (!original) return;
    const copy: PageBlock = {
      ...original,
      id: nextBlockId(),
      props: { ...original.props },
    };
    const idx = blocks.findIndex((b) => b.id === id);
    const updated = [...blocks];
    updated.splice(idx + 1, 0, copy);
    setBlocks(updated);
  };

  const editBlock = blocks.find((b) => b.id === editingBlock);

  return (
    <div className="space-y-4">
      {message && (
        <div className="border-2 border-black/80 bg-[#00E5FF] px-4 py-2 font-mono text-sm font-bold">
          {message}
        </div>
      )}

      {/* Page selector */}
      <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
        <h2 className="mb-3 font-mono text-lg font-black uppercase">Конструктор страниц</h2>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => loadPage(page.id)}
              className={`border-2 border-black/80 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all ${
                selectedPage === page.id
                  ? "bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#FF4D00]"
                  : "bg-white hover:shadow-[3px_3px_0px_#00E5FF]"
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>

      {/* Block palette */}
      <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
        <h3 className="mb-3 font-mono text-sm font-bold uppercase text-gray-500">
          Добавить блок
        </h3>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              onClick={() => addBlock(bt.type)}
              className="flex items-center gap-1.5 border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-xs font-bold transition-all hover:bg-[#FF4D00] hover:text-white hover:shadow-[2px_2px_0px_#1A1A1A]"
            >
              <span>{bt.icon}</span>
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Block list (drag-and-drop) */}
      <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-mono text-sm font-bold uppercase text-gray-500">
            Блоки ({blocks.length})
          </h3>
          <button
            onClick={handleSave}
            className="border-2 border-black/80 bg-[#FF4D00] px-4 py-1.5 font-mono text-xs font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A] transition-all hover:shadow-[1px_1px_0px_#1A1A1A]"
          >
            Сохранить
          </button>
        </div>

        {blocks.length === 0 && (
          <p className="py-8 text-center font-mono text-sm text-gray-400">
            Нет блоков. Добавьте блоки из палитры выше.
          </p>
        )}

        <div className="space-y-2">
          {blocks.map((block, idx) => {
            const bt = BLOCK_TYPES.find((t) => t.type === block.type);
            return (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`flex items-center gap-2 border-2 p-2 transition-all cursor-grab active:cursor-grabbing ${
                  editingBlock === block.id
                    ? "border-[#FF4D00] bg-orange-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className="font-mono text-sm text-gray-400 cursor-grab" title="Перетащить">
                  ⠿
                </span>
                <span className="font-mono text-sm">{bt?.icon}</span>
                <span className="flex-1 font-mono text-xs font-bold uppercase">
                  {bt?.label}
                  {block.props.text ? `: ${block.props.text.slice(0, 30)}` : ""}
                </span>

                {/* Move buttons */}
                <button
                  onClick={() => idx > 0 && moveBlock(idx, idx - 1)}
                  disabled={idx === 0}
                  className="font-mono text-xs text-gray-400 hover:text-black disabled:opacity-30"
                  title="Вверх"
                >
                  ↑
                </button>
                <button
                  onClick={() => idx < blocks.length - 1 && moveBlock(idx, idx + 1)}
                  disabled={idx === blocks.length - 1}
                  className="font-mono text-xs text-gray-400 hover:text-black disabled:opacity-30"
                  title="Вниз"
                >
                  ↓
                </button>

                <button
                  onClick={() => setEditingBlock(editingBlock === block.id ? null : block.id)}
                  className="font-mono text-xs text-gray-500 hover:text-[#FF4D00]"
                >
                  Ред.
                </button>
                <button
                  onClick={() => duplicateBlock(block.id)}
                  className="font-mono text-xs text-gray-500 hover:text-[#00E5FF]"
                  title="Дублировать"
                >
                  ⧉
                </button>
                <button
                  onClick={() => removeBlock(block.id)}
                  className="font-mono text-xs font-bold text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block property editor */}
      {editBlock && (
        <div className="border-2 border-[#FF4D00] bg-white p-4 shadow-[4px_4px_0px_#FF4D00]">
          <h3 className="mb-3 font-mono text-sm font-bold uppercase text-[#FF4D00]">
            Редактирование: {BLOCK_TYPES.find((t) => t.type === editBlock.type)?.label}
          </h3>
          <div className="space-y-3">
            {Object.entries(editBlock.props).map(([key, value]) => {
              const label = PROP_LABELS[key] || key;

              if (key === "align") {
                return (
                  <div key={key}>
                    <label className="font-mono text-xs font-bold uppercase text-gray-500">{label}</label>
                    <select
                      value={value}
                      onChange={(e) => updateBlockProp(editBlock.id, key, e.target.value)}
                      className="mt-1 w-full border-2 border-black/80 px-2 py-1.5 font-mono text-sm"
                    >
                      <option value="left">Лево</option>
                      <option value="center">Центр</option>
                      <option value="right">Право</option>
                    </select>
                  </div>
                );
              }

              if (key === "content") {
                return (
                  <div key={key}>
                    <label className="font-mono text-xs font-bold uppercase text-gray-500">{label}</label>
                    <textarea
                      value={value}
                      onChange={(e) => updateBlockProp(editBlock.id, key, e.target.value)}
                      rows={4}
                      className="mt-1 w-full border-2 border-black/80 px-2 py-1.5 font-mono text-sm"
                    />
                  </div>
                );
              }

              if (key.includes("olor")) {
                return (
                  <div key={key} className="flex items-center gap-2">
                    <label className="font-mono text-xs font-bold uppercase text-gray-500">{label}</label>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateBlockProp(editBlock.id, key, e.target.value)}
                      className="h-8 w-8 cursor-pointer border-2 border-black/80"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateBlockProp(editBlock.id, key, e.target.value)}
                      className="flex-1 border-2 border-black/80 px-2 py-1 font-mono text-xs"
                    />
                  </div>
                );
              }

              return (
                <div key={key}>
                  <label className="font-mono text-xs font-bold uppercase text-gray-500">{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateBlockProp(editBlock.id, key, e.target.value)}
                    className="mt-1 w-full border-2 border-black/80 px-2 py-1.5 font-mono text-sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
