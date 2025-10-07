"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddToCartButton(props: {
  productId: string;
  title: string;
  price: number;
  image?: string;
  slug: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = React.useState<string>("1");
  const [added, setAdded] = React.useState<boolean>(false);

  const onAdd = () => {
    const n = parseInt(qty || "1", 10);
    const safe = Number.isNaN(n) || n < 1 ? 1 : n;
    addItem({ productId: props.productId, title: props.title, price: props.price, image: props.image, slug: props.slug }, safe);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={qty}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D+/g, "");
          setQty(digits);
        }}
        onBlur={() => {
          if (!qty || qty === "0") setQty("1");
        }}
        className="w-24"
      />
      <Button onClick={onAdd}>Add to cart</Button>
      {added && <span className="text-green-400 text-sm">Added!</span>}
      <a href="/cart" className="text-blue-400 hover:underline text-sm">Go to cart</a>
    </div>
  );
}


