import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "./AddToCartButton";
import { Card } from "@/components/ui/card";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  return product;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const images = (product.images as unknown as string[]) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/products" className="text-blue-500 hover:underline">← Back to products</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <Card className="bg-stone-900">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={product.title} className="w-full h-80 object-cover" />
          ) : (
            <div className="w-full h-80 bg-gray-100" />
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 p-4">
              {images.slice(1, 5).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="thumb" className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 text-stone-100">
          <h1 className="text-2xl font-semibold mb-1 text-stone-100">{product.title}</h1>
          <p className="text-stone-400 mb-4">{product.category.name}</p>
          <div className="text-xl font-bold mb-4 text-stone-100">${(product.price / 100).toFixed(2)}</div>
          <p className="mb-6 whitespace-pre-line text-stone-200">{product.description}</p>
          <AddToCartButton
            productId={product.id}
            title={product.title}
            price={product.price}
            image={images[0]}
            slug={product.slug}
          />
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3 text-stone-100">Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-stone-400">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {product.reviews.map((r) => (
              <li key={r.id} className="border border-stone-800 rounded p-4 bg-stone-900 text-stone-100">
                <div className="font-medium">Rating: {r.rating}/5</div>
                <div className="text-stone-200">{r.comment}</div>
                <div className="text-sm text-stone-400 mt-1">by {r.author}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}


