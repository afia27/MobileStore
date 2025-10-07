"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Category = { id: string; name: string };

export default function ProductForm({ categories, product }: { categories: Category[]; product?: any }) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  // store dollars in UI, convert to cents on submit
  const [price, setPrice] = useState<string>(
    product?.price != null ? (product.price / 100).toString() : ""
  );
  const [stock, setStock] = useState<string>(String(product?.stock ?? ""));
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? (categories[0]?.id || ""));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [error, setError] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !slug) return setError("Title and slug are required");
    const priceNum = Math.round(parseFloat(price || "0") * 100);
    const stockNum = parseInt(stock || "0", 10);
    if (priceNum <= 0) return setError("Price must be positive");
    const endpoint = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PATCH" : "POST";
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, price: priceNum, stock: stockNum, description, categoryId, images }),
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
      <h1 className="text-2xl font-semibold mb-4 text-stone-100">{product ? "Edit" : "New"} Product</h1>
      <form onSubmit={submit} className="grid gap-4 bg-stone-900 border border-stone-800 rounded-xl p-5">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Price ($)"
            inputMode="numeric"
            pattern="[0-9]*"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
          />
          <Input
            placeholder="Stock"
            inputMode="numeric"
            pattern="[0-9]*"
            value={stock}
            onChange={(e) => setStock(e.target.value.replace(/\D+/g, ""))}
          />
        </div>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <textarea className="border rounded px-3 py-2 bg-stone-900 text-stone-100 border-stone-700" rows={6} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div>
          <label className="block font-medium mb-1">Images</label>
          <ImageUploader value={images} onChange={setImages} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <a className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm shadow-sm hover:bg-gray-50" href="/admin">Cancel</a>
        </div>
      </form>
    </div>
  );
}


