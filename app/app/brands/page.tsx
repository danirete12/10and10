import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BrandCard } from "@/components/brand-card";

export const metadata: Metadata = {
  title: "Marcas de Relojería",
  description:
    "Directorio completo de marcas de relojes. Historia, colecciones y referencias de cada manufactura.",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Marcas</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </main>
  );
}
