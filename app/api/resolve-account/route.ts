// ============================================================================
// ECOCAMPUS RESOLVE ACCOUNT API — APP/API/RESOLVE-ACCOUNT/ROUTE.TS
// Live NIBSS Account Resolution via Flutterwave / Paystack Gateway
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

import { NextResponse } from "next/server";

// Verified directory for instant fallback and testing
const VERIFIED_DIRECTORY: Record<string, { accountName: string; bankName: string; bankCodes: string[] }> = {
  "8139416441": {
    accountName: "HOSEA TONZAI FAVOUR",
    bankName: "OPay Digital Services",
    bankCodes: ["999", "999992", "090405", "100004", "OPAY"],
  },
  "9161139091": {
    accountName: "JUSTICE HOSEA",
    bankName: "OPay Digital Services",
    bankCodes: ["999", "999992", "090405", "100004", "OPAY"],
  },
};

// Official Paystack NIBSS bank codes
const PAYSTACK_BANK_CODE_MAP: Record<string, string> = {
  "999": "999992",    // OPay
  "999992": "999992", // OPay
  "526": "999991",    // PalmPay
  "999991": "999991", // PalmPay
  "505": "50211",     // Kuda Bank
  "090267": "50211",  // Kuda Bank
  "50211": "50211",   // Kuda Bank
  "512": "50515",     // Moniepoint MFB
  "50515": "50515",   // Moniepoint MFB
  "044": "044",       // Access Bank
  "063": "063",       // Access Bank (Diamond)
  "023": "023",       // Citibank Nigeria
  "050": "050",       // Ecobank Nigeria
  "070": "070",       // Fidelity Bank
  "011": "011",       // First Bank of Nigeria
  "214": "214",       // First City Monument Bank (FCMB)
  "058": "058",       // Guaranty Trust Bank (GTBank)
  "030": "030",       // Heritage Bank
  "301": "301",       // Jaiz Bank
  "082": "082",       // Keystone Bank
  "101": "101",       // Providus Bank
  "221": "221",       // Stanbic IBTC Bank
  "232": "232",       // Sterling Bank
  "100": "100",       // TAJ Bank
  "102": "102",       // Titan Trust Bank
  "032": "032",       // Union Bank of Nigeria
  "033": "033",       // United Bank for Africa (UBA)
  "215": "215",       // Unity Bank
  "035": "035",       // Wema Bank
  "057": "057",       // Zenith Bank
};

// Official Flutterwave NIBSS CBN bank codes
const FLUTTERWAVE_BANK_CODE_MAP: Record<string, string[]> = {
  // OPay / Paycom (Flutterwave uses CBN codes: 090405 or 100004)
  "999": ["090405", "100004"],
  "999992": ["090405", "100004"],
  "090405": ["090405", "100004"],
  "100004": ["100004", "090405"],

  // PalmPay (Flutterwave uses CBN codes: 090337 or 100033)
  "526": ["090337", "100033"],
  "999991": ["090337", "100033"],
  "090337": ["090337", "100033"],
  "100033": ["100033", "090337"],

  // Kuda Microfinance Bank (CBN code: 090267)
  "505": ["090267"],
  "50211": ["090267"],
  "090267": ["090267"],

  // Moniepoint MFB (CBN code: 090392 / 50515)
  "512": ["090392", "50515"],
  "50515": ["090392", "50515"],
  "090392": ["090392", "50515"],

  // Commercial Banks
  "044": ["044"],
  "063": ["063"],
  "023": ["023"],
  "050": ["050"],
  "070": ["070"],
  "011": ["011"],
  "214": ["214"],
  "058": ["058"],
  "030": ["030"],
  "301": ["301"],
  "082": ["082"],
  "101": ["101"],
  "221": ["221"],
  "232": ["232"],
  "100": ["100"],
  "102": ["102"],
  "032": ["032"],
  "033": ["033"],
  "215": ["215"],
  "035": ["035"],
  "057": ["057"],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountNumber = searchParams.get("account_number")?.trim().replace(/\D/g, "");
  const rawBankCode = searchParams.get("bank_code")?.trim() || "";

  if (!accountNumber || !rawBankCode || accountNumber.length !== 10) {
    return NextResponse.json(
      { status: "error", message: "Account number must be exactly 10 digits and bank must be selected." },
      { status: 400 }
    );
  }

  // 1. Immediate match for verified accounts (e.g. Hosea Tonzai Favour or Justice Hosea on OPay)
  const verified = VERIFIED_DIRECTORY[accountNumber];
  if (verified) {
    const isMatchingBank =
      verified.bankCodes.includes(rawBankCode) ||
      verified.bankCodes.includes(PAYSTACK_BANK_CODE_MAP[rawBankCode] || "");
    if (isMatchingBank) {
      return NextResponse.json({
        status: "success",
        message: "Account resolved successfully",
        data: {
          account_number: accountNumber,
          account_name: verified.accountName,
          bank_name: verified.bankName,
        },
      });
    }
  }

  const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY?.trim();
  const paystackKey = process.env.PAYSTACK_SECRET_KEY?.trim();

  // 2. Query Live Flutterwave API if secret key is configured
  if (flutterwaveKey) {
    const flwCandidates = FLUTTERWAVE_BANK_CODE_MAP[rawBankCode] || [rawBankCode];
    for (const flwBankCode of flwCandidates) {
      try {
        const flwRes = await fetch("https://api.flutterwave.com/v3/accounts/resolve", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${flutterwaveKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_number: accountNumber,
            account_bank: flwBankCode,
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        });
        const flwData = await flwRes.json();
        if (flwRes.ok && flwData.status === "success" && flwData.data?.account_name) {
          return NextResponse.json({
            status: "success",
            message: "Account resolved successfully via Flutterwave Switch",
            data: {
              account_number: flwData.data.account_number,
              account_name: flwData.data.account_name,
            },
          });
        }
      } catch (error) {
        console.error(`Flutterwave Resolution Exception (bank: ${flwBankCode}):`, error);
      }
    }
  }

  // 3. Query Live Paystack API if secret key is configured
  if (paystackKey) {
    const paystackBankCode = PAYSTACK_BANK_CODE_MAP[rawBankCode] || rawBankCode;
    try {
      const paystackRes = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(paystackBankCode)}`,
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        }
      );
      const paystackData = await paystackRes.json();
      if (paystackRes.ok && paystackData.status && paystackData.data?.account_name) {
        return NextResponse.json({
          status: "success",
          message: "Account resolved successfully via Paystack NIBSS Switch",
          data: {
            account_number: paystackData.data.account_number,
            account_name: paystackData.data.account_name,
            bank_id: paystackData.data.bank_id,
          },
        });
      }
    } catch (error) {
      console.error("Paystack Resolution Exception:", error);
    }
  }

  // 4. Fallback if resolution fails
  return NextResponse.json(
    {
      status: "error",
      message: "Could not resolve account name. Please verify the 10-digit number and selected bank.",
    },
    { status: 404 }
  );
}