"use client";

import { useSyncExternalStore } from "react";
import { PageBlock } from "@/lib/types";
import { getPageLayout } from "@/lib/store";

function subscribe(cb: () => void) {
  window.addEventListener("layout-update", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("layout-update", cb);
    window.removeEventListener("storage", cb);
  };
}

const cacheMap = new Map<string, { key: string; val: PageBlock[] }>();

function makeSnapshot(pageId: string) {
  return () => {
    const fresh = getPageLayout(pageId);
    const key = JSON.stringify(fresh);
    const cached = cacheMap.get(pageId);
    if (cached && cached.key === key) return cached.val;
    cacheMap.set(pageId, { key, val: fresh });
    return fresh;
  };
}

const EMPTY: PageBlock[] = [];

function BlockRenderer({ block }: { block: PageBlock }) {
  const p = block.props;

  switch (block.type) {
    case "heading":
      return (
        <div style={{ textAlign: (p.align as "left" | "center" | "right") || "left" }}>
          <h2
            className="font-mono font-black uppercase text-[#1A1A1A]"
            style={{ fontSize: p.size || "24px", color: p.color || "#1A1A1A" }}
          >
            {p.text || "Заголовок"}
          </h2>
        </div>
      );

    case "text":
      return (
        <div
          className="font-mono text-sm leading-relaxed text-gray-700"
          style={{ textAlign: (p.align as "left" | "center" | "right") || "left", color: p.color || undefined }}
        >
          {p.text || "Текст"}
        </div>
      );

    case "image":
      return (
        <div style={{ textAlign: (p.align as "left" | "center" | "right") || "center" }}>
          {p.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.src}
              alt={p.alt || ""}
              className="inline-block max-w-full border-2 border-black/80"
              style={{ maxHeight: p.maxHeight || "400px" }}
            />
          ) : (
            <div className="inline-block border-2 border-dashed border-gray-300 bg-gray-50 p-8 font-mono text-sm text-gray-400">
              Изображение (укажите URL)
            </div>
          )}
        </div>
      );

    case "banner":
      return (
        <div
          className="border-2 border-black/80 p-6 text-center shadow-[4px_4px_0px_#1A1A1A]"
          style={{ backgroundColor: p.bgColor || "#FF4D00", color: p.textColor || "#ffffff" }}
        >
          <p className="font-mono text-lg font-black uppercase">{p.text || "Баннер"}</p>
          {p.subtitle && <p className="mt-1 font-mono text-sm opacity-80">{p.subtitle}</p>}
          {p.linkUrl && p.linkText && (
            <a
              href={p.linkUrl}
              className="mt-3 inline-block border-2 border-current px-4 py-2 font-mono text-xs font-bold uppercase transition-all hover:opacity-80"
            >
              {p.linkText}
            </a>
          )}
        </div>
      );

    case "divider":
      return (
        <hr
          className="border-0"
          style={{
            height: p.thickness || "2px",
            backgroundColor: p.color || "#1A1A1A",
          }}
        />
      );

    case "spacer":
      return <div style={{ height: p.height || "40px" }} />;

    case "html":
      return (
        <div
          className="prose max-w-none font-mono"
          dangerouslySetInnerHTML={{ __html: p.content || "" }}
        />
      );

    case "columns":
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${p.count || "2"}, 1fr)` }}>
          {(p.col1 || p.col2 || p.col3) ? (
            <>
              {p.col1 && <div className="font-mono text-sm text-gray-700">{p.col1}</div>}
              {p.col2 && <div className="font-mono text-sm text-gray-700">{p.col2}</div>}
              {p.col3 && <div className="font-mono text-sm text-gray-700">{p.col3}</div>}
            </>
          ) : (
            <>
              <div className="border-2 border-dashed border-gray-300 p-4 text-center font-mono text-xs text-gray-400">
                Колонка 1
              </div>
              <div className="border-2 border-dashed border-gray-300 p-4 text-center font-mono text-xs text-gray-400">
                Колонка 2
              </div>
            </>
          )}
        </div>
      );

    case "button":
      return (
        <div style={{ textAlign: (p.align as "left" | "center" | "right") || "center" }}>
          <a
            href={p.linkUrl || "#"}
            className="inline-block border-2 border-black/80 px-6 py-3 font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_#FF4D00] transition-all hover:shadow-[2px_2px_0px_#FF4D00] hover:translate-x-[2px] hover:translate-y-[2px]"
            style={{ backgroundColor: p.bgColor || "#FF4D00", color: p.textColor || "#ffffff" }}
          >
            {p.text || "Кнопка"}
          </a>
        </div>
      );

    default:
      return null;
  }
}

export default function PageBlocks({ pageId }: { pageId: string }) {
  const blocks = useSyncExternalStore(subscribe, makeSnapshot(pageId), () => EMPTY);

  if (blocks.length === 0) return null;

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
