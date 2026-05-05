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
      className="group flex flex-col items-center gap-2.5 border border-[var(--border)] bg-[var(--card)] p-5 text-center hover:border-[var(--gold)] transition-colors"
    >
      {brand.logoUrl ? (
        <div className="relative h-9 w-20">
          <Image
            src={brand.logoUrl}
            alt={`Logo ${brand.name}`}
            fill
            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
      ) : (
        <div className="h-9 flex items-center justify-center">
          <span className="font-serif text-lg font-bold text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
            {brand.name.slice(0, 2)}
          </span>
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-[var(--foreground)] leading-tight">
          {brand.name}
        </p>
        {brand.country && (
          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
            {brand.country}
          </p>
        )}
      </div>
    </Link>
  );
}
