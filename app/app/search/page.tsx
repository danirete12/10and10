import type { Metadata } from "next";
import { SearchBar } from "@/components/search-bar";
import { WatchCard } from "@/components/watch-card";

type SearchResult = {
  id: string;
  slug: string;
  reference: string;
  commercialName: string | null;
  averageRating: number | null;
  reviewCount: number;
  brand: { name: string; slug: string };
  images: { url: string; altText: string | null }[];
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Búsqueda` : "Búsqueda",
    description: `Resultados de búsqueda para relojes${q ? `: ${q}` : ""}.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let results: SearchResult[] = [];
  let total = 0;

  if (q) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/search?q=${encodeURIComponent(q)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      results = data.hits ?? [];
      total = data.totalHits ?? 0;
    }
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Búsqueda</h1>
      <div className="max-w-xl mb-8">
        <SearchBar initialQuery={q} />
      </div>

      {q && (
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          {total} resultado{total !== 1 ? "s" : ""} para &ldquo;{q}&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
      ) : q ? (
        <p className="text-[var(--muted-foreground)]">
          No encontramos resultados para &ldquo;{q}&rdquo;.
        </p>
      ) : (
        <p className="text-[var(--muted-foreground)]">
          Escribe una referencia, marca o calibre para buscar.
        </p>
      )}
    </main>
  );
}
