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

export interface EcoUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
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
  courseOfStudy?: string; // Added course of study
  accountType: "student" | "cooper";
  profilePictureUrl?: string;
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

export function getUsers(): EcoUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: EcoUser[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
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
  if (users.length > 0) {
    localStorage.setItem(ACTIVE_USER_KEY, users[0].id);
    return users[0];
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

export function registerNewUser(data: {
  fullName: string;
  firstName: string;
  email: string;
  accountType?: "student" | "cooper";
  institutionName?: string;
  courseOfStudy?: string;
  academicLevel?: string;
}): EcoUser {
  const users = getUsers();
  const newId = `user-${Date.now()}`;
  const randomAcc = `309${Math.floor(1000000 + Math.random() * 9000000)}`;
  const randomCustId = `UNI/2026/${Math.floor(100 + Math.random() * 900)}`;

  const newUser: EcoUser = {
    id: newId,
    firstName: data.firstName || "User",
    lastName: data.fullName.split(" ").slice(1).join(" ") || "",
    fullName: data.fullName,
    email: data.email.toLowerCase(),
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