import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(req: NextRequest) {
  const cookie = req.headers.get("cookie")?.split(/;\s*/).find((c) => c.startsWith("admin="));
  const token = cookie?.split("=")[1];
  return token && process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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


