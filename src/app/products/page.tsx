import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface SearchParams {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  page?: string;
}

export const dynamic = "force-dynamic"; // ensure fresh data in dev

async function getData(searchParams: SearchParams) {
  const page = Number(searchParams.page ?? 1) || 1;
  const pageSize = 12;

  const where: any = {};
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }
  const priceFilter: any = {};
  if (searchParams.min) priceFilter.gte = parseInt(searchParams.min, 10);
  if (searchParams.max) priceFilter.lte = parseInt(searchParams.max, 10);
  if (Object.keys(priceFilter).length) where.price = priceFilter;

  const [categories, total, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return { categories, total, products, page, pageSize };
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { categories, total, products, page, pageSize } = await getData(searchParams);

  const current = new URLSearchParams();
  Object.entries(searchParams as Record<string, string | string[] | undefined>).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => current.append(key, v));
    } else {
      current.set(key, value);
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>

      <form className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="Search..."
          className="border rounded px-3 py-2"
        />
        <select name="category" defaultValue={searchParams.category ?? ""} className="border rounded px-3 py-2">
          <option value="">All categories</option>
          {categories.map((c: { id: string; slug: string; name: string }) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <input name="min" defaultValue={searchParams.min ?? ""} placeholder="Min price (cents)" className="border rounded px-3 py-2" />
        <input name="max" defaultValue={searchParams.max ?? ""} placeholder="Max price (cents)" className="border rounded px-3 py-2" />
        <button type="submit" className="border rounded px-4 py-2 md:col-span-4">Apply</button>
      </form>

      {products.length === 0 && (
        <p className="text-gray-600">No products found.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p: { id: string; slug: string; title: string; price: number; category: { name: string }; images: unknown }) => {
          const images = (p.images as unknown as string[]) ?? [];
          const first = images[0];
          return (
            <li key={p.id} className="border rounded p-4">
              {first ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={first} alt={p.title} className="w-full h-40 object-cover mb-3 rounded" />
              ) : (
                <div className="w-full h-40 bg-gray-100 mb-3 rounded" />
              )}
              <h2 className="font-medium mb-1">{p.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{p.category.name}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">${(p.price / 100).toFixed(2)}</span>
                <Link href={`/products/${p.slug}`} className="text-blue-600 hover:underline">View</Link>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex gap-2 mt-8">
          {page > 1 && (
            <Link
              href={(function () {
                const sp = new URLSearchParams(current);
                sp.set("page", String(page - 1));
                return `/products?${sp.toString()}`;
              })()}
              className="border rounded px-3 py-2"
            >
              Prev
            </Link>
          )}
          {page * pageSize < total && (
            <Link
              href={(function () {
                const sp = new URLSearchParams(current);
                sp.set("page", String(page + 1));
                return `/products?${sp.toString()}`;
              })()}
              className="border rounded px-3 py-2"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}


