import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "./DeleteProductButton";
import SignOutButton from "./SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function AdminProducts() {
  const session = await getServerSession(authOptions);
  if ((session as any)?.role !== "admin") {
    return <div className="max-w-6xl mx-auto px-4 py-8">Unauthorized</div>;
  }
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="border rounded px-4 py-2">New Product</Link>
          <SignOutButton />
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Title</th>
            <th className="py-2">Category</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.title}</td>
              <td>{p.category.name}</td>
              <td>${(p.price / 100).toFixed(2)}</td>
              <td>{p.stock}</td>
              <td className="text-right">
                <Link href={`/admin/products/${p.id}`} className="border rounded px-3 py-1">Edit</Link>
                <DeleteProductButton id={p.id} title={p.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


