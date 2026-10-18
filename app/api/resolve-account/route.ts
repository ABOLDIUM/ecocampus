import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountNumber = searchParams.get("account_number");
  const bankCode = searchParams.get("bank_code");

  if (!accountNumber || !bankCode || accountNumber.length !== 10) {
    return NextResponse.json({ status: "error", message: "Invalid account number or bank code." }, { status: 400 });
  }

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    console.error("CRITICAL: FLUTTERWAVE_SECRET_KEY is missing from environment variables.");
    return NextResponse.json({ status: "error", message: "Server configuration error: Missing secret key." }, { status: 500 });
  }

  try {
    const apiResponse = await fetch("https://api.flutterwave.com/v3/accounts/resolve", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: accountNumber,
        account_bank: bankCode,
      }),
    });

    const data = await apiResponse.json();
    
    // Print response in terminal to inspect what Flutterwave returns
    console.log("Flutterwave API Raw Response:", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Flutterwave Network Exception:", error);
    return NextResponse.json({ status: "error", message: "Failed to connect to Flutterwave network." }, { status: 500 });
  }
}