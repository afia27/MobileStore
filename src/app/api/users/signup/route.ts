import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const db = await getDb();
  const existing = await db.collection("users").findOne({ email });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({ name, email, passwordHash, role: "user", createdAt: new Date() });
  return NextResponse.json({ ok: true });
}


