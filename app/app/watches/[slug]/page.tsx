import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SpecsTable } from "@/components/specs-table";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { WatchGallery } from "@/components/watch-gallery";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const watches = await prisma.watch.findMany({ select: { slug: true } });
  return watches.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const watch = await prisma.watch.findUnique({
    where: { slug },
    include: { brand: true },
  });
  if (!watch) return {};

  const title = watch.commercialName
    ? `${watch.brand.name} ${watch.commercialName} (Ref. ${watch.reference})`
    : `${watch.brand.name} ${watch.reference}`;

  return {
    title,
    description: watch.description ?? `Ficha técnica del ${title}. Specs, calibre, imágenes y opiniones.`,
    openGraph: {
      title,
      type: "website",
    },
  };
}

export default async function WatchDetailPage({ params }: Props) {
  const { slug } = await params;

  const watch = await prisma.watch.findUnique({
    where: { slug },
    include: {
      brand: true,
      movement: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!watch) notFound();

  const displayName = watch.commercialName ?? watch.reference;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    brand: { "@type": "Brand", name: watch.brand.name },
    description: watch.description,
    ...(watch.retailPriceEur
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: watch.retailPriceEur,
          },
        }
      : {}),
    ...(watch.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: watch.averageRating,
            reviewCount: watch.reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[
            { label: "Relojes", href: "/watches" },
            { label: watch.brand.name, href: `/brands/${watch.brand.slug}` },
            { label: displayName },
          ]}
        />

        {/* Desktop: 60/40 split */}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-3/5">
            <WatchGallery images={watch.images} watchName={displayName} />
          </div>

          <div className="lg:w-2/5">
            <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
              {watch.brand.name}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold">{displayName}</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Ref. {watch.reference}
              {watch.yearIntroduced ? ` · ${watch.yearIntroduced}` : ""}
            </p>

            {watch.averageRating != null && (
              <p className="mt-3 text-sm">
                ★ {watch.averageRating.toFixed(1)}{" "}
                <span className="text-[var(--muted-foreground)]">
                  ({watch.reviewCount} {watch.reviewCount === 1 ? "opinión" : "opiniones"})
                </span>
              </p>
            )}

            {watch.description && (
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {watch.description}
              </p>
            )}

            <div className="mt-6">
              <SpecsTable watch={watch} movement={watch.movement} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
