"use client";

import Link from "next/link";

export default function GuestNavbar() {
  return (
    <nav className="flex items-center gap-3 text-sm">
      <Link href="/products" className="hover:underline">Products</Link>
      <Link href="/user/signin" className="hover:underline">Sign in</Link>
      <Link href="/user/signup" className="hover:underline">Sign up</Link>
      <Link href="/admin/signin" className="hover:underline">Admin</Link>
    </nav>
  );
}


