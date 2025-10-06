import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CartItem = { productId: string; quantity: number; price: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CartItem[] = Array.isArray(body.items) ? body.items : [];
    const name: string | undefined = body.name;
    const email: string | undefined = body.email;

    if (!items.length) return NextResponse.json({ error: "No items" }, { status: 400 });

    const amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Transaction: create order and items (no stock decrement in demo mode)
    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          email: email ?? "demo@example.com",
          name: name ?? "Demo Customer",
          amount,
          currency: "usd",
          stripeSessionId: `demo_${Date.now()}`,
        },
      });

      for (const i of items) {
        await tx.orderItem.create({
          data: {
            orderId: o.id,
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.price,
          },
        });
      }

      return o;
    });

    return NextResponse.json({ orderId: order.id, success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Demo checkout failed" }, { status: 500 });
  }
}


