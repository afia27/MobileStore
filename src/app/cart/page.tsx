"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, setQuantity, removeItem, clear, totalCents } = useCart();
  const [draftQty, setDraftQty] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    // Sync drafts when items change (e.g., after clear or remove)
    const next: Record<string, string> = {};
    for (const i of items) next[i.productId] = draftQty[i.productId] ?? String(i.quantity);
    setDraftQty(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const checkout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url as string;
    }
  };

  const demoPay = async () => {
    const payload = { items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) };
    const res = await fetch("/api/demo-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (json.success) {
      clear();
      window.location.href = "/success";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-stone-100">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-center text-stone-400">
          <p>Your cart is empty.</p>
          <Link href="/products" className="text-blue-400 hover:underline">Browse products</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((i) => (
            <Card key={i.productId} className="p-4 flex gap-4 items-center bg-stone-900 text-stone-100 border-stone-800">
              {i.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt={i.title} className="w-20 h-20 object-cover rounded" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded" />
              )}
              <div className="flex-1">
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-stone-400">${(i.price / 100).toFixed(2)}</div>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={draftQty[i.productId] ?? String(i.quantity)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D+/g, "");
                  setDraftQty((prev) => ({ ...prev, [i.productId]: digits }));
                }}
                onBlur={() => {
                  const current = draftQty[i.productId] ?? String(i.quantity);
                  const parsed = parseInt(current || "0", 10);
                  const safe = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
                  setQuantity(i.productId, safe);
                  setDraftQty((prev) => ({ ...prev, [i.productId]: String(safe) }));
                }}
                className="w-20"
              />
              <Button variant="secondary" onClick={() => removeItem(i.productId)}>Remove</Button>
            </Card>
          ))}

          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold text-stone-100">Total: ${ (totalCents / 100).toFixed(2) }</div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={clear}>Clear</Button>
              {/* <Button onClick={checkout}>Stripe Checkout</Button> */}
              <Button variant="secondary" onClick={demoPay}>Stripe Pay</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


