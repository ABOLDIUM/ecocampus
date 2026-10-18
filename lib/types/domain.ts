export type AccountCategory = "STUDENT" | "CORP_MEMBER";

export type VerificationStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "VERIFIED"
  | "FAILED"
  | "REQUIRES_REVIEW";

export interface TransactionRecord {
  id: string;
  reference: string;
  type: "CREDIT" | "DEBIT";
  category: "TRANSFER" | "AIRTIME" | "DATA" | "CASHBACK" | "LOAN" | "DEPOSIT";
  title: string;
  counterpartyName: string;
  counterpartyAccount: string;
  amountKobo: number;
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  narration: string;
  createdAt: string;
}

export interface EcoCampusUser {
  id: string;
  customerId: string;
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  accountType: AccountCategory;
  accountNumber: string;
  balanceKobo: number;
  usdBalanceCents: number;
  cashbackKobo: number;
  referralCount: number;
  referralCode: string;
  checkInStreak: number;
  unreadNotifications: number;
  institution?: string;
  faculty?: string;
  department?: string;
  matricNumber?: string;
  level?: string;
  cgpaStanding?: string;
  nyscStateCode?: string;
  nyscPpa?: string;
  ninStatus: VerificationStatus;
  bvnStatus: VerificationStatus;
  academicOrNyscStatus: VerificationStatus;
  createdAt: string;
  transactions: TransactionRecord[];
}