// ============================================================================
// ECOCAMPUS BANKING, CARD & DOMICILIARY SERVICES — LIB/API/BANKING-SERVICES.TS
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

import { getUsers, EcoUser } from "@/lib/database/user-store";

export type CardNetwork = "VERVE" | "VISA" | "MASTERCARD";

export interface AccountResolutionResult {
  success: boolean;
  accountName: string;
  bankName: string;
  error?: string;
}

export interface LocalVirtualCard {
  isProvisioned: boolean;
  network: CardNetwork;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  status: "ACTIVE" | "FROZEN";
}

export interface UsdDomiciliaryProfile {
  hasDomAccount: boolean;
  domAccountNumber: string;
  routingSwift: string;
  usdBalanceCents: number;
  hasUsdCard: boolean;
  usdCardNetwork: CardNetwork;
  usdCardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface UserBankingProducts {
  localCard: LocalVirtualCard;
  domProfile: UsdDomiciliaryProfile;
}

const PRODUCT_STORAGE_PREFIX = "ecocampus_banking_products_v2_";

function generateCardNumber(network: CardNetwork, seedAccount: string): string {
  const s1 = seedAccount.slice(0, 4);
  const s2 = seedAccount.slice(4, 8);
  const s3 = seedAccount.slice(-2);

  if (network === "VERVE") {
    return `5061 02${s3} ${s1} ${s2}`;
  }
  if (network === "VISA") {
    return `4263 98${s3} ${s1} ${s2}`;
  }
  return `5399 41${s3} ${s1} ${s2}`;
}

export function getUserBankingProducts(user: EcoUser): UserBankingProducts {
  if (typeof window === "undefined") {
    return getDefaultProducts(user);
  }

  const raw = localStorage.getItem(`${PRODUCT_STORAGE_PREFIX}${user.id}`);
  if (raw) {
    try {
      const parsed: UserBankingProducts = JSON.parse(raw);
      parsed.domProfile.usdBalanceCents = user.usdBalanceCents || 0;
      return parsed;
    } catch {
      // Fallback on parse error
    }
  }

  return getDefaultProducts(user);
}

function getDefaultProducts(user: EcoUser): UserBankingProducts {
  const suffix = user.accountNumber.slice(-3);
  return {
    localCard: {
      isProvisioned: false,
      network: "VERVE",
      cardNumber: generateCardNumber("VERVE", user.accountNumber),
      expiryDate: "09/29",
      cvv: `${(Number(suffix) % 800) + 100}`,
      status: "ACTIVE",
    },
    domProfile: {
      hasDomAccount: false,
      domAccountNumber: `349${user.accountNumber.slice(0, 7)}`,
      routingSwift: "ECOCNGLA",
      usdBalanceCents: user.usdBalanceCents || 0,
      hasUsdCard: false,
      usdCardNetwork: "VISA",
      usdCardNumber: generateCardNumber("VISA", user.accountNumber.split("").reverse().join("")),
      expiryDate: "11/29",
      cvv: `${((Number(suffix) + 317) % 800) + 100}`,
    },
  };
}

export function saveUserBankingProducts(userId: string, products: UserBankingProducts): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${PRODUCT_STORAGE_PREFIX}${userId}`, JSON.stringify(products));
  }
}

export function createLocalVirtualCard(user: EcoUser, network: CardNetwork): UserBankingProducts {
  const current = getUserBankingProducts(user);
  current.localCard = {
    ...current.localCard,
    isProvisioned: true,
    network,
    cardNumber: generateCardNumber(network, user.accountNumber),
  };
  saveUserBankingProducts(user.id, current);
  return current;
}

export function openUsdDomiciliaryAccount(user: EcoUser): UserBankingProducts {
  const current = getUserBankingProducts(user);
  current.domProfile.hasDomAccount = true;
  saveUserBankingProducts(user.id, current);
  return current;
}

export function createUsdVirtualCard(user: EcoUser, network: CardNetwork): UserBankingProducts {
  const current = getUserBankingProducts(user);
  current.domProfile.hasUsdCard = true;
  current.domProfile.usdCardNetwork = network;
  current.domProfile.usdCardNumber = generateCardNumber(
    network,
    user.accountNumber.split("").reverse().join("")
  );
  saveUserBankingProducts(user.id, current);
  return current;
}

const MOCK_ECO_STUDENTS = [
  "CHINEDU OKAFOR (University of Abuja)",
  "AMINA BELLO (NYSC Lagos)",
  "ESTHER ADEBAYO (Covenant University)",
  "OLUMIDE JOHNSON (UNILAG)",
  "FATIMA DANGOTE (Bayero University Kano)",
  "EMMANUEL EZE (University of Nigeria)",
  "ZAINAB ALIYU (Ahmadu Bello University)",
];

// Verified Real Commercial Accounts Directory
export const VERIFIED_COMMERCIAL_ACCOUNTS: Record<
  string,
  { name: string; bankCodes: string[]; bankName: string }
> = {
  "8139416441": {
    name: "HOSEA TONZAI FAVOUR",
    bankCodes: ["999", "999992", "090405", "100004", "OPAY"],
    bankName: "OPay Digital Services",
  },
  "9161139091": {
    name: "JUSTICE HOSEA",
    bankCodes: ["999", "999992", "090405", "100004", "OPAY"],
    bankName: "OPay Digital Services",
  },
};

export async function resolveBankAccountNumber(
  accountNumber: string,
  bankCode: string
): Promise<AccountResolutionResult> {
  const cleanAcc = accountNumber.trim().replace(/\D/g, "");
  if (cleanAcc.length !== 10) {
    return {
      success: false,
      accountName: "",
      bankName: "",
      error: "Account number must be exactly 10 digits.",
    };
  }

  // 1. EcoCampus internal resolution
  if (bankCode === "ECO" || bankCode === "30948") {
    const allUsers = getUsers();
    const found = allUsers.find((u) => u.accountNumber === cleanAcc);
    if (found) {
      return {
        success: true,
        accountName: found.fullName.toUpperCase(),
        bankName: "EcoCampus Digital Bank",
      };
    }
    return {
      success: false,
      accountName: "",
      bankName: "EcoCampus Digital Bank",
      error: "No EcoCampus account found matching this number.",
    };
  }

  // 2. Check verified real accounts (e.g. Hosea Tonzai Favour on OPay)
  const verified = VERIFIED_COMMERCIAL_ACCOUNTS[cleanAcc];
  if (verified) {
    return {
      success: true,
      accountName: verified.name,
      bankName: verified.bankName,
    };
  }

  // 3. Commercial Banks — Query live API endpoint (Paystack / Flutterwave)
  try {
    const res = await fetch(`/api/resolve-account?account_number=${cleanAcc}&bank_code=${encodeURIComponent(bankCode)}`);
    const data = await res.json();
    if (res.ok && data.status === "success" && data.data?.account_name) {
      return {
        success: true,
        accountName: data.data.account_name.toUpperCase(),
        bankName: data.data.bank_name || "Commercial Bank",
      };
    }
    return {
      success: false,
      accountName: "",
      bankName: "Commercial Bank",
      error: data.message || "Account could not be resolved. Please verify details.",
    };
  } catch {
    return {
      success: false,
      accountName: "",
      bankName: "Commercial Bank",
      error: "Network error connecting to NIBSS switch. Please check your connection.",
    };
  }
}