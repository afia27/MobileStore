import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SearchParams {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  page?: string;
}

export const dynamic = "force-dynamic"; // ensure fresh data in dev
export const runtime = "nodejs"; // ensure Prisma runs in Node.js runtime

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
  // Accept dollars in query and convert to cents for DB
  if (searchParams.min) {
    const v = parseFloat(searchParams.min);
    if (!Number.isNaN(v)) priceFilter.gte = Math.round(v * 100);
  }
  if (searchParams.max) {
    const v = parseFloat(searchParams.max);
    if (!Number.isNaN(v)) priceFilter.lte = Math.round(v * 100);
  }
  if (Object.keys(priceFilter).length) where.price = priceFilter;

  const [categories, total, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }).catch(() => [] as any[]),
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

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { categories, total, products, page, pageSize } = await getData(sp);

  const current = new URLSearchParams();
  Object.entries(sp as Record<string, string | string[] | undefined>).forEach(([key, value]) => {
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

      <form className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <Input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search phones by model or description"
          />
        </div>
        <div className="md:col-span-3">
          <Select
            name="category"
            defaultValue={sp.category ?? ""}
          >
            <option value="">All categories</option>
            {categories.map((c: { id: string; slug: string; name: string }) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Input
            name="min"
            defaultValue={sp.min ?? ""}
            placeholder="Min price ($)"
          />
        </div>
        <div className="md:col-span-2">
          <Input
            name="max"
            defaultValue={sp.max ?? ""}
            placeholder="Max price ($)"
          />
        </div>
        <div className="md:col-span-12">
          <Button type="submit" className="w-full md:w-auto">Apply filters</Button>
        </div>
      </form>

      {products.length === 0 && (
        <p className="text-gray-600">No products found.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p: { id: string; slug: string; title: string; price: number; category: { name: string }; images: unknown }) => {
          const images = (p.images as unknown as string[]) ?? [];
          const first = images[0];
          return (
            <li key={p.id}>
              <Card>
                {first ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={first} alt={p.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100" />
                )}
                <div className="p-4 text-stone-100">
                  <h2 className="font-medium mb-1 line-clamp-1 text-stone-100">{p.title}</h2>
                  <p className="text-sm text-stone-400 mb-3">{p.category.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-100">${(p.price / 100).toFixed(2)}</span>
                    <Link href={`/products/${p.slug}`}>
                      <Button variant="secondary">View</Button>
                    </Link>
                  </div>
                </div>
              </Card>
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
              className="inline-flex items-center rounded-md border px-4 py-2 bg-black text-white shadow-sm hover:bg-gray-900 cursor-pointer"
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
              className="inline-flex items-center rounded-md border px-4 py-2 bg-black text-white shadow-sm hover:bg-gray-900 cursor-pointer"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}


