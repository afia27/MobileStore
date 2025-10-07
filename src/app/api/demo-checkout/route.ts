import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

type CartItem = { productId: string; quantity: number; price: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CartItem[] = Array.isArray(body.items) ? body.items : [];
    const name: string | undefined = body.name;
    const email: string | undefined = body.email;

    if (!items.length) return NextResponse.json({ error: "No items" }, { status: 400 });

    const amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Create order directly in MongoDB (demo mode source of truth)
    const session = await getServerSession(authOptions);
    const db = await getDb();
    const orderId = new ObjectId();
    await db.collection("transactions").insertOne({
      _id: orderId,
      orderId: String(orderId),
      userId: ((session as unknown) as { userId?: string })?.userId ?? null,
      email: session?.user?.email ?? email ?? null,
      name: ((session as unknown) as { name?: string })?.name ?? name ?? null,
      items,
      amount,
      currency: "usd",
      source: "demo",
      createdAt: new Date(),
    });

    return NextResponse.json({ orderId: String(orderId), success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Demo checkout failed" }, { status: 500 });
  }
}


