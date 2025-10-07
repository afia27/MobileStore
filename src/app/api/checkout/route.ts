import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  // Stripe is disabled in this deployment
  return NextResponse.json({ error: "Stripe disabled" }, { status: 501 });
}


