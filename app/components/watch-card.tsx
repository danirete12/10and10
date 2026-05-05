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
      className="group block bg-[var(--card)] hover:bg-white transition-colors"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--muted)]">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? displayName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="3" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="21" />
              <line x1="3" y1="12" x2="6" y2="12" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 pb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--gold)]">
          {watch.brand.name}
        </p>
        <p className="mt-1 font-serif text-sm font-semibold leading-snug text-[var(--foreground)] line-clamp-2">
          {displayName}
        </p>
        <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
          {watch.reference}
        </p>
        {watch.reviewCount > 0 && (
          <p className="mt-1.5 text-[10px] text-[var(--muted-foreground)]">
            <span className="text-[var(--gold)]">★</span>{" "}
            {watch.averageRating?.toFixed(1)}{" "}
            <span className="opacity-60">({watch.reviewCount})</span>
          </p>
        )}
      </div>
    </Link>
  );
}
