import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WatchCard } from "@/components/watch-card";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const brands = await prisma.brand.findMany({ select: { slug: true } });
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) return {};

  return {
    title: brand.name,
    description:
      brand.description ??
      `Relojes ${brand.name}. Colecciones, referencias y specs de la manufactura ${brand.country ?? ""}.`,
    openGraph: { title: brand.name, type: "website" },
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      watches: {
        orderBy: { reviewCount: "desc" },
        include: {
          brand: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  if (!brand) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.websiteUrl,
    foundingDate: brand.foundedYear?.toString(),
    description: brand.description,
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
            { label: "Marcas", href: "/brands" },
            { label: brand.name },
          ]}
        />

        <div className="mt-6">
          <h1 className="font-serif text-3xl font-bold">{brand.name}</h1>
          {brand.country && (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {brand.country}
              {brand.foundedYear ? ` · Fundada en ${brand.foundedYear}` : ""}
            </p>
          )}
          {brand.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
              {brand.description}
            </p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold mb-4">
            Relojes ({brand.watches.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {brand.watches.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
