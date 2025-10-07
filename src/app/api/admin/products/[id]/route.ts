import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs"; // ensure NextAuth + Prisma

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session as unknown as { role?: string })?.role;
  if (role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const session = await getServerSession(authOptions);
  if ((session as any)?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { productId: params.id } }),
      prisma.orderItem.deleteMany({ where: { productId: params.id } }),
      prisma.product.delete({ where: { id: params.id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Delete failed", details: msg }, { status: 500 });
  }
}


