import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
      <Link href="/products" className="text-blue-600 hover:underline">← Back to products</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div>
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={product.title} className="w-full h-80 object-cover rounded" />
          ) : (
            <div className="w-full h-80 bg-gray-100 rounded" />
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.slice(1, 5).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="thumb" className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.category.name}</p>
          <div className="text-xl font-bold mb-4">${(product.price / 100).toFixed(2)}</div>
          <p className="mb-6 whitespace-pre-line">{product.description}</p>
          <button className="border rounded px-4 py-2">Add to cart</button>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {product.reviews.map((r) => (
              <li key={r.id} className="border rounded p-4">
                <div className="font-medium">Rating: {r.rating}/5</div>
                <div className="text-gray-700">{r.comment}</div>
                <div className="text-sm text-gray-500 mt-1">by {r.author}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}


