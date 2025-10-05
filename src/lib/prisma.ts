import { PrismaClient } from "@prisma/client";

// Prevent creating multiple PrismaClient instances during hot-reload in dev
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}


