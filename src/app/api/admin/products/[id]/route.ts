import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(req: NextRequest) {
  const cookie = req.headers.get("cookie")?.split(/;\s*/).find((c) => c.startsWith("admin="));
  const token = cookie?.split("=")[1];
  return token && process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, slug, price, stock, description, categoryId, images } = await req.json();
  if (!title || !slug || !categoryId) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  if (price <= 0) return NextResponse.json({ error: "Price must be positive" }, { status: 400 });

  const conflict = await prisma.product.findUnique({ where: { slug } });
  if (conflict && conflict.id !== params.id) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

  const product = await prisma.product.update({
    where: { id: params.id },
    data: { title, slug, price, stock, description, categoryId, images },
  });
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}


