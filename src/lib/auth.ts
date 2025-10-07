import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean((session as any)?.role === "admin");
}