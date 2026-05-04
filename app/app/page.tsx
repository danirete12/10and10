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
      {/* Hero */}
      <section className="border-b border-[var(--border)] px-4 py-16 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          La referencia del reloj
        </h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          Base de datos de relojes, marcas y calibres en español
        </p>
        <div className="mt-8 mx-auto max-w-xl">
          <SearchBar />
        </div>
      </section>

      {/* Featured watches */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl font-semibold mb-6">
          Relojes destacados
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featuredWatches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="border-t border-[var(--border)] px-4 py-12 max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl font-semibold mb-6">Marcas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {featuredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>
    </main>
  );
}
