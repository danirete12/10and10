import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 24)));
  const skip = (page - 1) * limit;
  const brand = searchParams.get("brand");

  const where = brand ? { brand: { slug: brand } } : {};

  const [watches, total] = await Promise.all([
    prisma.watch.findMany({
      where,
      skip,
      take: limit,
      orderBy: { reviewCount: "desc" },
      select: {
        id: true,
        slug: true,
        reference: true,
        commercialName: true,
        yearIntroduced: true,
        caseDiameterMm: true,
        caseMaterial: true,
        dialColor: true,
        averageRating: true,
        reviewCount: true,
        brand: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      },
    }),
    prisma.watch.count({ where }),
  ]);

  return NextResponse.json({
    data: watches,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
