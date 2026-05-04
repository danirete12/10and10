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
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        name="q"
        type="search"
        defaultValue={initialQuery || searchParams.get("q") || ""}
        placeholder="Submariner, Datejust, ETA 2824..."
        className="flex-1 border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] dark:bg-[var(--muted)]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50 dark:text-[var(--background)]"
      >
        {isPending ? "..." : "Buscar"}
      </button>
    </form>
  );
}
