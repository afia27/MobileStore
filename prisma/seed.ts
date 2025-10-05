import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = await prisma.$transaction([
    prisma.category.upsert({
      where: { slug: "android" },
      update: {},
      create: { name: "Android", slug: "android" },
    }),
    prisma.category.upsert({
      where: { slug: "ios" },
      update: {},
      create: { name: "iOS", slug: "ios" },
    }),
    prisma.category.upsert({
      where: { slug: "feature" },
      update: {},
      create: { name: "Feature Phones", slug: "feature" },
    }),
  ]);

  const [android, ios] = categories;

  // Products (prices in cents)
  const productsData = [
    {
      title: "Pixel 8",
      slug: "google-pixel-8",
      description:
        "Google Pixel 8 with Tensor G3, 8GB RAM, 128GB storage. Excellent camera.",
      price: 69900,
      stock: 12,
      images: [
        "https://res.cloudinary.com/demo/image/upload/w_800/sample.jpg",
      ],
      categoryId: android.id,
    },
    {
      title: "iPhone 15",
      slug: "iphone-15",
      description:
        "Apple iPhone 15 with A16, 6.1-inch display, 128GB storage.",
      price: 79900,
      stock: 10,
      images: [
        "https://res.cloudinary.com/demo/image/upload/w_800/iphone.png",
      ],
      categoryId: ios.id,
    },
    {
      title: "Galaxy S23",
      slug: "samsung-galaxy-s23",
      description:
        "Samsung Galaxy S23 with Snapdragon 8 Gen 2, 8GB RAM, 256GB storage.",
      price: 74900,
      stock: 8,
      images: [
        "https://res.cloudinary.com/demo/image/upload/w_800/galaxy.jpg",
      ],
      categoryId: android.id,
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // Admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123"; // for demo; change in production
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: Role.ADMIN, name: "Admin" },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      name: "Admin",
    },
  });

  console.log("Seed completed. Admin login:", adminEmail, adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


