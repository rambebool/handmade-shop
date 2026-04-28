"use client";

import { useSyncExternalStore } from "react";
import { AdBlock } from "@/lib/types";
import { getActiveAds } from "@/lib/store";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

const cacheMap = new Map<string, { key: string; val: AdBlock[] }>();

function makeSnapshot(placement: AdBlock["placement"]) {
  return () => {
    const fresh = getActiveAds(placement);
    const key = JSON.stringify(fresh);
    const cached = cacheMap.get(placement);
    if (cached && cached.key === key) return cached.val;
    cacheMap.set(placement, { key, val: fresh });
    return fresh;
  };
}

const EMPTY: AdBlock[] = [];

export default function AdBanner({ placement }: { placement: AdBlock["placement"] }) {
  const ads = useSyncExternalStore(subscribe, makeSnapshot(placement), () => EMPTY);

  if (ads.length === 0) return null;

  return (
    <div className="space-y-2">
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="border-2 border-dashed border-[#FF4D00]/40 bg-gradient-to-r from-[#FF4D00]/5 to-[#00E5FF]/5 p-3"
        >
          {ad.linkUrl ? (
            <a
              href={ad.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <p className="font-mono text-xs font-bold uppercase text-[#FF4D00]">
                {ad.title}
              </p>
              <p className="mt-0.5 font-mono text-sm text-[#1A1A1A]">{ad.content}</p>
            </a>
          ) : (
            <>
              <p className="font-mono text-xs font-bold uppercase text-[#FF4D00]">
                {ad.title}
              </p>
              <p className="mt-0.5 font-mono text-sm text-[#1A1A1A]">{ad.content}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
