import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      country: true,
      foundedYear: true,
      logoUrl: true,
      _count: { select: { watches: true } },
    },
  });

  return NextResponse.json({ data: brands });
}
