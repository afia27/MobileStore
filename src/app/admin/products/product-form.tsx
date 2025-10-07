"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

type Category = { id: string; name: string };

export default function ProductForm({ categories, product }: { categories: Category[]; product?: any }) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [price, setPrice] = useState<number>(product?.price ?? 0);
  const [stock, setStock] = useState<number>(product?.stock ?? 0);
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? (categories[0]?.id || ""));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [error, setError] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !slug) return setError("Title and slug are required");
    if (price <= 0) return setError("Price must be positive");
    const endpoint = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PATCH" : "POST";
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, price, stock, description, categoryId, images }),
    });
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      const j = await res.json();
      setError(j.error || "Failed to save");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">{product ? "Edit" : "New"} Product</h1>
      <form onSubmit={submit} className="grid gap-4">
        <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" type="number" placeholder="Price (cents)" value={price} onChange={(e) => setPrice(parseInt(e.target.value || "0", 10))} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value || "0", 10))} />
        </div>
        <select className="border rounded px-3 py-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <textarea className="border rounded px-3 py-2" rows={6} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div>
          <label className="block font-medium mb-1">Images</label>
          <ImageUploader value={images} onChange={setImages} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button className="border rounded px-4 py-2" type="submit">Save</button>
          <a className="border rounded px-4 py-2" href="/admin">Cancel</a>
        </div>
      </form>
    </div>
  );
}


