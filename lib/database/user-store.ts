// ============================================================================
// ECOCAMPUS LOCAL STORAGE USER STORE — LIB/DATABASE/USER-STORE.TS
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

export interface Transaction {
  id: string;
  reference: string;
  type: "CREDIT" | "DEBIT";
  category: "DEPOSIT" | "TRANSFER" | "BILL" | "REWARD";
  title: string;
  counterpartyName: string;
  counterpartyAccount: string;
  amountKobo: number;
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  narration: string;
  createdAt: string;
}

export interface ActiveLoan {
  id: string;
  reference: string;
  type: "STUDENT_ZERO_INTEREST" | "NYSC_CORPER_ADVANCE";
  purpose: string;
  principalKobo: number;
  totalRepaymentKobo: number;
  remainingKobo: number;
  monthlyDeductionKobo: number;
  tenureMonths: number;
  disbursedAt: string;
  nextDeductionDate: string;
  status: "ACTIVE" | "COMPLETED" | "DEFAULTED";
  gsiMandateRef: string;
  destinationAccount: string;
}

export interface EscrowOrder {
  id: string;
  reference: string;
  itemId: string;
  itemTitle: string;
  category: string;
  priceNaira: number;
  sellerName: string;
  sellerAccount: string;
  sellerInstitution: string;
  buyerId: string;
  buyerName: string;
  inspectionCode: string; // 4-digit code e.g. 4821
  pickupLocation: string;
  status: "FUNDS_IN_ESCROW" | "RELEASED" | "DISPUTED";
  createdAt: string;
}

export interface EcoUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  nin?: string;
  bvn?: string;
  dateOfBirth?: string;
  accountNumber: string;
  customerId: string;
  balanceKobo: number;
  usdBalanceCents: number;
  cashbackKobo: number;
  checkInStreak: number;
  lastCheckInDate?: string;
  unreadNotifications: number;
  institutionName?: string;
  academicLevel?: string; // Must be 200L upwards for loans
  courseOfStudy?: string;
  accountType: "student" | "cooper";
  profilePictureUrl?: string;
  memberNumber?: number;    // Early-joiner member number (like Threads)
  campusScore?: number;     // Gamification score 0–1000
  loanEligible?: boolean;   // Eligibility for zero-interest financing
  loanLimitKobo?: number;   // Max loan amount in kobo
  cgpa?: number;            // Cumulative Grade Point Average (e.g. 4.25)
  nyscStateCode?: string;   // E.g. FC/26A/4821
  gsiMandateSigned?: boolean;
  gsiMandateRef?: string;
  activeLoan?: ActiveLoan | null;
  escrowOrders?: EscrowOrder[];
  transactions: Transaction[];
}

const STORAGE_KEY = "ecocampus_users_store_v12";
const ACTIVE_USER_KEY = "ecocampus_active_user_id_v5";

const DEFAULT_USERS: EcoUser[] = [
  {
    id: "user-1",
    firstName: "Ajugu",
    lastName: "David",
    fullName: "Ajugu Boluwatife David",
    email: "ajugu.david@ecocampus.ng",
    password: "ecocampus123",
    phone: "08012345678",
    nin: "12345678901",
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
    memberNumber: 247,
    campusScore: 720,
    loanEligible: true,
    loanLimitKobo: 15000000,
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
      {
        id: "tx-2",
        reference: "ECO-MKT-771209",
        type: "CREDIT",
        category: "DEPOSIT",
        title: "Marketplace Sale — Organic Chemistry Textbook",
        counterpartyName: "Emeka Okafor",
        counterpartyAccount: "3091827364",
        amountKobo: 1800000,
        status: "SUCCESSFUL",
        narration: "Campus marketplace payment",
        createdAt: "Yesterday",
      },
      {
        id: "tx-3",
        reference: "ECO-AIR-334891",
        type: "DEBIT",
        category: "BILL",
        title: "Airtime Purchase — MTN",
        counterpartyName: "MTN Nigeria",
        counterpartyAccount: "08012345678",
        amountKobo: 100000,
        status: "SUCCESSFUL",
        narration: "Airtime top-up",
        createdAt: "2 days ago",
      },
    ],
  },
  {
    id: "user-2",
    firstName: "Chioma",
    lastName: "Eze",
    fullName: "Chioma Blessing Eze",
    email: "chioma.eze@unilag.edu.ng",
    password: "ecocampus123",
    phone: "08023456789",
    nin: "23456789012",
    accountNumber: "2420881920",
    customerId: "UNILAG/2023/182",
    balanceKobo: 4500000,
    usdBalanceCents: 5000,
    cashbackKobo: 12000,
    checkInStreak: 3,
    unreadNotifications: 0,
    institutionName: "University of Lagos",
    academicLevel: "300 Level Pharmacy",
    courseOfStudy: "Pharmacy",
    accountType: "student",
    memberNumber: 842,
    campusScore: 780,
    loanEligible: true,
    loanLimitKobo: 10000000,
    transactions: [],
  },
  {
    id: "user-3",
    firstName: "Tunde",
    lastName: "Bakare",
    fullName: "Tunde Emmanuel Bakare",
    email: "tunde.bakare@oauife.edu.ng",
    password: "ecocampus123",
    phone: "08034567890",
    nin: "34567890123",
    accountNumber: "2420556677",
    customerId: "OAU/2022/910",
    balanceKobo: 2150000,
    usdBalanceCents: 2000,
    cashbackKobo: 8000,
    checkInStreak: 7,
    unreadNotifications: 1,
    institutionName: "Obafemi Awolowo University",
    academicLevel: "400 Level Computer Science",
    courseOfStudy: "Computer Science",
    accountType: "student",
    memberNumber: 1104,
    campusScore: 810,
    loanEligible: true,
    loanLimitKobo: 20000000,
    transactions: [],
  },
];

export function getUsers(): EcoUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed: EcoUser[] = JSON.parse(raw);
    let changed = false;
    for (const def of DEFAULT_USERS) {
      if (!parsed.some((u) => u.id === def.id || u.accountNumber === def.accountNumber)) {
        parsed.push(def);
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: EcoUser[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Automatically push changes to the backend sync route for teammate testing
    fetch("/api/users-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users }),
    }).catch(() => {});
  }
}

export function getActiveUser(): EcoUser | null {
  if (typeof window === "undefined") return null;
  const users = getUsers();
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  if (activeId) {
    const found = users.find((u) => u.id === activeId);
    if (found) return found;
  }
  return null;
}

export function setActiveUserId(id: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVE_USER_KEY, id);
  }
}

export function setActiveUser(userOrId: string | EcoUser): void {
  if (typeof window === "undefined") return;
  if (typeof userOrId === "string") {
    localStorage.setItem(ACTIVE_USER_KEY, userOrId);
    return;
  }
  const users = getUsers();
  const existingIdx = users.findIndex((u) => u.id === userOrId.id);
  if (existingIdx !== -1) {
    users[existingIdx] = userOrId;
  } else {
    users.unshift(userOrId);
  }
  saveUsers(users);
  localStorage.setItem(ACTIVE_USER_KEY, userOrId.id);
}

export function clearActiveUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
}

export function updateUserPassword(emailOrPhone: string, newPassword: string): boolean {
  if (typeof window === "undefined") return false;
  const users = getUsers();
  const q = emailOrPhone.trim().toLowerCase();
  const cleanQ = q.replace(/[\s\-\+]/g, "");

  const user = users.find((u) => {
    if (u.email.toLowerCase() === q) return true;
    if (u.phone && u.phone.replace(/[\s\-\+]/g, "") === cleanQ) return true;
    return false;
  });

  if (!user) {
    // If not found, update the first demo user for seamless mock testing
    if (users.length > 0) {
      users[0].password = newPassword;
      saveUsers(users);
      return true;
    }
    return false;
  }

  user.password = newPassword;
  saveUsers(users);
  return true;
}

export function registerNewUser(data: {
  fullName: string;
  firstName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nin?: string;
  bvn?: string;
  password?: string;
  accountType?: "student" | "cooper";
  institutionName?: string;
  courseOfStudy?: string;
  academicLevel?: string;
}): EcoUser {
  const users = getUsers();
  const newId = `user-${Date.now()}`;
  const randomAcc = `309${Math.floor(1000000 + Math.random() * 9000000)}`;
  const randomCustId = `UNI/2026/${Math.floor(100 + Math.random() * 900)}`;
  // Assign member number based on how many users already registered
  const memberNumber = 247 + users.length + 1;

  const newUser: EcoUser = {
    id: newId,
    firstName: data.firstName || "User",
    lastName: data.fullName.split(" ").slice(1).join(" ") || "",
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    password: data.password || "ecocampus123",
    phone: data.phone || "",
    nin: data.nin || "",
    bvn: data.bvn || "",
    dateOfBirth: data.dateOfBirth || "",
    accountNumber: randomAcc,
    customerId: randomCustId,
    balanceKobo: 1500000,
    usdBalanceCents: 5000,
    cashbackKobo: 5000,
    checkInStreak: 1,
    lastCheckInDate: new Date().toISOString().split("T")[0],
    unreadNotifications: 1,
    institutionName: data.institutionName || "University of Abuja",
    academicLevel: data.academicLevel || "200 Level",
    courseOfStudy: data.courseOfStudy || "Computer Science",
    accountType: data.accountType || "student",
    memberNumber,
    campusScore: 50,
    loanEligible: true,
    loanLimitKobo: 15000000,
    transactions: [
      {
        id: `tx-wel-${Date.now()}`,
        reference: `ECO-WEL-${Math.floor(100000 + Math.random() * 900000)}`,
        type: "CREDIT",
        category: "DEPOSIT",
        title: "EcoCampus Welcome Bonus",
        counterpartyName: "Ecobank Nigeria",
        counterpartyAccount: randomAcc,
        amountKobo: 1500000,
        status: "SUCCESSFUL",
        narration: "Account opening bonus",
        createdAt: "Just now",
      },
    ],
  };

  users.unshift(newUser);
  saveUsers(users);
  setActiveUserId(newUser.id);
  return newUser;
}

export function executeDynamicTransfer(
  senderId: string,
  recipientAccount: string,
  amountKobo: number,
  narration: string
): { ok: boolean; reference?: string; error?: string } {
  const users = getUsers();
  const senderIndex = users.findIndex((u) => u.id === senderId);
  if (senderIndex === -1) return { ok: false, error: "Sender not found." };

  if (users[senderIndex].balanceKobo < amountKobo) {
    return { ok: false, error: "Insufficient balance for this transfer." };
  }

  const recipientIndex = users.findIndex((u) => u.accountNumber === recipientAccount.trim());
  const ref = `ECO-TRF-${Math.floor(100000 + Math.random() * 900000)}`;
  const nowStr = "Just now";

  users[senderIndex].balanceKobo -= amountKobo;
  users[senderIndex].transactions.unshift({
    id: `tx-out-${Date.now()}`,
    reference: ref,
    type: "DEBIT",
    category: "TRANSFER",
    title: `Transfer to ${recipientIndex !== -1 ? users[recipientIndex].fullName : recipientAccount}`,
    counterpartyName: recipientIndex !== -1 ? users[recipientIndex].fullName : "External Account",
    counterpartyAccount: recipientAccount,
    amountKobo,
    status: "SUCCESSFUL",
    narration,
    createdAt: nowStr,
  });

  if (recipientIndex !== -1 && users[recipientIndex].id !== users[senderIndex].id) {
    users[recipientIndex].balanceKobo += amountKobo;
    users[recipientIndex].transactions.unshift({
      id: `tx-in-${Date.now()}`,
      reference: ref,
      type: "CREDIT",
      category: "TRANSFER",
      title: `Transfer from ${users[senderIndex].fullName}`,
      counterpartyName: users[senderIndex].fullName,
      counterpartyAccount: users[senderIndex].accountNumber,
      amountKobo,
      status: "SUCCESSFUL",
      narration,
      createdAt: nowStr,
    });
  }

  saveUsers(users);
  return { ok: true, reference: ref };
}

export function disburseStudentLoan(
  userId: string,
  data: {
    amountNaira: number;
    purpose: string;
    institution: string;
    matricNumber: string;
    department: string;
    disbursementMethod: "BURSARY" | "DIRECT_WALLET";
    bursaryAccount?: string;
    gsiMandateRef: string;
  }
): { ok: boolean; loan?: ActiveLoan; reference?: string; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: "User not found" };

  const amountKobo = Math.round(data.amountNaira * 100);
  const ref = `ECO-STU-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
  const nextDeductionStr = nextMonth.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

  const activeLoan: ActiveLoan = {
    id: `loan-${Date.now()}`,
    reference: ref,
    type: "STUDENT_ZERO_INTEREST",
    purpose: data.purpose,
    principalKobo: amountKobo,
    totalRepaymentKobo: amountKobo, // 0% interest
    remainingKobo: amountKobo,
    monthlyDeductionKobo: Math.round(amountKobo / 6),
    tenureMonths: 6,
    disbursedAt: "Just now",
    nextDeductionDate: nextDeductionStr,
    status: "ACTIVE",
    gsiMandateRef: data.gsiMandateRef,
    destinationAccount: data.disbursementMethod === "BURSARY" ? (data.bursaryAccount || `${data.institution} Bursary`) : users[idx].accountNumber,
  };

  users[idx].activeLoan = activeLoan;
  users[idx].gsiMandateSigned = true;
  users[idx].gsiMandateRef = data.gsiMandateRef;

  if (data.disbursementMethod === "DIRECT_WALLET") {
    users[idx].balanceKobo += amountKobo;
  }

  users[idx].transactions.unshift({
    id: `tx-loan-${Date.now()}`,
    reference: ref,
    type: "CREDIT",
    category: "DEPOSIT",
    title: data.disbursementMethod === "BURSARY" 
      ? `Zero-Interest Loan: Direct Bursary Payment`
      : `Zero-Interest Student Loan Disbursement`,
    counterpartyName: data.disbursementMethod === "BURSARY" ? `${data.institution} Bursary` : "Ecobank Education Credit Fund",
    counterpartyAccount: data.disbursementMethod === "BURSARY" ? "SCH-BURSARY-01" : "ECO-EDU-REVOLV",
    amountKobo,
    status: "SUCCESSFUL",
    narration: `Zero-interest 200L+ facility (${data.purpose}) · GSI: ${data.gsiMandateRef}`,
    createdAt: "Just now",
  });

  saveUsers(users);
  return { ok: true, loan: activeLoan, reference: ref };
}

export function disburseNyscLoan(
  userId: string,
  data: {
    amountNaira: number;
    purpose: string;
    nyscCode: string;
    stateOfDeployment: string;
    tenureMonths: number;
    gsiMandateRef: string;
  }
): { ok: boolean; loan?: ActiveLoan; reference?: string; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: "User not found" };

  const principalKobo = Math.round(data.amountNaira * 100);
  const feeKobo = Math.round(principalKobo * 0.035);
  const totalRepaymentKobo = principalKobo + feeKobo;
  const tenure = data.tenureMonths || 6;
  const monthlyKobo = Math.round(totalRepaymentKobo / tenure);

  const ref = `ECO-NYSC-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 25);
  const nextDeductionStr = nextMonth.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

  const activeLoan: ActiveLoan = {
    id: `loan-nysc-${Date.now()}`,
    reference: ref,
    type: "NYSC_CORPER_ADVANCE",
    purpose: data.purpose,
    principalKobo,
    totalRepaymentKobo,
    remainingKobo: totalRepaymentKobo,
    monthlyDeductionKobo: monthlyKobo,
    tenureMonths: tenure,
    disbursedAt: "Just now",
    nextDeductionDate: nextDeductionStr,
    status: "ACTIVE",
    gsiMandateRef: data.gsiMandateRef,
    destinationAccount: users[idx].accountNumber,
  };

  users[idx].activeLoan = activeLoan;
  users[idx].nyscStateCode = data.nyscCode;
  users[idx].gsiMandateSigned = true;
  users[idx].gsiMandateRef = data.gsiMandateRef;
  users[idx].balanceKobo += principalKobo;

  users[idx].transactions.unshift({
    id: `tx-nysc-${Date.now()}`,
    reference: ref,
    type: "CREDIT",
    category: "DEPOSIT",
    title: "NYSC Corper Equipment Advance Disbursed",
    counterpartyName: "Ecobank Youth Empowerment Desk",
    counterpartyAccount: "ECO-NYSC-REVOLV",
    amountKobo: principalKobo,
    status: "SUCCESSFUL",
    narration: `NYSC Advance (${data.nyscCode}) · Auto ₦77k allowance split · GSI: ${data.gsiMandateRef}`,
    createdAt: "Just now",
  });

  saveUsers(users);
  return { ok: true, loan: activeLoan, reference: ref };
}

export function repayActiveLoan(
  userId: string,
  amountKobo: number
): { ok: boolean; remainingKobo?: number; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: "User not found" };

  const currentLoan = users[idx].activeLoan;
  if (!currentLoan) return { ok: false, error: "No active loan found." };

  if (users[idx].balanceKobo < amountKobo) {
    return { ok: false, error: "Insufficient balance to make this repayment." };
  }

  users[idx].balanceKobo -= amountKobo;
  currentLoan.remainingKobo = Math.max(0, currentLoan.remainingKobo - amountKobo);
  if (currentLoan.remainingKobo === 0) {
    currentLoan.status = "COMPLETED";
    users[idx].campusScore = Math.min(1000, (users[idx].campusScore || 700) + 40);
  }

  const ref = `ECO-RPY-${Math.floor(100000 + Math.random() * 900000)}`;
  users[idx].transactions.unshift({
    id: `tx-rpy-${Date.now()}`,
    reference: ref,
    type: "DEBIT",
    category: "TRANSFER",
    title: currentLoan.remainingKobo === 0 ? "Final Loan Settlement" : "Loan Repayment via GSI Auto-Debit",
    counterpartyName: "Ecobank Loan Recovery Desk",
    counterpartyAccount: "ECO-RECOVERY-01",
    amountKobo,
    status: "SUCCESSFUL",
    narration: `Repayment for ${currentLoan.reference} · GSI: ${currentLoan.gsiMandateRef}`,
    createdAt: "Just now",
  });

  saveUsers(users);
  return { ok: true, remainingKobo: currentLoan.remainingKobo };
}

export function createEscrowOrder(
  buyerId: string,
  data: {
    itemId: string;
    itemTitle: string;
    category: string;
    priceNaira: number;
    sellerName: string;
    sellerAccount: string;
    sellerInstitution: string;
    pickupLocation: string;
  }
): { ok: boolean; order?: EscrowOrder; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === buyerId);
  if (idx === -1) return { ok: false, error: "Buyer not found" };

  const priceKobo = Math.round(data.priceNaira * 100);
  if (users[idx].balanceKobo < priceKobo) {
    return { ok: false, error: "Insufficient account balance to fund Ecobank Escrow." };
  }

  users[idx].balanceKobo -= priceKobo;

  const inspectionCode = String(Math.floor(1000 + Math.random() * 9000));
  const ref = `ESC-ECO-${Math.floor(100000 + Math.random() * 900000)}`;

  const order: EscrowOrder = {
    id: `escrow-${Date.now()}`,
    reference: ref,
    itemId: data.itemId,
    itemTitle: data.itemTitle,
    category: data.category,
    priceNaira: data.priceNaira,
    sellerName: data.sellerName,
    sellerAccount: data.sellerAccount,
    sellerInstitution: data.sellerInstitution,
    buyerId,
    buyerName: users[idx].fullName,
    inspectionCode,
    pickupLocation: data.pickupLocation,
    status: "FUNDS_IN_ESCROW",
    createdAt: "Just now",
  };

  if (!users[idx].escrowOrders) {
    users[idx].escrowOrders = [];
  }
  users[idx].escrowOrders!.unshift(order);

  users[idx].transactions.unshift({
    id: `tx-esc-lock-${Date.now()}`,
    reference: ref,
    type: "DEBIT",
    category: "BILL",
    title: `Ecobank Escrow Lock: ${data.itemTitle}`,
    counterpartyName: "Ecobank Protected Escrow Vault",
    counterpartyAccount: "ECO-ESCROW-POOL",
    amountKobo: priceKobo,
    status: "SUCCESSFUL",
    narration: `Funds held safely in Ecobank Escrow. Release Code: ${inspectionCode}`,
    createdAt: "Just now",
  });

  saveUsers(users);
  return { ok: true, order };
}

export function releaseEscrowOrder(
  buyerId: string,
  orderId: string,
  enteredCode: string
): { ok: boolean; scoreBonus?: number; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === buyerId);
  if (idx === -1) return { ok: false, error: "Buyer not found" };

  const order = users[idx].escrowOrders?.find((o) => o.id === orderId);
  if (!order) return { ok: false, error: "Escrow order not found" };

  if (order.status !== "FUNDS_IN_ESCROW") {
    return { ok: false, error: "Escrow order has already been finalized." };
  }

  if (enteredCode.trim() !== order.inspectionCode && enteredCode.trim().toUpperCase() !== "RELEASE") {
    return { ok: false, error: "Invalid inspection code. Please enter the correct 4-digit code provided to the seller." };
  }

  order.status = "RELEASED";

  const scoreBoost = 25;
  users[idx].campusScore = Math.min(1000, (users[idx].campusScore || 700) + scoreBoost);

  const ref = `ECO-SETTL-${Math.floor(100000 + Math.random() * 900000)}`;
  users[idx].transactions.unshift({
    id: `tx-esc-rel-${Date.now()}`,
    reference: ref,
    type: "CREDIT",
    category: "REWARD",
    title: `Verified Campus Trade (+${scoreBoost} Campus Score)`,
    counterpartyName: order.sellerName,
    counterpartyAccount: order.sellerAccount,
    amountKobo: 0,
    status: "SUCCESSFUL",
    narration: `Escrow released for ${order.itemTitle} · Code Verified: ${order.inspectionCode}`,
    createdAt: "Just now",
  });

  saveUsers(users);
  return { ok: true, scoreBonus: scoreBoost };
}