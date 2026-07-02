import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  // NextAuth handles CSRF for auth routes. This endpoint exposes a same-origin nonce
  // for future custom forms that need explicit CSRF tokens.
  return NextResponse.json({ csrfToken: randomBytes(24).toString("hex") }, { headers: { "Cache-Control": "no-store" } });
}
