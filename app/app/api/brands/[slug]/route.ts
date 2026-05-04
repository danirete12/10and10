import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      watches: {
        orderBy: { reviewCount: "desc" },
        select: {
          id: true,
          slug: true,
          reference: true,
          commercialName: true,
          yearIntroduced: true,
          caseMaterial: true,
          averageRating: true,
          reviewCount: true,
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
      },
    },
  });

  if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(brand);
}
