"use client";

import { useRouter, useSearchParams } from "next/navigation";

type FilterPanelProps = {
  brands: { slug: string; name: string }[];
  currentBrand?: string;
};

export function FilterPanel({ brands, currentBrand }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/watches?${params.toString()}`);
  }

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
          Marca
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateFilter("brand", null)}
              className={`text-left w-full ${
                !currentBrand
                  ? "font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Todas
            </button>
          </li>
          {brands.map((b) => (
            <li key={b.slug}>
              <button
                onClick={() => updateFilter("brand", b.slug)}
                className={`text-left w-full ${
                  currentBrand === b.slug
                    ? "font-medium text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {b.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
