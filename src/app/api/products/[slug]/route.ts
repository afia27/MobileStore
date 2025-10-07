import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface Params {
  params: { slug: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    images: (product.images as unknown as string[]) ?? [],
    category: { id: product.category.id, name: product.category.name, slug: product.category.slug },
    createdAt: product.createdAt,
    reviews: product.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      author: r.author,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
  });
}


