import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session as unknown as { role?: string })?.role;
  if (role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, slug, price, stock, description, categoryId, images } = body;
  if (!title || !slug || !categoryId) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  if (price <= 0) return NextResponse.json({ error: "Price must be positive" }, { status: 400 });

  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

  const product = await prisma.product.create({
    data: { title, slug, price, stock: stock ?? 0, description, categoryId, images },
  });
  return NextResponse.json(product);
}


