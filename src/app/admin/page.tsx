import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "./DeleteProductButton";
import SignOutButton from "./SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminProducts() {
  const session = await getServerSession(authOptions);
  if ((session as any)?.role !== "admin") {
    return <div className="max-w-6xl mx-auto px-4 py-8">Unauthorized</div>;
  }
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-stone-100">Products</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new"><Button variant="secondary">Add New Product</Button></Link>
        </div>
      </div>
      <Card className="p-0 overflow-hidden bg-stone-900 border-stone-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-stone-800 text-stone-400">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody className="text-stone-100">
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-800">
                <td className="py-3 px-4">{p.title}</td>
                <td className="px-4">{p.category.name}</td>
                <td className="px-4">${(p.price / 100).toFixed(2)}</td>
                <td className="px-4">{p.stock}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`}><Button variant="secondary">Edit</Button></Link>
                    <DeleteProductButton id={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


