// ============================================================================
// ECOCAMPUS DASHBOARD — APP/PAGE.TSX
// Premium Fintech Dashboard | Sprint 1 Overhaul
// Electric Green × Deep Navy | LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatCentsToUsd, formatKoboToNaira } from "@/lib/formatting/currency";
import {
  executeDynamicTransfer,
  getActiveUser,
  getUsers,
  saveUsers,
  EcoUser,
} from "@/lib/database/user-store";
import { NIGERIAN_BANKS } from "@/lib/data/nigerian-banks";
import { resolveBankAccountNumber } from "@/lib/api/banking-services";
import styles from "./page.module.css";

// ── Static mock data for demo sections ─────────────────────────────────────

const OPPORTUNITIES = [
  {
    id: "opp-1",
    company: "Flutterwave",
    logo: "FL",
    logoColor: "#FF6600",
    type: "INTERN",
    title: "Product Design Intern",
    location: "Lagos",
    stipend: "₦150k/mo",
    deadline: "Nov 14",
  },
  {
    id: "opp-2",
    company: "Ecobank Nigeria",
    logo: "EB",
    logoColor: "#007749",
    type: "NYSC",
    title: "NYSC Corp Member — Tech",
    location: "Abuja",
    stipend: "₦33k/mo + Allowance",
    deadline: "Rolling",
  },
  {
    id: "opp-3",
    company: "Andela",
    logo: "AN",
    logoColor: "#1A1A2E",
    type: "GRAD",
    title: "Junior Software Engineer",
    location: "Remote",
    stipend: "₦400k/mo",
    deadline: "Dec 1",
  },
];

const COMMUNITY_COUNT_BASE = 47291;

// ── SVG Icon components ─────────────────────────────────────────────────────
const IconTransfer = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);
const IconBank = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const IconLoan = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const IconMarket = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const IconHome = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconOpportunity = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconProfile = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IconAirtime = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const IconData = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);
const IconUtility = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const IconRewards = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);
const IconCard = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const IconInvest = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const IconUSD = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconSkills = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// ── Campus Score Ring Component ─────────────────────────────────────────────
function CampusScoreRing({ score = 720 }: { score: number }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const maxScore = 1000;
  const fillPercent = Math.min(score / maxScore, 1);
  const dashOffset = circumference * (1 - fillPercent);

  return (
    <div className={styles.campusScoreWrap}>
      <div className={styles.campusScoreRing}>
        <svg className={styles.campusScoreSvg} viewBox="0 0 62 62">
          <circle
            className={styles.campusScoreTrack}
            cx="31" cy="31" r={radius}
          />
          <circle
            className={styles.campusScoreFill}
            cx="31" cy="31" r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className={styles.campusScoreCenter}>
          <span className={styles.campusScoreNum}>{score}</span>
          <span className={styles.campusScoreLabel}>Score</span>
        </div>
      </div>
      <span className={styles.campusScoreCaption}>Campus Score</span>
    </div>
  );
}

// ── Transaction Category Icon ───────────────────────────────────────────────
function TxIcon({ category, type }: { category: string; type: "CREDIT" | "DEBIT" }) {
  const iconClass = type === "CREDIT" ? styles.txIconCredit
    : category === "BILL" ? styles.txIconBill
    : styles.txIconDebit;

  const icon = type === "CREDIT"
    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    : category === "BILL"
    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4" /></svg>;

  return <div className={`${styles.txIconWrap} ${iconClass}`}>{icon}</div>;
}

// ── Main Dashboard Component ────────────────────────────────────────────────
export default function EcoCampusDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<EcoUser | null>(null);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [greetingText, setGreetingText] = useState<string>("Welcome");
  const [communityCount, setCommunityCount] = useState<number>(COMMUNITY_COUNT_BASE);

  // Transfer state
  const [transferMode, setTransferMode] = useState<"ECOCAMPUS" | "OTHER_BANKS">("ECOCAMPUS");
  const [recipientAccount, setRecipientAccount] = useState<string>("");
  const [selectedBankCode, setSelectedBankCode] = useState<string>(NIGERIAN_BANKS[0].code);
  const [recipientNameDisplay, setRecipientNameDisplay] = useState<string>("");
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [transferNaira, setTransferNaira] = useState<string>("");
  const [narration, setNarration] = useState<string>("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [toastAlert, setToastAlert] = useState<{ title: string; message: string } | null>(null);

  const loadActiveUserData = useCallback(() => {
    const loadedUsers = getUsers();
    const active = getActiveUser();
    if (!active) { router.push("/login"); return; }
    setCurrentUser(active);
    const other = loadedUsers.find((u) => u.id !== active.id);
    if (other && !recipientAccount) {
      setRecipientAccount(other.accountNumber);
      handleAccountInput(other.accountNumber, "ECOCAMPUS");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    loadActiveUserData();

    const hour = new Date().getHours();
    if (hour < 12) setGreetingText("Good morning");
    else if (hour < 17) setGreetingText("Good afternoon");
    else setGreetingText("Good evening");

    const splashTimer = window.setTimeout(() => setShowSplash(false), 2200);

    // Animate community counter upward
    let count = COMMUNITY_COUNT_BASE;
    const counterInterval = setInterval(() => {
      count += Math.floor(Math.random() * 3);
      setCommunityCount(count);
    }, 3000);

    const handleStorageUpdate = () => loadActiveUserData();
    window.addEventListener("storage", handleStorageUpdate);
    const backgroundPoller = setInterval(loadActiveUserData, 2000);

    return () => {
      window.clearTimeout(splashTimer);
      clearInterval(counterInterval);
      window.removeEventListener("storage", handleStorageUpdate);
      clearInterval(backgroundPoller);
    };
  }, [loadActiveUserData]);

  function playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch { /* audio not supported */ }
  }

  function triggerNotification(title: string, message: string) {
    playNotificationSound();
    setToastAlert({ title, message });
    setTimeout(() => setToastAlert(null), 4500);
  }

  async function handleAccountInput(accNum: string, mode = transferMode, bankCode = selectedBankCode) {
    setRecipientAccount(accNum);
    setRecipientNameDisplay("");
    if (accNum.length === 10) {
      setIsResolving(true);
      const codeToQuery = mode === "ECOCAMPUS" ? "ECO" : bankCode;
      const res = await resolveBankAccountNumber(accNum, codeToQuery);
      setIsResolving(false);
      if (res.success) setRecipientNameDisplay(res.accountName);
    }
  }

  function handleProfilePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const all = getUsers();
      const idx = all.findIndex((u) => u.id === currentUser?.id);
      if (idx === -1) return;
      all[idx].profilePictureUrl = base64String;
      saveUsers(all);
      setCurrentUser(all[idx]);
      triggerNotification("Profile Updated", "Your profile picture has been updated.");
    };
    reader.readAsDataURL(file);
  }

  function handleClearHistory() {
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === currentUser?.id);
    if (idx === -1) return;
    all[idx].transactions = [];
    saveUsers(all);
    setCurrentUser(all[idx]);
    triggerNotification("History Cleared", "Transaction history has been cleared.");
  }

  function handleTopUp() {
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === currentUser?.id);
    if (idx === -1) return;
    all[idx].balanceKobo += 500000;
    all[idx].transactions.unshift({
      id: `tx-top-${Date.now()}`,
      reference: `ECO-FND-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "CREDIT",
      category: "DEPOSIT",
      title: "Wallet Funding",
      counterpartyName: "Verve Card 5061",
      counterpartyAccount: "••••8821",
      amountKobo: 500000,
      status: "SUCCESSFUL",
      narration: "Instant Top-Up",
      createdAt: "Just now",
    });
    saveUsers(all);
    setCurrentUser(all[idx]);
    window.dispatchEvent(new Event("storage"));
    triggerNotification("Wallet Credited", "Successfully funded ₦5,000.00 via Verve Card.");
  }

  function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    const nairaNum = Number(transferNaira);
    if (isNaN(nairaNum) || nairaNum <= 0) {
      setFeedback({ type: "error", message: "Enter a valid transfer amount." });
      return;
    }

    if (transferMode === "ECOCAMPUS") {
      const res = executeDynamicTransfer(currentUser!.id, recipientAccount, Math.round(nairaNum * 100), narration || "Transfer");
      if (!res.ok) { setFeedback({ type: "error", message: res.error || "Transfer failed." }); return; }
      const refreshedUsers = getUsers();
      const updatedSelf = refreshedUsers.find((u) => u.id === currentUser?.id) || currentUser!;
      setCurrentUser(updatedSelf);
      window.dispatchEvent(new Event("storage"));
      setFeedback({ type: "success", message: `Transfer Successful (${res.reference}) to ${recipientNameDisplay}.` });
      triggerNotification("Debit Alert", `You sent ₦${nairaNum.toLocaleString()} to ${recipientNameDisplay}. Ref: ${res.reference}`);
    } else {
      const selectedBank = NIGERIAN_BANKS.find((b) => b.code === selectedBankCode);
      const amountKobo = Math.round(nairaNum * 100);
      if (currentUser!.balanceKobo < amountKobo) {
        setFeedback({ type: "error", message: "Insufficient balance for external transfer." });
        return;
      }
      const all = getUsers();
      const idx = all.findIndex((u) => u.id === currentUser!.id);
      if (idx === -1) return;
      const ref = `EXT-TRF-${Math.floor(100000 + Math.random() * 900000)}`;
      all[idx].balanceKobo -= amountKobo;
      all[idx].transactions.unshift({
        id: `tx-ext-${Date.now()}`,
        reference: ref,
        type: "DEBIT",
        category: "TRANSFER",
        title: `Transfer to ${selectedBank?.name || "Other Bank"}`,
        counterpartyName: recipientNameDisplay || "External Recipient",
        counterpartyAccount: recipientAccount,
        amountKobo,
        status: "SUCCESSFUL",
        narration: narration || "Interbank transfer",
        createdAt: "Just now",
      });
      saveUsers(all);
      setCurrentUser(all[idx]);
      window.dispatchEvent(new Event("storage"));
      setFeedback({ type: "success", message: `₦${nairaNum.toLocaleString()} sent to ${selectedBank?.name} successfully.` });
      triggerNotification("Interbank Debit Alert", `₦${nairaNum.toLocaleString()} transferred to ${recipientNameDisplay} (${selectedBank?.name}).`);
    }
  }

  // ── Splash Screen ─────────────────────────────────────────────────────────
  if (showSplash) {
    return (
      <div className={styles.splashOverlay} role="status" aria-label="Loading EcoCampus">
        <div className={styles.splashCard}>
          <div className={styles.splashLogoWrap}>
            <p className={styles.splashTitle}>
              <span>Eco</span>Campus
            </p>
            <p className={styles.splashMotto}>LEARN · GROW · ACHIEVE</p>
          </div>
          <div className={styles.splashMemberReveal}>
            <p className={styles.splashMemberLabel}>Your Member Number</p>
            <p className={styles.splashMemberNum}>#000247</p>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} />
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  const memberNum = String(currentUser.memberNumber ?? 247).padStart(6, "0");
  const campusScore = currentUser.campusScore ?? 720;
  const loanLimitNaira = ((currentUser.loanLimitKobo ?? 15000000) / 100).toLocaleString();

  // Streak formatting
  const totalDays = currentUser.checkInStreak || 1;
  const streakYears = Math.floor(totalDays / 365);
  const streakMonths = Math.floor((totalDays % 365) / 30);
  const streakDays = totalDays - streakYears * 365 - streakMonths * 30;
  const streakString = [
    streakYears > 0 ? `${streakYears}y` : "",
    streakMonths > 0 ? `${streakMonths}mo` : "",
    `${streakDays}d`,
  ].filter(Boolean).join(" ");

  return (
    <main className={styles.appViewport}>

      {/* ── Toast Notification ─────────────────────────────────────────── */}
      {toastAlert && (
        <aside className={styles.toastAlert} aria-live="polite">
          <div className={styles.toastIconWrap}>✓</div>
          <div>
            <p className={styles.toastTitle}>{toastAlert.title}</p>
            <p className={styles.toastMessage}>{toastAlert.message}</p>
          </div>
        </aside>
      )}

      {/* ── Hidden file input for profile pic ──────────────────────────── */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureUpload}
        accept="image/*"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className={styles.topGreetingBar}>
        <div className={styles.greetingLeft}>
          {/* Avatar */}
          <div className={styles.avatarWrap}>
            <div
              className={styles.avatarRing}
              onClick={() => fileInputRef.current?.click()}
              title="Tap to change profile photo"
              role="button"
              tabIndex={0}
              aria-label="Profile picture"
            >
              <div className={styles.avatarInner}>
                {currentUser.profilePictureUrl ? (
                  <img
                    src={currentUser.profilePictureUrl}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  currentUser.firstName.slice(0, 2).toUpperCase()
                )}
              </div>
            </div>
            <span className={styles.avatarOnline} aria-hidden="true" />
          </div>

          {/* Greeting text */}
          <div className={styles.greetingTextWrap}>
            <h1 className={styles.greetingTitle}>
              {greetingText}, {currentUser.firstName} 👋
            </h1>
            <p className={styles.greetingSub}>
              {currentUser.institutionName ?? "EcoCampus Student"} · {currentUser.academicLevel ?? "Student"}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className={styles.headerActions}>
          {/* Pioneer badge */}
          <div className={styles.pioneerBadge} title="Your early member number">
            <span className={styles.pioneerDot} />
            #{memberNum}
          </div>

          {/* Notification bell */}
          <button
            type="button"
            className={styles.notifBtn}
            aria-label={`${currentUser.unreadNotifications} unread notifications`}
            onClick={() => triggerNotification("Notifications", `You have ${currentUser.unreadNotifications} unread alerts.`)}
          >
            <IconBell />
            {currentUser.unreadNotifications > 0 && (
              <span className={styles.notifDot} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* ── Balance Card ────────────────────────────────────────────────── */}
      <section className={styles.balanceCard} aria-label="Wallet Balance">
        <div className={styles.balanceTopRow}>
          <span className={styles.balanceLabel}>Available Balance</span>
          <a
            href="/usd-account"
            className={styles.balanceUsdLink}
            aria-label="View USD account"
          >
            USD {formatCentsToUsd(currentUser.usdBalanceCents, hideBalance)} →
          </a>
        </div>

        <div className={styles.balanceMainRow}>
          <div className={styles.balanceAmountGroup}>
            <p
              className={styles.balanceAmount}
              onClick={() => setHideBalance((p) => !p)}
              style={{ cursor: "pointer" }}
              aria-label="Tap to toggle balance visibility"
            >
              {formatKoboToNaira(currentUser.balanceKobo, hideBalance)}
            </p>
            <div className={styles.balanceHideRow}>
              <button
                type="button"
                onClick={() => setHideBalance((p) => !p)}
                className={styles.eyeToggleBtn}
                aria-label={hideBalance ? "Show balance" : "Hide balance"}
              >
                {hideBalance ? "👁 Show" : "🙈 Hide"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            {/* Campus Score Ring */}
            <CampusScoreRing score={campusScore} />

            {/* Add Money button */}
            <button
              type="button"
              onClick={handleTopUp}
              className={styles.addMoneyBtn}
              aria-label="Add money to wallet"
            >
              + Add Money
            </button>
          </div>
        </div>

        {/* Account meta bar */}
        <div className={styles.accountMetaBar}>
          <div className={styles.metaItem}>
            <span className={styles.metaItemLabel}>Account</span>
            <span className={styles.metaItemValue}>{currentUser.accountNumber}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaItemLabel}>Cashback</span>
            <span className={styles.metaItemValue}>{formatKoboToNaira(currentUser.cashbackKobo, hideBalance)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaItemLabel}>Streak</span>
            <span className={`${styles.metaItemValue} ${styles.metaStreakValue}`}>
              🔥 {streakString}
            </span>
          </div>
        </div>
      </section>

      {/* ── Loan / Credit Status Banner ─────────────────────────────────── */}
      {currentUser.activeLoan && currentUser.activeLoan.status === "ACTIVE" ? (
        <a
          href="/loans"
          className={styles.loanBanner}
          style={{ background: "linear-gradient(135deg, #0A1628 0%, #001F3F 100%)", borderColor: "rgba(0, 230, 118, 0.4)" }}
          aria-label="Manage active loan"
          role="link"
        >
          <div className={styles.loanBannerIcon} style={{ background: "rgba(0, 230, 118, 0.2)", color: "#00E676" }}>
            <IconLoan />
          </div>
          <div className={styles.loanBannerText}>
            <p className={styles.loanBannerTitle} style={{ color: "#00E676" }}>
              Active Facility: {formatKoboToNaira(currentUser.activeLoan.remainingKobo)}
            </p>
            <p className={styles.loanBannerSub} style={{ color: "#CBD5E1" }}>
              Next GSI auto-deduction: {currentUser.activeLoan.nextDeductionDate}
            </p>
          </div>
          <span className={styles.loanBannerCta} style={{ background: "#00E676", color: "#001F3F", fontWeight: 800 }}>
            Manage <IconChevronRight />
          </span>
        </a>
      ) : currentUser.loanEligible ? (
        <a
          href="/loans"
          className={styles.loanBanner}
          aria-label="Apply for zero-interest loan"
          role="link"
        >
          <div className={styles.loanBannerIcon}>
            <IconLoan />
          </div>
          <div className={styles.loanBannerText}>
            <p className={styles.loanBannerTitle}>
              You qualify for ₦{loanLimitNaira} · Zero Interest
            </p>
            <p className={styles.loanBannerSub}>
              24–48hr disbursement · GSI-secured · No stress
            </p>
          </div>
          <span className={styles.loanBannerCta}>
            Apply <IconChevronRight />
          </span>
        </a>
      ) : null}

      {/* ── Community Counter ───────────────────────────────────────────── */}
      <div className={styles.communityStrip} aria-label="EcoCampus community size">
        <div className={styles.communityAvatars} aria-hidden="true">
          {["AJ", "EM", "TF", "BI"].map((initials) => (
            <div key={initials} className={styles.communityAvatar}>{initials}</div>
          ))}
        </div>
        <p className={styles.communityText}>
          <span className={styles.communityCountLive}>
            <span className={styles.liveDot} />
            <span className={styles.communityCount}>
              {communityCount.toLocaleString()}+
            </span>
          </span>
          {" "}students on EcoCampus
        </p>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <section aria-label="Quick actions" className={styles.quickActionsCard}>
        <div className={styles.sectionHeader} style={{ marginBottom: "0.85rem" }}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
        </div>
        <div className={styles.quickActionsGrid}>
          <a
            href="#transfer"
            onClick={() => setTransferMode("ECOCAMPUS")}
            className={styles.quickTile}
            aria-label="Transfer to EcoCampus"
          >
            <div className={`${styles.quickTileIcon} ${styles.quickTileIconGreen}`}>
              <IconTransfer />
            </div>
            <span className={styles.quickTileLabel}>Transfer</span>
          </a>

          <a
            href="#transfer"
            onClick={() => setTransferMode("OTHER_BANKS")}
            className={styles.quickTile}
            aria-label="Send to other banks"
          >
            <div className={`${styles.quickTileIcon} ${styles.quickTileIconNavy}`}>
              <IconBank />
            </div>
            <span className={styles.quickTileLabel}>To Bank</span>
          </a>

          <a
            href="/loans"
            className={styles.quickTile}
            aria-label="Apply for a loan"
          >
            <div className={`${styles.quickTileIcon} ${styles.quickTileIconGold}`}>
              <IconLoan />
            </div>
            <span className={styles.quickTileLabel}>Loan</span>
          </a>

          <a
            href="/marketplace"
            className={styles.quickTile}
            aria-label="Visit campus marketplace"
          >
            <div className={`${styles.quickTileIcon} ${styles.quickTileIconPurple}`}>
              <IconMarket />
            </div>
            <span className={styles.quickTileLabel}>Marketplace</span>
          </a>
        </div>
      </section>

      {/* ── Opportunity Hub Preview ─────────────────────────────────────── */}
      <section className={styles.opportunitySection} aria-label="Opportunity Hub">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Opportunity Hub</h2>
          <a href="/opportunities" className={styles.sectionLink} aria-label="See all opportunities">
            See all →
          </a>
        </div>

        <div className={styles.opportunityScroll} role="list">
          {OPPORTUNITIES.map((opp) => (
            <a
              key={opp.id}
              href="/opportunities"
              className={styles.opportunityCard}
              aria-label={`${opp.title} at ${opp.company}`}
              role="listitem"
            >
              <div className={styles.oppCardTop}>
                <div className={styles.oppCompanyBadge}>
                  <div
                    className={styles.oppCompanyLogo}
                    style={{ background: opp.logoColor }}
                    aria-hidden="true"
                  >
                    {opp.logo}
                  </div>
                  <span className={styles.oppCompanyName}>{opp.company}</span>
                </div>
                <span
                  className={`${styles.oppTypeBadge} ${
                    opp.type === "INTERN"
                      ? styles.oppTypeBadgeIntern
                      : opp.type === "NYSC"
                      ? styles.oppTypeBadgeNYSC
                      : styles.oppTypeBadgeGrad
                  }`}
                >
                  {opp.type === "INTERN" ? "Internship"
                    : opp.type === "NYSC" ? "NYSC" : "Graduate"}
                </span>
              </div>

              <p className={styles.oppTitle}>{opp.title}</p>

              <div className={styles.oppMeta}>
                <span className={styles.oppMetaItem}>
                  📍 {opp.location}
                </span>
                <span className={styles.oppMetaItem}>
                  💰 {opp.stipend}
                </span>
                <span className={styles.oppMetaItem}>
                  🗓 Closes {opp.deadline}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Services Grid ───────────────────────────────────────────────── */}
      <section aria-label="All services" className={styles.servicesCard}>
        <div className={styles.sectionHeader} style={{ marginBottom: "0.85rem" }}>
          <h2 className={styles.sectionTitle}>Services</h2>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { href: "/airtime-data", label: "Airtime",      icon: <IconAirtime />,  cls: "stiGreen"  },
            { href: "/airtime-data", label: "Data",         icon: <IconData />,     cls: "stiBlue"   },
            { href: "/utility",     label: "Utility",      icon: <IconUtility />,  cls: "stiOrange" },
            { href: "/rewards",     label: "EcoRewards",   icon: <IconRewards />,  cls: "stiGold"   },
            { href: "/cards",       label: "NGN Card",     icon: <IconCard />,     cls: "stiPurple" },
            { href: "/investments", label: "EcoInvest",    icon: <IconInvest />,   cls: "stiTeal"   },
            { href: "/marketplace", label: "EcoMarket",    icon: <IconMarket />,   cls: "stiPink"   },
            { href: "/usd-account", label: "USD Account",  icon: <IconUSD />,      cls: "stiRed"    },
            { href: "/training",    label: "EcoSkills",    icon: <IconSkills />,   cls: "stiBlue"   },
            { href: "/loans",       label: "Loan",         icon: <IconLoan />,     cls: "stiGold"   },
            { href: "/transfers",   label: "Transfer",     icon: <IconTransfer />, cls: "stiGreen"  },
            { href: "/usd-account", label: "FX",           icon: <IconUSD />,      cls: "stiOrange" },
          ].map(({ href, label, icon, cls }) => (
            <a
              key={label}
              href={href}
              className={styles.serviceTile}
              aria-label={label}
            >
              <div className={`${styles.serviceTileIcon} ${styles[cls as keyof typeof styles]}`}>
                {icon}
              </div>
              <span className={styles.serviceTileLabel}>{label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Fund Transfer Panel ────────────────────────────────────────── */}
      <section className={styles.transferSection} id="transfer" aria-label="Fund Transfer">
        <div className={styles.sectionHeader}>
          <h2 className={styles.cardSectionTitle}>Fund Transfer</h2>
        </div>

        {/* Mode toggle tabs */}
        <div className={styles.transferTabGroup} role="tablist" aria-label="Transfer mode">
          <button
            type="button"
            role="tab"
            aria-selected={transferMode === "ECOCAMPUS"}
            onClick={() => {
              setTransferMode("ECOCAMPUS");
              setRecipientNameDisplay("");
              setRecipientAccount("");
            }}
            className={`${styles.transferTab} ${transferMode === "ECOCAMPUS" ? styles.transferTabActive : ""}`}
          >
            EcoCampus
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={transferMode === "OTHER_BANKS"}
            onClick={() => {
              setTransferMode("OTHER_BANKS");
              setRecipientNameDisplay("");
              setRecipientAccount("");
            }}
            className={`${styles.transferTab} ${transferMode === "OTHER_BANKS" ? styles.transferTabActive : ""}`}
          >
            Other Banks
          </button>
        </div>

        <form onSubmit={handleTransfer}>
          {transferMode === "OTHER_BANKS" && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="bankSelect">Select Bank</label>
              <select
                id="bankSelect"
                className={styles.formInput}
                value={selectedBankCode}
                onChange={(e) => {
                  setSelectedBankCode(e.target.value);
                  if (recipientAccount.length === 10) {
                    handleAccountInput(recipientAccount, "OTHER_BANKS", e.target.value);
                  }
                }}
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="recipientAccount">
              {transferMode === "ECOCAMPUS" ? "EcoCampus Account Number" : "Account Number"}
            </label>
            <input
              id="recipientAccount"
              type="text"
              maxLength={10}
              required
              className={styles.formInput}
              placeholder="10-digit account number"
              value={recipientAccount}
              onChange={(e) => handleAccountInput(e.target.value)}
              autoComplete="off"
              inputMode="numeric"
            />
          </div>

          {isResolving && (
            <div className={styles.resolvingBanner}>
              <div className={styles.spinner} aria-hidden="true" />
              Verifying via NIBSS...
            </div>
          )}

          {recipientNameDisplay && !isResolving && (
            <div className={styles.recipientBanner}>
              <IconCheck />
              {recipientNameDisplay}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="amount">Amount (₦)</label>
            <input
              id="amount"
              type="number"
              min="50"
              required
              className={styles.formInput}
              placeholder="0.00"
              value={transferNaira}
              onChange={(e) => setTransferNaira(e.target.value)}
              inputMode="decimal"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="narration">Narration</label>
            <input
              id="narration"
              type="text"
              required
              className={styles.formInput}
              placeholder="What is this transfer for?"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>

          {feedback && (
            <div className={feedback.type === "success" ? styles.resolvedBanner : styles.errorBanner} role="alert">
              {feedback.message}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} id="sendFundsBtn">
            Send Funds Instantly →
          </button>
        </form>
      </section>

      {/* ── Transaction History ─────────────────────────────────────────── */}
      <section className={styles.transactionSection} aria-label="Transaction History">
        <div className={styles.sectionHeader}>
          <h2 className={styles.cardSectionTitle}>Transactions</h2>
          {currentUser.transactions.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              style={{
                background: "none",
                border: "none",
                color: "#CC0000",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                padding: "0.2rem 0.4rem",
              }}
              aria-label="Clear transaction history"
            >
              Clear
            </button>
          )}
        </div>

        <div className={styles.txList}>
          {currentUser.transactions.length === 0 ? (
            <div className={styles.txEmptyState}>
              <div className={styles.txEmptyIcon}>🧾</div>
              <p className={styles.txEmptyText}>No transactions yet</p>
            </div>
          ) : (
            currentUser.transactions.map((tx) => (
              <div key={tx.id} className={styles.txItem}>
                <TxIcon category={tx.category} type={tx.type} />
                <div className={styles.txContent}>
                  <p className={styles.txTitle}>{tx.title}</p>
                  <p className={styles.txMeta}>{tx.createdAt} · {tx.reference}</p>
                </div>
                <span className={`${styles.txAmount} ${tx.type === "CREDIT" ? styles.txCredit : styles.txDebit}`}>
                  {tx.type === "CREDIT" ? "+" : "−"}{formatKoboToNaira(tx.amountKobo, hideBalance)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Bottom Navigation ───────────────────────────────────────────── */}
      <nav className={styles.bottomNav} aria-label="Main navigation">
        <a href="/" className={`${styles.bottomNavItem} ${styles.bottomNavActive}`} aria-current="page">
          <div className={styles.bottomNavActiveIcon}><IconHome /></div>
          <span>Home</span>
        </a>
        <a href="/marketplace" className={styles.bottomNavItem} aria-label="Campus Marketplace">
          <IconMarket />
          <span>Market</span>
        </a>
        <a href="/opportunities" className={styles.bottomNavItem} aria-label="Opportunity Hub">
          <IconOpportunity />
          <span>Opportunities</span>
        </a>
        <a href="/loans" className={styles.bottomNavItem} aria-label="Loan Services">
          <IconLoan />
          <span>Loans</span>
        </a>
        <button
          type="button"
          className={styles.bottomNavItem}
          aria-label="Profile and settings"
          onClick={() => {
            localStorage.removeItem("ecocampus_active_user_id_v5");
            router.push("/login");
          }}
        >
          <IconProfile />
          <span>Profile</span>
        </button>
      </nav>

    </main>
  );
}