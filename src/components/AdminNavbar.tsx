"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminNavbar() {
  return (
    <nav className="flex items-center gap-3 text-sm">
      <Link href="/admin" className="hover:underline">Dashboard</Link>
      <Link href="/admin/products/new" className="border rounded px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer">New Product</Link>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="border rounded px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer">Sign out</button>
    </nav>
  );
}


