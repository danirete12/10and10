"use client";

import Image from "next/image";
import { useState } from "react";

type WatchGalleryProps = {
  images: { url: string; altText: string | null; isPrimary: boolean }[];
  watchName: string;
};

export function WatchGallery({ images, watchName }: WatchGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--muted)]">
        <Image
          src={images[selected].url}
          alt={images[selected].altText ?? watchName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden border-2 transition-colors ${
                i === selected
                  ? "border-[var(--accent)]"
                  : "border-transparent hover:border-[var(--border)]"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${watchName} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
