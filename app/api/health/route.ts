import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    product: "EcoCampus",
    motto: "LEARN. GROW. ACHIEVE.",
    mode: "simulated_fintech_prototype",
    timestamp: new Date().toISOString(),
  });
}
