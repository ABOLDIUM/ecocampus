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

export async function resolveBankAccountNumber(
  accountNumber: string,
  bankCode: string
): Promise<AccountResolutionResult> {
  const cleanAcc = accountNumber.trim();
  if (cleanAcc.length !== 10) {
    return {
      success: false,
      accountName: "",
      bankName: "",
      error: "Account number must be 10 digits.",
    };
  }

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
  }

  try {
    const res = await fetch(`/api/resolve-account?account_number=${cleanAcc}&bank_code=${bankCode}`);
    const data = await res.json();

    if (data.status === "success" && data.data?.account_name) {
      return {
        success: true,
        accountName: data.data.account_name.toUpperCase(),
        bankName: "Commercial Bank",
      };
    } else {
      return {
        success: false,
        accountName: "",
        bankName: "",
        error: "Account not found. Verify the number and bank.",
      };
    }
  } catch {
    return {
      success: false,
      accountName: "",
      bankName: "",
      error: "Network verification error.",
    };
  }
}