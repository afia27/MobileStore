"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CTAProductsButton() {
  const { data: session } = useSession();
  const href = session ? "/products" : "/user/signin";
  const label = "Checkout our products";
  return (
    <Link href={href} className="border rounded px-5 py-2.5 hover:bg-black hover:text-white transition-colors cursor-pointer">
      {label}
    </Link>
  );
}


