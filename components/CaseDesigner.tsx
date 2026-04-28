"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PhoneModel, DesignLayer } from "@/lib/types";
import { phoneModels, caseColors, brandGroups } from "@/lib/phone-models";

const CANVAS_W = 300;
const CANVAS_H = 600;
const CASE_PADDING = 20;

function scaleCase(model: PhoneModel) {
  const aspect = model.caseWidth / model.caseHeight;
  const maxH = CANVAS_H - CASE_PADDING * 2;
  const maxW = CANVAS_W - CASE_PADDING * 2;
  let h = maxH;
  let w = h * aspect;
  if (w > maxW) {
    w = maxW;
    h = w / aspect;
  }
  const x = (CANVAS_W - w) / 2;
  const y = (CANVAS_H - h) / 2;
  const r = (model.cornerRadius / model.caseHeight) * h;
  return { x, y, w, h, r };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCamera(
  ctx: CanvasRenderingContext2D,
  layout: PhoneModel["cameraLayout"],
  cx: number,
  cy: number,
  cw: number
) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  const camX = cx + cw * 0.08;
  const camY = cy + cw * 0.08;
  const unit = cw * 0.12;

  if (layout === "island") {
    drawRoundedRect(ctx, camX, camY, unit * 2.5, unit * 2.5, unit * 0.4);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(camX + unit * 0.8, camY + unit * 0.8, unit * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(camX + unit * 1.7, camY + unit * 0.8, unit * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(camX + unit * 0.8, camY + unit * 1.7, unit * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (layout === "pill") {
    drawRoundedRect(ctx, camX, camY, unit * 2.5, unit * 1.2, unit * 0.4);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(camX + unit * 0.8, camY + unit * 0.6, unit * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(camX + unit * 1.7, camY + unit * 0.6, unit * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (layout === "circle") {
    ctx.beginPath();
    ctx.arc(camX + unit * 1.2, camY + unit * 1.2, unit * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(camX + unit * 1.2, camY + unit * 1.2, unit * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    drawRoundedRect(ctx, camX, camY, unit * 1.4, unit * 3.2, unit * 0.3);
    ctx.fill();
    ctx.stroke();
    const lensX = camX + unit * 0.7;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(lensX, camY + unit * 0.6 + i * unit * 0.9, unit * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.restore();
}

export default function CaseDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [caseColorId, setCaseColorId] = useState("white");
  const [layers, setLayers] = useState<DesignLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#1A1A1A");
  const [textSize, setTextSize] = useState(24);
  const [externalLink, setExternalLink] = useState("");
  const [sendOwnCase, setSendOwnCase] = useState(false);

  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});
  const [message, setMessage] = useState("");

  const caseColor = caseColors.find((c) => c.id === caseColorId) || caseColors[0];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedModel) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = "#E5E5E5";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_W; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_H);
      ctx.stroke();
    }
    for (let j = 0; j < CANVAS_H; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(CANVAS_W, j);
      ctx.stroke();
    }

    const { x, y, w, h, r } = scaleCase(selectedModel);

    ctx.save();
    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.clip();

    if (caseColor.alpha < 1) {
      const sz = 10;
      for (let i = 0; i < w / sz + 1; i++) {
        for (let j = 0; j < h / sz + 1; j++) {
          ctx.fillStyle = (i + j) % 2 === 0 ? "#fff" : "#ddd";
          ctx.fillRect(x + i * sz, y + j * sz, sz, sz);
        }
      }
      ctx.fillStyle = `rgba(255,255,255,${caseColor.alpha})`;
    } else {
      ctx.fillStyle = caseColor.hex;
    }
    ctx.fillRect(x, y, w, h);

    for (const layer of layers) {
      if (layer.type === "image" && layer.imageData) {
        const img = loadedImages[layer.id];
        if (img) {
          ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
        }
      } else if (layer.type === "text") {
        ctx.fillStyle = layer.color || "#1A1A1A";
        ctx.font = `bold ${layer.fontSize || 24}px monospace`;
        ctx.textBaseline = "top";
        ctx.fillText(layer.content, layer.x, layer.y);
      }
    }

    ctx.restore();

    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 3;
    ctx.stroke();

    drawCamera(ctx, selectedModel.cameraLayout, x, y, w);

    if (activeLayerId) {
      const layer = layers.find((l) => l.id === activeLayerId);
      if (layer) {
        ctx.save();
        ctx.strokeStyle = "#FF4D00";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        if (layer.type === "image") {
          ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);
          ctx.fillStyle = "#FF4D00";
          ctx.fillRect(layer.x + layer.width - 6, layer.y + layer.height - 6, 12, 12);
        } else {
          ctx.font = `bold ${layer.fontSize || 24}px monospace`;
          const m = ctx.measureText(layer.content);
          ctx.strokeRect(layer.x - 2, layer.y - 2, m.width + 4, (layer.fontSize || 24) + 4);
        }
        ctx.restore();
      }
    }
  }, [selectedModel, caseColor, layers, activeLayerId, loadedImages]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedModel) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const { x, y, w, h } = scaleCase(selectedModel);
        const aspect = img.width / img.height;
        let lw = w * 0.6;
        let lh = lw / aspect;
        if (lh > h * 0.6) {
          lh = h * 0.6;
          lw = lh * aspect;
        }
        const lx = x + (w - lw) / 2;
        const ly = y + (h - lh) / 2;
        const id = `img-${Date.now()}`;
        const newLayer: DesignLayer = {
          id,
          type: "image",
          x: lx,
          y: ly,
          width: lw,
          height: lh,
          rotation: 0,
          content: file.name,
          imageData: dataUrl,
        };
        setLoadedImages((prev) => ({ ...prev, [id]: img }));
        setLayers((prev) => [...prev, newLayer]);
        setActiveLayerId(id);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddText = () => {
    if (!textInput.trim() || !selectedModel) return;
    const { x, y, w, h } = scaleCase(selectedModel);
    const id = `txt-${Date.now()}`;
    const newLayer: DesignLayer = {
      id,
      type: "text",
      x: x + w * 0.1,
      y: y + h * 0.4,
      width: 0,
      height: 0,
      rotation: 0,
      content: textInput,
      fontSize: textSize,
      fontFamily: "monospace",
      color: textColor,
    };
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(id);
    setTextInput("");
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (CANVAS_W / rect.width);
    const my = (e.clientY - rect.top) * (CANVAS_H / rect.height);

    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      if (l.type === "image") {
        const rszX = l.x + l.width - 6;
        const rszY = l.y + l.height - 6;
        if (l.id === activeLayerId && mx >= rszX && mx <= rszX + 12 && my >= rszY && my <= rszY + 12) {
          setResizing(true);
          setDragOffset({ x: mx - l.width, y: my - l.height });
          return;
        }
        if (mx >= l.x && mx <= l.x + l.width && my >= l.y && my <= l.y + l.height) {
          setActiveLayerId(l.id);
          setDragging(true);
          setDragOffset({ x: mx - l.x, y: my - l.y });
          return;
        }
      } else if (l.type === "text") {
        const fs = l.fontSize || 24;
        const tw = l.content.length * fs * 0.6;
        if (mx >= l.x && mx <= l.x + tw && my >= l.y && my <= l.y + fs) {
          setActiveLayerId(l.id);
          setDragging(true);
          setDragOffset({ x: mx - l.x, y: my - l.y });
          return;
        }
      }
    }
    setActiveLayerId(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeLayerId || (!dragging && !resizing)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (CANVAS_W / rect.width);
    const my = (e.clientY - rect.top) * (CANVAS_H / rect.height);

    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== activeLayerId) return l;
        if (resizing && l.type === "image") {
          const newW = Math.max(20, mx - dragOffset.x);
          const newH = Math.max(20, my - dragOffset.y);
          return { ...l, width: newW, height: newH };
        }
        if (dragging) {
          return { ...l, x: mx - dragOffset.x, y: my - dragOffset.y };
        }
        return l;
      })
    );
  };

  const handleCanvasMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const deleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayerId === id) setActiveLayerId(null);
    setLoadedImages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const moveLayer = (id: string, dir: "up" | "down") => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx + 1 : idx - 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  const handleOrder = () => {
    if (!selectedModel) return;
    const parts = [
      `Модель: ${selectedModel.brand} ${selectedModel.name}`,
      `Цвет чехла: ${caseColor.name}`,
      `Слоёв дизайна: ${layers.length}`,
    ];
    if (externalLink) parts.push(`Ссылка на чехол: ${externalLink}`);
    if (sendOwnCase) parts.push("Клиент пришлёт свой чехол по почте");
    alert(`Заказ оформлен!\n\n${parts.join("\n")}\n\nМы свяжемся с вами для уточнения деталей.`);
    setMessage("Заказ отправлен! Мы свяжемся с вами.");
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-mono text-3xl font-black uppercase text-[#1A1A1A] md:text-4xl">
        Нарисуй свой чехол
      </h1>
      <p className="mt-1 font-mono text-sm text-gray-500">
        Выбери модель, загрузи изображение, добавь текст — создай уникальный дизайн
      </p>

      {message && (
        <div className="mt-4 border-2 border-black/80 bg-[#00E5FF] p-3 font-mono text-sm font-bold">
          {message}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left column: controls */}
        <div className="space-y-6">
          {/* Phone model selector */}
          <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
            <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
              1. Выбери модель телефона
            </h2>
            <select
              value={selectedModel?.id || ""}
              onChange={(e) => {
                const m = phoneModels.find((p) => p.id === e.target.value) || null;
                setSelectedModel(m);
                setLayers([]);
                setActiveLayerId(null);
              }}
              className="w-full border-2 border-black/80 bg-white px-3 py-2 font-mono text-sm"
            >
              <option value="">— Выбрать модель —</option>
              {Object.entries(brandGroups).map(([brand, models]) => (
                <optgroup key={brand} label={brand}>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedModel && (
            <>
              {/* Case color */}
              <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
                <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                  2. Цвет чехла
                </h2>
                <div className="flex flex-wrap gap-2">
                  {caseColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCaseColorId(c.id)}
                      title={c.name}
                      className={`h-8 w-8 border-2 transition-all ${
                        caseColorId === c.id
                          ? "border-[#FF4D00] shadow-[2px_2px_0px_#FF4D00] scale-110"
                          : "border-black/40 hover:border-black/80"
                      }`}
                      style={{
                        background:
                          c.alpha < 1
                            ? "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50%/16px 16px"
                            : c.hex,
                      }}
                    />
                  ))}
                </div>
                <p className="mt-1 font-mono text-xs text-gray-400">
                  {caseColor.name}
                </p>
              </div>

              {/* Image upload */}
              <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
                <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                  3. Загрузи изображение
                </h2>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-black/80 bg-[#FF4D00] px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A] transition-all hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  Загрузить .png / .jpeg
                </button>
                <p className="mt-2 font-mono text-xs text-gray-400">
                  Перетащите изображение на чехле для позиционирования.
                  Тяните за угол для масштабирования.
                </p>
              </div>

              {/* Text tool */}
              <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
                <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                  4. Добавить текст
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Введите текст..."
                    className="flex-1 border-2 border-black/80 px-3 py-2 font-mono text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddText();
                    }}
                  />
                  <button
                    onClick={handleAddText}
                    disabled={!textInput.trim()}
                    className="border-2 border-black/80 bg-[#1A1A1A] px-3 py-2 font-mono text-xs font-bold uppercase text-white disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    +
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <label className="font-mono text-xs text-gray-500">Размер:</label>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-mono text-xs">{textSize}px</span>
                  <label className="font-mono text-xs text-gray-500">Цвет:</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-6 w-6 cursor-pointer border-2 border-black/80"
                  />
                </div>
              </div>

              {/* Layers list */}
              {layers.length > 0 && (
                <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
                  <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                    Слои ({layers.length})
                  </h2>
                  <div className="space-y-2">
                    {layers.map((layer, idx) => (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayerId(layer.id)}
                        className={`flex items-center gap-2 border-2 p-2 cursor-pointer transition-all ${
                          activeLayerId === layer.id
                            ? "border-[#FF4D00] bg-orange-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <span className="font-mono text-xs font-bold text-gray-400">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-xs uppercase text-gray-500">
                          {layer.type === "image" ? "IMG" : "TXT"}
                        </span>
                        <span className="flex-1 truncate font-mono text-xs">
                          {layer.content}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, "up"); }}
                          className="font-mono text-xs text-gray-400 hover:text-black"
                          title="Наверх"
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, "down"); }}
                          className="font-mono text-xs text-gray-400 hover:text-black"
                          title="Вниз"
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                          className="font-mono text-xs font-bold text-red-500 hover:text-red-700"
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra options */}
              <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
                <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                  Дополнительно
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="font-mono text-xs text-gray-600">
                      Ссылка на чехол из другого магазина (если у нас нет нужного):
                    </label>
                    <input
                      type="url"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 w-full border-2 border-black/80 px-3 py-2 font-mono text-sm"
                    />
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendOwnCase}
                      onChange={(e) => setSendOwnCase(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[#FF4D00]"
                    />
                    <span className="font-mono text-xs text-gray-600">
                      Пришлю свой чехол по почте — разрисуйте и отправьте обратно
                    </span>
                  </label>
                </div>
              </div>

              {/* Order button */}
              <button
                onClick={handleOrder}
                className="w-full border-2 border-black/80 bg-[#FF4D00] py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_#1A1A1A] transition-all hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                Оформить заказ
              </button>
            </>
          )}
        </div>

        {/* Right column: canvas preview */}
        <div className="lg:sticky lg:top-24">
          <div className="border-2 border-black/80 bg-white p-3 shadow-[4px_4px_0px_#1A1A1A]">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                Предпросмотр
              </span>
              {selectedModel && (
                <span className="font-mono text-xs text-gray-400">
                  {selectedModel.brand} {selectedModel.name}
                </span>
              )}
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="w-full cursor-crosshair border-2 border-gray-200"
              style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
            />
            {!selectedModel && (
              <div className="mt-3 text-center">
                <p className="font-mono text-sm text-gray-400">
                  ← Выберите модель телефона
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
