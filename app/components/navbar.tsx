import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1.5 group">
            <span className="font-serif text-xl font-bold tracking-tight text-[var(--foreground)]">
              10
            </span>
            <span
              className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--gold)]"
              style={{ lineHeight: 1 }}
            >
              and
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-[var(--foreground)]">
              10
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/watches"
              className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Relojes
            </Link>
            <Link
              href="/brands"
              className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Marcas
            </Link>
            <Link
              href="/search"
              className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Buscar
            </Link>
          </nav>

          {/* Search icon (mobile) */}
          <Link
            href="/search"
            className="sm:hidden p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Buscar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

        </div>
      </div>
    </header>
  );
}
