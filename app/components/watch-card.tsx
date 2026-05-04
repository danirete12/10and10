import Link from "next/link";
import Image from "next/image";

type WatchCardProps = {
  watch: {
    id: string;
    slug: string;
    reference: string;
    commercialName: string | null;
    averageRating: number | null;
    reviewCount: number;
    brand: { name: string; slug: string };
    images: { url: string; altText: string | null }[];
  };
};

export function WatchCard({ watch }: WatchCardProps) {
  const image = watch.images[0];
  const displayName = watch.commercialName ?? watch.reference;

  return (
    <Link
      href={`/watches/${watch.slug}`}
      className="group block border border-[var(--border)] bg-white dark:bg-[var(--muted)] hover:border-[var(--accent)] transition-colors"
    >
      {/* Image — square aspect */}
      <div className="relative aspect-square overflow-hidden bg-[var(--muted)]">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? displayName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
          {watch.brand.name}
        </p>
        <p className="mt-0.5 text-sm font-medium leading-tight text-[var(--foreground)] line-clamp-2">
          {displayName}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          Ref. {watch.reference}
        </p>
        {watch.reviewCount > 0 && (
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            ★ {watch.averageRating?.toFixed(1)} ({watch.reviewCount})
          </p>
        )}
      </div>
    </Link>
  );
}
