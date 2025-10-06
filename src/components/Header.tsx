"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { count, totalCents } = useCart();
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">MobileStore</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/cart" className="relative hover:underline">
            Cart
            {count > 0 && (
              <span className="ml-1 inline-flex items-center justify-center text-xs bg-black text-white rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </Link>
          <Link href="/cart" className="border rounded px-3 py-1.5">Checkout ${(totalCents/100).toFixed(2)}</Link>
        </nav>
      </div>
    </header>
  );
}


