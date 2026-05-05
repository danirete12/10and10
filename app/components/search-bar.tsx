"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") as string;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        name="q"
        type="search"
        defaultValue={initialQuery || searchParams.get("q") || ""}
        placeholder="Submariner, Datejust, ETA 2824..."
        className="flex-1 border border-[var(--border)] border-r-0 bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="border border-[var(--gold)] bg-[var(--gold)] px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "···" : "Buscar"}
      </button>
    </form>
  );
}
