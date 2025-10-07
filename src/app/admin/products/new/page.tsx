import { prisma } from "@/lib/prisma";
import ProductForm from "../product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <ProductForm categories={categories} />;
}


