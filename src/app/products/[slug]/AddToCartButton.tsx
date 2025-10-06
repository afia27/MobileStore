"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton(props: {
  productId: string;
  title: string;
  price: number;
  image?: string;
  slug: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = React.useState<number>(1);
  const [added, setAdded] = React.useState<boolean>(false);

  const onAdd = () => {
    addItem({ productId: props.productId, title: props.title, price: props.price, image: props.image, slug: props.slug }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(parseInt(e.target.value || "1", 10))}
        className="w-20 border rounded px-2 py-2"
      />
      <button className="border rounded px-5 py-2" onClick={onAdd}>Add to cart</button>
      {added && <span className="text-green-600 text-sm">Added!</span>}
      <a href="/cart" className="text-blue-600 hover:underline text-sm">Go to cart</a>
    </div>
  );
}


