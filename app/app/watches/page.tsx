import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { WatchCard } from "@/components/watch-card";
import { FilterPanel } from "@/components/filter-panel";

export const metadata: Metadata = {
  title: "Catálogo de Relojes",
  description:
    "Explora nuestra base de datos de relojes con filtros por marca, material, calibre y más.",
};

export default async function WatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; material?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const take = 24;
  const skip = (page - 1) * take;

  const where = {
    ...(params.brand ? { brand: { slug: params.brand } } : {}),
    ...(params.material ? { caseMaterial: params.material as never } : {}),
  };

  const [watches, total, brands] = await Promise.all([
    prisma.watch.findMany({
      where,
      take,
      skip,
      orderBy: { reviewCount: "desc" },
      include: {
        brand: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.watch.count({ where }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } }),
  ]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Catálogo de Relojes</h1>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <FilterPanel brands={brands} currentBrand={params.brand} />
        </aside>
        <div className="flex-1">
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            {total} relojes
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {watches.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
