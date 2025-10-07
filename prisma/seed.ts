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
    prisma.category.upsert({
      where: { slug: "foldable" },
      update: {},
      create: { name: "Foldables", slug: "foldable" },
    }),
    prisma.category.upsert({
      where: { slug: "budget" },
      update: {},
      create: { name: "Budget", slug: "budget" },
    }),
  ]);

  const mapBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  // Products (prices in cents)
  // NOTE: prices below are already in cents to match schema
  const productsData = [
    // Android
    { title: "Google Pixel 8", slug: "google-pixel-8", description: "Google Pixel 8, Tensor G3, 8GB RAM, 128GB storage, stellar camera.", price: 69900, stock: 15, images: ["https://images.pexels.com/photos/34406/pexels-photo.jpg"], categoryId: mapBySlug.android.id },
    { title: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", description: "Pixel 8 Pro with larger LTPO display and advanced camera features.", price: 99900, stock: 9, images: ["https://images.pexels.com/photos/3585090/pexels-photo-3585090.jpeg"], categoryId: mapBySlug.android.id },
    { title: "Samsung Galaxy S23", slug: "samsung-galaxy-s23", description: "Galaxy S23, Snapdragon 8 Gen 2, 8GB RAM, 256GB storage.", price: 74900, stock: 12, images: ["https://images.pexels.com/photos/16149966/pexels-photo-16149966.jpeg"], categoryId: mapBySlug.android.id },
    { title: "Samsung Galaxy S23 Ultra", slug: "samsung-galaxy-s23-ultra", description: "S23 Ultra with 200MP camera, S Pen support, massive battery.", price: 119900, stock: 7, images: ["https://images.pexels.com/photos/32858913/pexels-photo-32858913.jpeg"], categoryId: mapBySlug.android.id },
    { title: "OnePlus 12", slug: "oneplus-12", description: "OnePlus 12 flagship performance with HyperBoost and fast charging.", price: 79900, stock: 13, images: ["https://images.pexels.com/photos/9403824/pexels-photo-9403824.jpeg"], categoryId: mapBySlug.android.id },
    { title: "Xiaomi 14", slug: "xiaomi-14", description: "Xiaomi 14 with Leica optics, Snapdragon flagship chipset.", price: 69900, stock: 20, images: ["https://images.pexels.com/photos/33001497/pexels-photo-33001497.jpeg"], categoryId: mapBySlug.android.id },
    { title: "Nothing Phone 2", slug: "nothing-phone-2", description: "Nothing Phone (2) with Glyph Interface and clean Android.", price: 69900, stock: 16, images: ["https://images.pexels.com/photos/32890114/pexels-photo-32890114.jpeg"], categoryId: mapBySlug.android.id },

    // iOS
    { title: "iPhone 15", slug: "iphone-15", description: "Apple iPhone 15 with A16 Bionic, USB‑C, 6.1‑inch display.", price: 79900, stock: 14, images: ["https://images.pexels.com/photos/34018284/pexels-photo-34018284.jpeg"], categoryId: mapBySlug.ios.id },
    { title: "iPhone 15 Plus", slug: "iphone-15-plus", description: "iPhone 15 Plus with larger 6.7‑inch display, great battery life.", price: 89900, stock: 10, images: ["https://images.pexels.com/photos/4526398/pexels-photo-4526398.jpeg"], categoryId: mapBySlug.ios.id },
    { title: "iPhone 15 Pro", slug: "iphone-15-pro", description: "Titanium build, A17 Pro, advanced cameras, ProMotion display.", price: 99900, stock: 11, images: ["https://images.pexels.com/photos/18403789/pexels-photo-18403789.jpeg"], categoryId: mapBySlug.ios.id },
    { title: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", description: "Periscope zoom, best battery, 6.7‑inch ProMotion.", price: 119900, stock: 8, images: ["https://images.pexels.com/photos/34018284/pexels-photo-34018284.jpeg"], categoryId: mapBySlug.ios.id },

    // Feature phones
    { title: "Nokia 105 (2024)", slug: "nokia-105-2024", description: "Classic durable feature phone with long battery and FM radio.", price: 3500, stock: 40, images: ["https://images.pexels.com/photos/4224099/pexels-photo-4224099.jpeg"], categoryId: mapBySlug.feature.id },
    { title: "Nokia 110 4G", slug: "nokia-110-4g", description: "Feature phone with 4G connectivity, MP3 player, microSD support.", price: 4500, stock: 30, images: ["https://images.pexels.com/photos/5741605/pexels-photo-5741605.jpeg"], categoryId: mapBySlug.feature.id },
    
    // Foldables
    { title: "Galaxy Z Fold5", slug: "samsung-galaxy-z-fold5", description: "Samsung foldable productivity powerhouse with S Pen support.", price: 179900, stock: 5, images: ["https://images.pexels.com/photos/20013897/pexels-photo-20013897.jpeg"], categoryId: mapBySlug.foldable.id },
    { title: "Galaxy Z Flip5", slug: "samsung-galaxy-z-flip5", description: "Compact flip foldable with Flex Window and fun colors.", price: 99900, stock: 9, images: ["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg"], categoryId: mapBySlug.foldable.id },
    { title: "OnePlus Open", slug: "oneplus-open", description: "Premium foldable with strong hinge and Hasselblad cameras.", price: 169900, stock: 6, images: ["https://images.pexels.com/photos/3721646/pexels-photo-3721646.jpeg"], categoryId: mapBySlug.foldable.id },

    // Budget
    { title: "Moto G54", slug: "moto-g54", description: "Reliable budget Android with big battery and clean software.", price: 19900, stock: 25, images: ["https://images.pexels.com/photos/34179273/pexels-photo-34179273.jpeg"], categoryId: mapBySlug.budget?.id ?? mapBySlug.android.id },
    { title: "Redmi Note 13", slug: "redmi-note-13", description: "Sharp AMOLED, 108MP camera, great value.", price: 21900, stock: 28, images: ["https://images.pexels.com/photos/28381526/pexels-photo-28381526.jpeg"], categoryId: mapBySlug.budget?.id ?? mapBySlug.android.id },
    { title: "Realme Narzo 60", slug: "realme-narzo-60", description: "Stylish budget phone with smooth 90Hz display.", price: 17900, stock: 22, images: ["https://images.pexels.com/photos/34006614/pexels-photo-34006614.jpeg"], categoryId: mapBySlug.budget?.id ?? mapBySlug.android.id },
    { title: "Samsung Galaxy A15", slug: "samsung-galaxy-a15", description: "AMOLED on a budget, large battery, One UI.", price: 24900, stock: 18, images: ["https://images.pexels.com/photos/30466750/pexels-photo-30466750.jpeg"], categoryId: mapBySlug.budget?.id ?? mapBySlug.android.id },
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


