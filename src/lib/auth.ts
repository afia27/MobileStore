import { cookies } from "next/headers";

export async function isAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  return Boolean(process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET);
}