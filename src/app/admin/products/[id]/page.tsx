import { prisma } from "@/lib/prisma";
import ProductForm from "../product-form";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findUnique({ where: { id: params.id } }),
  ]);
  if (!product) return <div className="max-w-2xl mx-auto px-4 py-8">Not found</div>;
  return <ProductForm categories={categories} product={product} />;
}


