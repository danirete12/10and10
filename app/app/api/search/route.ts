import { NextRequest, NextResponse } from "next/server";
import { meili, WATCHES_INDEX } from "@/lib/meilisearch";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const hitsPerPage = Number(searchParams.get("limit") ?? 24);

  const brand = searchParams.get("brand");
  const material = searchParams.get("material");

  const filter: string[] = [];
  if (brand) filter.push(`brandSlug = "${brand}"`);
  if (material) filter.push(`caseMaterial = "${material}"`);

  try {
    const result = await meili.index(WATCHES_INDEX).search(q, {
      page,
      hitsPerPage,
      filter: filter.length ? filter.join(" AND ") : undefined,
      sort: q ? undefined : ["reviewCount:desc"],
    });

    return NextResponse.json({
      hits: result.hits,
      totalHits: result.totalHits,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch {
    return NextResponse.json(
      { error: "Search service unavailable" },
      { status: 503 }
    );
  }
}
