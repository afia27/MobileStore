import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined; // category slug
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const pageSizeParam = parseInt(searchParams.get("pageSize") || "12", 10);

  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const pageSize = Number.isNaN(pageSizeParam) || pageSizeParam < 1 ? 12 : Math.min(pageSizeParam, 50);

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }
  const priceFilter: any = {};
  if (min) {
    const n = parseInt(min, 10);
    if (!Number.isNaN(n)) priceFilter.gte = n;
  }
  if (max) {
    const n = parseInt(max, 10);
    if (!Number.isNaN(n)) priceFilter.lte = n;
  }
  if (Object.keys(priceFilter).length) {
    where.price = priceFilter;
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const data = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: p.price,
    stock: p.stock,
    images: (p.images as unknown as string[]) ?? [],
    category: { id: p.category.id, name: p.category.name, slug: p.category.slug },
    createdAt: p.createdAt,
  }));

  return NextResponse.json({
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}


