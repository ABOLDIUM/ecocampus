export interface UserSession {
  customerId: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "CORP_MEMBER" | "ADMIN";
  institutionName: string;
  identifier: string; // Matric number or NYSC state code
  balanceKobo: number;
  accountNumber: string;
}

export function getStoredSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("ecocampus_session");
  if (!raw) {
    // Default professional fallback session if none stored yet
    return {
      customerId: "EC-2026-8801",
      fullName: "Ajugu Boluwatife David",
      email: "david@uniabuja.edu.ng",
      role: "STUDENT",
      institutionName: "University of Abuja (UNIABUJA)",
      identifier: "24/203MBB/472",
      balanceKobo: 11130024,
      accountNumber: "3094827101",
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(session: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ecocampus_session", JSON.stringify(session));
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ecocampus_session");
}