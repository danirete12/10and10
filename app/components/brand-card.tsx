import Link from "next/link";
import Image from "next/image";

type BrandCardProps = {
  brand: {
    id: string;
    slug: string;
    name: string;
    country: string | null;
    logoUrl: string | null;
  };
};

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex flex-col items-center gap-2 border border-[var(--border)] p-4 text-center hover:border-[var(--accent)] transition-colors"
    >
      {brand.logoUrl ? (
        <div className="relative h-10 w-20">
          <Image
            src={brand.logoUrl}
            alt={`Logo ${brand.name}`}
            fill
            className="object-contain grayscale group-hover:grayscale-0 transition-all"
          />
        </div>
      ) : (
        <div className="h-10 flex items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
            {brand.name.slice(0, 2)}
          </span>
        </div>
      )}
      <span className="text-xs font-medium text-[var(--foreground)]">
        {brand.name}
      </span>
      {brand.country && (
        <span className="text-xs text-[var(--muted-foreground)]">
          {brand.country}
        </span>
      )}
    </Link>
  );
}
