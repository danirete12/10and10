import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href
        ? {
            item:
              (process.env.NEXT_PUBLIC_BASE_URL ?? "https://10and10.es") +
              item.href,
          }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
          <li>
            <Link href="/" className="hover:text-[var(--foreground)]">
              Inicio
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <span>/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-[var(--foreground)]">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[var(--foreground)]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
