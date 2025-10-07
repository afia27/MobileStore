import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(_req: NextRequest) {
  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = process.env as Record<string, string>;
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ error: "Cloudinary env missing" }, { status: 500 });
  }
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign = `timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(paramsToSign + CLOUDINARY_API_SECRET).digest("hex");
  return NextResponse.json({ timestamp, signature, apiKey: CLOUDINARY_API_KEY, cloudName: CLOUDINARY_CLOUD_NAME });
}


