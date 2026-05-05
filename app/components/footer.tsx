import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-base font-bold">10</span>
              <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--gold)]">and</span>
              <span className="font-serif text-base font-bold">10</span>
            </div>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              La referencia del reloj en español
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-6">
            <Link href="/watches" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Relojes
            </Link>
            <Link href="/brands" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Marcas
            </Link>
            <Link href="/search" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Buscar
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} 10and10. La posición 10:10 — la hora del reloj.
          </p>
        </div>
      </div>
    </footer>
  );
}
