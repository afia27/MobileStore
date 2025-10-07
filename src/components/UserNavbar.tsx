"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function UserNavbar() {
  const { data: session } = useSession();
  const { count, totalCents } = useCart();
  return (
    <nav className="flex items-center gap-3 text-sm">
      <Link href="/products" className="hover:underline">Products</Link>
      <Link href="/cart" className="relative hover:underline">
        Cart
        {count > 0 && (
          <span className="ml-1 inline-flex items-center justify-center text-xs bg-black text-white rounded-full px-2 py-0.5">
            {count}
          </span>
        )}
      </Link>
      <Link href="/cart" className="border rounded px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer">Checkout ${(totalCents/100).toFixed(2)}</Link>
      {session ? (
        <>
          <Link href={`/${(session as any).userId}/transactions`} className="hover:underline">My transactions</Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="border rounded px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer">Sign out</button>
        </>
      ) : (
        <>
          <Link href="/user/signin" className="hover:underline">Sign in</Link>
          <Link href="/user/signup" className="hover:underline">Sign up</Link>
        </>
      )}
    </nav>
  );
}


