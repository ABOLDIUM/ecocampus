// ============================================================================
// ECOCAMPUS DASHBOARD MODULE — APP/PAGE.TSX
// ============================================================================

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { formatCentsToUsd, formatKoboToNaira } from "@/lib/formatting/currency";
import { executeDynamicTransfer, getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import { NIGERIAN_BANKS } from "@/lib/data/nigerian-banks";
import { resolveBankAccountNumber } from "@/lib/api/banking-services";
import styles from "./page.module.css";

export default function EcoCampusDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<EcoUser | null>(null);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [greetingText, setGreetingText] = useState<string>("Welcome");

  // Transfer state
  const [transferMode, setTransferMode] = useState<"ECOCAMPUS" | "OTHER_BANKS">("ECOCAMPUS");
  const [recipientAccount, setRecipientAccount] = useState<string>("");
  const [selectedBankCode, setSelectedBankCode] = useState<string>(NIGERIAN_BANKS[0].code);
  const [recipientNameDisplay, setRecipientNameDisplay] = useState<string>("");
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [transferNaira, setTransferNaira] = useState<string>("");
  const [narration, setNarration] = useState<string>("");

  const [toastAlert, setToastAlert] = useState<{ title: string; message: string } | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const loadedUsers = getUsers();
    const active = getActiveUser();

    if (!active) {
      router.push("/login");
      return;
    }

    setCurrentUser(active);

    const hour = new Date().getHours();
    if (hour < 12) setGreetingText("Good morning");
    else if (hour < 17) setGreetingText("Good afternoon");
    else setGreetingText("Good evening");

    const other = loadedUsers.find((u) => u.id !== active.id);
    if (other) {
      setRecipientAccount(other.accountNumber);
      handleAccountInput(other.accountNumber, "ECOCAMPUS");
    }

    const timer = window.setTimeout(() => setShowSplash(false), 600);
    return () => window.clearTimeout(timer);
  }, [router]);

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
    } catch {
      // AudioContext blocked
    }
  }

  function triggerNotification(title: string, message: string) {
    playNotificationSound();
    setToastAlert({ title, message });
    setTimeout(() => {
      setToastAlert(null);
    }, 4500);
  }

  async function handleAccountInput(accNum: string, mode = transferMode, bankCode = selectedBankCode) {
    setRecipientAccount(accNum);
    setRecipientNameDisplay("");

    if (accNum.length === 10) {
      setIsResolving(true);
      const codeToQuery = mode === "ECOCAMPUS" ? "ECO" : bankCode;
      const res = await resolveBankAccountNumber(accNum, codeToQuery);
      setIsResolving(false);
      if (res.success) {
        setRecipientNameDisplay(res.accountName);
      }
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
      triggerNotification("Profile Updated", "Your profile picture has been successfully updated.");
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
    triggerNotification("History Cleared", "Transaction history ledger has been cleared.");
  }

  if (showSplash) {
    return (
      <div className={styles.splashOverlay} role="status">
        <div className={styles.splashCard}>
          <BrandLogo variant="full" showMotto={true} />
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} />
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

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
      if (!res.ok) {
        setFeedback({ type: "error", message: res.error || "Transfer failed." });
        return;
      }

      const refreshedUsers = getUsers();
      const updatedSelf = refreshedUsers.find((u) => u.id === currentUser?.id) || currentUser;
      setCurrentUser(updatedSelf);

      setFeedback({
        type: "success",
        message: `Transfer Successful (${res.reference}) to ${recipientNameDisplay}.`,
      });
      triggerNotification(
        "Debit Alert",
        `You sent ₦${nairaNum.toLocaleString()} to ${recipientNameDisplay}. Ref: ${res.reference}`
      );
    } else {
      const selectedBank = NIGERIAN_BANKS.find((b) => b.code === selectedBankCode);
      const amountKobo = Math.round(nairaNum * 100);
      if (currentUser.balanceKobo < amountKobo) {
        setFeedback({ type: "error", message: "Insufficient balance for external transfer." });
        return;
      }

      const all = getUsers();
      const idx = all.findIndex((u) => u.id === currentUser.id);
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

      setFeedback({
        type: "success",
        message: `External Transfer of ₦${nairaNum.toLocaleString()} to ${selectedBank?.name} completed successfully.`,
      });
      triggerNotification(
        "Interbank Debit Alert",
        `₦${nairaNum.toLocaleString()} transferred to ${recipientNameDisplay} (${selectedBank?.name}).`
      );
    }
  }

  const totalDays = currentUser.checkInStreak || 1;
  const streakYears = Math.floor(totalDays / 365);
  const streakMonths = Math.floor((totalDays % 365) / 30);
  const streakWeeks = Math.floor(((totalDays % 365) % 30) / 7);
  const streakDays = ((totalDays % 365) % 30) % 7;
  const streakString = [
    streakYears > 0 ? `${streakYears}y` : "",
    streakMonths > 0 ? `${streakMonths}mo` : "",
    streakWeeks > 0 ? `${streakWeeks}w` : "",
    `${streakDays}d`,
  ].filter(Boolean).join(" ");

  return (
    <main className={styles.appViewport}>
      {toastAlert && (
        <aside
          aria-label="Alert Notification"
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            left: "1rem",
            maxWidth: "400px",
            margin: "0 auto",
            background: "#0f172a",
            color: "#ffffff",
            padding: "0.85rem 1.15rem",
            borderRadius: "0.85rem",
            boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            borderLeft: "4px solid #10b981",
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 800, margin: 0, color: "#f8fafc" }}>{toastAlert.title}</p>
            <p style={{ fontSize: "0.75rem", opacity: 0.85, margin: 0 }}>{toastAlert.message}</p>
          </div>
        </aside>
      )}

      {/* Greeting Header */}
      <header className={styles.topGreetingBar}>
        <div className={styles.greetingLeft}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
              border: "2px solid #007749",
              position: "relative",
              flexShrink: 0,
              background: "#0f172a",
            }}
            title="Click to upload profile picture"
          >
            {currentUser.profilePictureUrl ? (
              <img
                src={currentUser.profilePictureUrl}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #007749, #0f172a)",
                }}
              >
                {currentUser.firstName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className={styles.greetingTitle}>
              {greetingText}, {currentUser.fullName}
            </h1>
            <p className={styles.greetingSub}>
              {currentUser.institutionName
                ? `${currentUser.institutionName} • ${currentUser.courseOfStudy || "Student"} • ${currentUser.academicLevel || ""}`
                : `Verified Account • ${currentUser.customerId}`}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <a
            href="/rewards"
            style={{
              background: "#ecfdf5",
              border: "1px solid #10b981",
              borderRadius: "999px",
              padding: "0.35rem 0.65rem",
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#007749",
              textDecoration: "none",
            }}
          >
            Rewards
          </a>
          <BrandLogo variant="icon" showMotto={false} />
        </div>
      </header>

      {/* Available Balance Card */}
      <section className={styles.balanceCard} aria-label="Wallet Balance">
        <div className={styles.balanceTopRow}>
          <div className={styles.balanceLabelGroup}>
            <span>Available Balance</span>
            <button
              type="button"
              onClick={() => setHideBalance((p) => !p)}
              className={styles.eyeToggleBtn}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "#ffffff",
                opacity: 0.9,
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {hideBalance ? "Show" : "Hide"}
            </button>
          </div>
          <a
            href="/usd-account"
            style={{ color: "#a7f3d0", textDecoration: "none", fontWeight: 700, fontSize: "0.78rem" }}
          >
            USD Account: {formatCentsToUsd(currentUser.usdBalanceCents, hideBalance)} &rarr;
          </a>
        </div>

        <div className={styles.balanceMainRow}>
          <p
            onClick={() => setHideBalance((p) => !p)}
            style={{ cursor: "pointer" }}
            className={`${styles.balanceAmount} ec-mono-amount`}
          >
            {formatKoboToNaira(currentUser.balanceKobo, hideBalance)}
          </p>
          <button type="button" onClick={handleTopUp} className={styles.addMoneyBtn}>
            + Add Money
          </button>
        </div>

        <div className={styles.accountMetaBar}>
          <span>Acct: {currentUser.accountNumber}</span>
          <span>ID: {currentUser.customerId}</span>
          <span>Cashback: {formatKoboToNaira(currentUser.cashbackKobo, hideBalance)}</span>
          <span>Streak: {streakString}</span>
        </div>
      </section>

      {/* Primary Action Card */}
      <section aria-label="Primary Quick Actions" style={{ marginBottom: "0.875rem" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "1.25rem 1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            border: "1px solid #f1f5f9",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
            textAlign: "center",
          }}
        >
          <a
            href="#transfer"
            onClick={() => setTransferMode("ECOCAMPUS")}
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
          >
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Transfer</span>
          </a>
          <a
            href="#transfer"
            onClick={() => setTransferMode("OTHER_BANKS")}
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
          >
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>To Bank</span>
          </a>
          <a
            href="/investments"
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
          >
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>EcoInvestment</span>
          </a>
          <a
            href="/loans"
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
          >
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Loan Service</span>
          </a>
        </div>
      </section>

      {/* Secondary Service Grid (Utility replacing one investment tile) */}
      <section aria-label="Services Grid" style={{ marginBottom: "0.875rem" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "1.25rem 1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            border: "1px solid #f1f5f9",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem 0.5rem",
            textAlign: "center",
          }}
        >
          <a href="/airtime-data" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>Airtime</span>
          </a>
          <a href="/airtime-data" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>Data</span>
          </a>
          <a href="/utility" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>Utility</span>
          </a>
          <a href="/rewards" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>EcoRewards</span>
          </a>
          <a href="/cards" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>NGN Card</span>
          </a>
          <a href="/investments" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>EcoInvest</span>
          </a>
          <a href="/marketplace" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>EcoMarket</span>
          </a>
          <a href="/usd-account" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#eff6ff", color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>USD Account</span>
          </a>
        </div>
      </section>

      {/* Transfer Panel */}
      <section className="ec-card" id="transfer" aria-label="Transfer Panel" style={{ marginBottom: "0.875rem", borderRadius: "1.125rem", padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 className={styles.cardSectionTitle} style={{ margin: 0 }}><span>Fund Transfer</span></h2>
          <div style={{ display: "flex", background: "#f1f5f9", padding: "0.2rem", borderRadius: "0.6rem" }}>
            <button
              type="button"
              onClick={() => {
                setTransferMode("ECOCAMPUS");
                setRecipientNameDisplay("");
                setRecipientAccount("");
              }}
              style={{
                padding: "0.35rem 0.75rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                borderRadius: "0.5rem",
                border: "none",
                background: transferMode === "ECOCAMPUS" ? "#ffffff" : "transparent",
                color: transferMode === "ECOCAMPUS" ? "#0f172a" : "#64748b",
                cursor: "pointer",
              }}
            >
              EcoCampus Account
            </button>
            <button
              type="button"
              onClick={() => {
                setTransferMode("OTHER_BANKS");
                setRecipientNameDisplay("");
                setRecipientAccount("");
              }}
              style={{
                padding: "0.35rem 0.75rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                borderRadius: "0.5rem",
                border: "none",
                background: transferMode === "OTHER_BANKS" ? "#ffffff" : "transparent",
                color: transferMode === "OTHER_BANKS" ? "#0f172a" : "#64748b",
                cursor: "pointer",
              }}
            >
              Other Banks
            </button>
          </div>
        </div>

        <form onSubmit={handleTransfer}>
          {transferMode === "OTHER_BANKS" && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Select Destination Bank</label>
              <select
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
            <label className={styles.formLabel}>
              {transferMode === "ECOCAMPUS" ? "Recipient EcoCampus Account Number" : "Destination Account Number"}
            </label>
            <input
              type="text"
              maxLength={10}
              required
              className={styles.formInput}
              placeholder="Enter 10-digit account number"
              value={recipientAccount}
              onChange={(e) => handleAccountInput(e.target.value)}
            />
          </div>

          {isResolving && (
            <div style={{ fontSize: "0.78rem", color: "#059669", fontWeight: 700, marginBottom: "0.75rem" }}>
              Verifying account name via NIBSS / Network...
            </div>
          )}

          {recipientNameDisplay && !isResolving && (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #10b981",
                color: "#065f46",
                padding: "0.6rem 0.85rem",
                borderRadius: "0.75rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              ✓ {recipientNameDisplay}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Amount (₦)</label>
            <input
              type="number"
              min="50"
              required
              className={styles.formInput}
              placeholder="0.00"
              value={transferNaira}
              onChange={(e) => setTransferNaira(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Narration</label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="What is this transfer for?"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>

          {feedback && (
            <div className={feedback.type === "success" ? styles.resolvedBanner : styles.errorBanner}>
              {feedback.message}
            </div>
          )}

          <button type="submit" className="ec-btn-primary" style={{ width: "100%", backgroundColor: "#059669" }}>
            Send Funds Instantly
          </button>
        </form>
      </section>

      {/* Transaction History */}
      <section className="ec-card" aria-label="Transactions" style={{ borderRadius: "1.125rem", padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h2 className={styles.cardSectionTitle} style={{ margin: 0 }}>
            <span>Transaction History</span>
          </h2>
          {currentUser.transactions.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                fontSize: "0.75rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Clear History
            </button>
          )}
        </div>
        <div className={styles.txList}>
          {currentUser.transactions.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "#64748b", textAlign: "center", padding: "1rem 0" }}>No transaction records found.</p>
          ) : (
            currentUser.transactions.map((tx) => (
              <div key={tx.id} className={styles.txItem}>
                <div>
                  <p className={styles.txTitle}>{tx.title}</p>
                  <p className={styles.txMeta}>{tx.createdAt} • Ref: {tx.reference}</p>
                </div>
                <span className={tx.type === "CREDIT" ? styles.txCredit : styles.txDebit}>
                  {tx.type === "CREDIT" ? "+" : "-"}{formatKoboToNaira(tx.amountKobo, hideBalance)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav} aria-label="Navigation">
        <a href="/" className={`${styles.bottomNavItem} ${styles.bottomNavActive}`}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span>Home</span>
        </a>
        <a href="/rewards" className={styles.bottomNavItem}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          <span>EcoRewards</span>
        </a>
        <a href="/investments" className={styles.bottomNavItem}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          <span>EcoInvest</span>
        </a>
        <a href="/cards" className={styles.bottomNavItem}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <span>NGN Card</span>
        </a>
        <a
          href="#logout"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("ecocampus_active_user_id_v5");
            router.push("/login");
          }}
          className={styles.bottomNavItem}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Sign Out</span>
        </a>
      </nav>
    </main>
  );
}