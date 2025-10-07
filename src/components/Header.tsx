"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import AdminNavbar from "./AdminNavbar";
import UserNavbar from "./UserNavbar";
import GuestNavbar from "./GuestNavbar";

export default function Header() {
  const { count, totalCents } = useCart();
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">MobileStore</Link>
        {session ? (session.role === "admin" ? <AdminNavbar /> : <UserNavbar />) : <GuestNavbar />}
      </div>
    </header>
  );
}


