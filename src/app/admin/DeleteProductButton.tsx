"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function onDelete() {
    const ok = window.confirm(`Delete product "${title}"? This cannot be undone.`);
    if (!ok) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete");
    }
  }

  return (
    <button onClick={onDelete} className="border rounded px-3 py-1 ml-2 text-red-600 border-red-400">
      Delete
    </button>
  );
}


