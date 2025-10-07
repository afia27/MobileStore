"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function UserNavbar() {
  const { data: session } = useSession();
  const { count, totalCents } = useCart();
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link href="/products"><Button variant="secondary">Products</Button></Link>
      <Link href="/cart">
        <Button variant="secondary">
          Cart
          {count > 0 && (
            <span className="ml-2 inline-flex items-center justify-center text-[10px] bg-black text-white rounded-full px-2 py-0.5">
              {count}
            </span>
          )}
        </Button>
      </Link>
      {session && (
        <Link href={`/${(session as any).userId}/transactions`}><Button variant="secondary">My transactions</Button></Link>
      )}
      <Link href="/cart"><Button>Checkout ${(totalCents / 100).toFixed(2)}</Button></Link>
      {session ? (
        <Button onClick={() => signOut({ callbackUrl: "/" })} variant="secondary">Sign out</Button>
      ) : null}
    </nav>
  );
}


