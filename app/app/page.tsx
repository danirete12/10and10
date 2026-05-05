import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { WatchCard } from "@/components/watch-card";
import { BrandCard } from "@/components/brand-card";
import { SearchBar } from "@/components/search-bar";

export const metadata: Metadata = {
  title: "10and10 — Wiki de Relojería",
  description:
    "La referencia definitiva en español para el aficionado a la relojería. Base de datos de relojes, marcas y calibres.",
};

export default async function HomePage() {
  const [featuredWatches, featuredBrands] = await Promise.all([
    prisma.watch.findMany({
      take: 12,
      orderBy: { reviewCount: "desc" },
      include: {
        brand: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.brand.findMany({
      take: 20,
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="flex-1">
      {/* Hero — editorial, left-aligned */}
      <section className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] mb-4">
              La referencia en español
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] leading-[1.1]">
              La enciclopedia<br />del reloj
            </h1>
            <p className="mt-5 text-base text-[var(--muted-foreground)] max-w-md leading-relaxed">
              Base de datos de relojes, marcas y calibres para el aficionado
              que quiere saber más de lo que pone la caja.
            </p>
            <div className="mt-8 max-w-lg">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Featured watches */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
            Relojes destacados
          </h2>
          <a
            href="/watches"
            className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Ver todos →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-[var(--border)]">
          {featuredWatches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="border-t border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
              Marcas
            </h2>
            <a
              href="/brands"
              className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Ver todas →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {featuredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
