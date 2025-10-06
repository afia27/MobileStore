"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, setQuantity, removeItem, clear, totalCents } = useCart();

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
      <h1 className="text-2xl font-semibold mb-6">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Your cart is empty.</p>
          <Link href="/products" className="text-blue-600 hover:underline">Browse products</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((i) => (
            <div key={i.productId} className="rounded-xl border p-4 flex gap-4 items-center bg-white shadow-sm">
              {i.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt={i.title} className="w-20 h-20 object-cover rounded" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded" />
              )}
              <div className="flex-1">
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-gray-600">${(i.price / 100).toFixed(2)}</div>
              </div>
              <input
                type="number"
                min={1}
                value={i.quantity}
                onChange={(e) => setQuantity(i.productId, parseInt(e.target.value || "1", 10))}
                className="w-16 border rounded px-2 py-1"
              />
              <button className="border rounded px-3 py-1" onClick={() => removeItem(i.productId)}>Remove</button>
            </div>
          ))}

          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">Total: ${ (totalCents / 100).toFixed(2) }</div>
            <div className="flex gap-2">
              <button className="border rounded px-4 py-2" onClick={clear}>Clear</button>
              <button className="border rounded px-4 py-2 bg-black text-white" onClick={checkout}>Stripe Checkout</button>
              <button className="border rounded px-4 py-2" onClick={demoPay}>Demo Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


