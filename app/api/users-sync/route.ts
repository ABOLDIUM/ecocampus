// ============================================================================
// ECOCAMPUS TEAM SYNC LEDGER API — APP/API/USERS-SYNC/ROUTE.TS
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { EcoUser } from "@/lib/database/user-store";

const globalForEco = globalThis as unknown as {
  ecoSharedUsers?: EcoUser[];
};

if (!globalForEco.ecoSharedUsers) {
  globalForEco.ecoSharedUsers = [
    {
      id: "user-1",
      firstName: "Ajugu",
      lastName: "David",
      fullName: "Ajugu Boluwatife David",
      email: "ajugu.david@ecocampus.ng",
      accountNumber: "2420347201",
      customerId: "UNIABUJA/2024/472",
      balanceKobo: 12450000,
      usdBalanceCents: 20500,
      cashbackKobo: 34000,
      checkInStreak: 5,
      lastCheckInDate: new Date().toISOString().split("T")[0],
      unreadNotifications: 2,
      institutionName: "University of Abuja",
      academicLevel: "200 Level MBBS",
      courseOfStudy: "Medicine and Surgery",
      accountType: "student",
      transactions: [
        {
          id: "tx-1",
          reference: "ECO-TRF-982314",
          type: "CREDIT",
          category: "DEPOSIT",
          title: "Stipend Deposit",
          counterpartyName: "Parent / Guardian",
          counterpartyAccount: "0123456789",
          amountKobo: 5000000,
          status: "SUCCESSFUL",
          narration: "Monthly upkeep allowance",
          createdAt: "2 hours ago",
        },
      ],
    },
  ];
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    users: globalForEco.ecoSharedUsers || [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incomingUsers: EcoUser[] = body.users;

    if (Array.isArray(incomingUsers)) {
      const current = globalForEco.ecoSharedUsers || [];
      const mergedMap = new Map<string, EcoUser>();

      for (const u of current) {
        mergedMap.set(u.accountNumber, u);
      }
      for (const inc of incomingUsers) {
        mergedMap.set(inc.accountNumber, inc);
      }

      globalForEco.ecoSharedUsers = Array.from(mergedMap.values());
    }

    return NextResponse.json({
      ok: true,
      users: globalForEco.ecoSharedUsers,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 400 });
  }
}