// ============================================================================
// ECOCAMPUS REWARDS & CASHBACK HUB — APP/(DASHBOARD)/REWARDS/PAGE.TSX
// EcoRewards featuring Working Daily Check-in Streak, Cashback Collection & Account Type Verification
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import styles from "../transfers/transfer.module.css";

export default function RewardsPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [claimedToday, setClaimedToday] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);

    const today = new Date().toISOString().split("T")[0];
    if (active.lastCheckInDate === today) {
      setClaimedToday(true);
    }
  }, [router]);

  if (!user) return null;

  function handleClaimDailyReward() {
    const today = new Date().toISOString().split("T")[0];
    if (user!.lastCheckInDate === today) {
      setFeedback({ type: "error", message: "You have already claimed your daily reward today. Come back tomorrow!" });
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    // Increment streak and credit ₦50.00 (5000 kobo) reward
    const rewardKobo = 5000;
    all[idx].balanceKobo += rewardKobo;
    all[idx].cashbackKobo += rewardKobo;
    all[idx].checkInStreak = (all[idx].checkInStreak || 0) + 1;
    all[idx].lastCheckInDate = today;

    all[idx].transactions.unshift({
      id: `tx-reward-${Date.now()}`,
      reference: `ECO-RWD-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "CREDIT",
      category: "REWARD",
      title: `Daily Check-In Reward (Day ${all[idx].checkInStreak})`,
      counterpartyName: "EcoRewards Program",
      counterpartyAccount: "REWARD-VAULT",
      amountKobo: rewardKobo,
      status: "SUCCESSFUL",
      narration: "Daily active streak bonus",
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser(all[idx]);
    setClaimedToday(true);
    setFeedback({ type: "success", message: `Day ${all[idx].checkInStreak} Streak Claimed! ₦50.00 added to your wallet.` });
  }

  function handleToggleAccountType(newType: "student" | "cooper") {
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    all[idx].accountType = newType;
    saveUsers(all);
    setUser(all[idx]);
    setFeedback({
      type: "success",
      message: `Account verified successfully as: ${newType === "student" ? "Undergraduate Student" : "NYSC Corps Member"}.`,
    });
  }

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <a
          href="/"
          style={{
            textDecoration: "none",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#007749",
            fontWeight: 700,
            fontSize: "0.8rem",
            padding: "0.4rem 0.85rem",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            boxShadow: "0 2px 6px rgba(0, 119, 73, 0.08)",
          }}
        >
          &larr; Dashboard
        </a>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          EcoRewards &amp; Verification
        </h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Account Verification Badge Box */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.25rem",
          border: "1px solid #e2e8f0",
          marginBottom: "1.25rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Account Status Verification[cite: 1]
          </h3>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              background: user.accountType === "student" ? "#ecfdf5" : "#eff6ff",
              color: user.accountType === "student" ? "#065f46" : "#1d4ed8",
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
            }}
          >
            {user.accountType === "student" ? "STUDENT TIER" : "NYSC CORPS TIER"}
          </span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#475569", margin: "0 0 0.85rem 0", lineHeight: 1.4 }}>
          EcoRewards tailors zero-interest loans and cashback bonuses based on whether you are currently an undergraduate student or serving NYSC Corps member[cite: 1].
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <button
            type="button"
            onClick={() => handleToggleAccountType("student")}
            style={{
              padding: "0.65rem",
              borderRadius: "0.75rem",
              fontWeight: 800,
              fontSize: "0.75rem",
              border: user.accountType === "student" ? "2px solid #007749" : "1px solid #cbd5e1",
              background: user.accountType === "student" ? "#ecfdf5" : "#ffffff",
              color: user.accountType === "student" ? "#065f46" : "#475569",
              cursor: "pointer",
            }}
          >
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => handleToggleAccountType("cooper")}
            style={{
              padding: "0.65rem",
              borderRadius: "0.75rem",
              fontWeight: 800,
              fontSize: "0.75rem",
              border: user.accountType === "cooper" ? "2px solid #0b2545" : "1px solid #cbd5e1",
              background: user.accountType === "cooper" ? "#eff6ff" : "#ffffff",
              color: user.accountType === "cooper" ? "#1d4ed8" : "#475569",
              cursor: "pointer",
            }}
          >
            I am a Corps Member (NYSC)
          </button>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            padding: "0.7rem 0.9rem",
            borderRadius: "0.75rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            marginBottom: "1rem",
            background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: feedback.type === "success" ? "#065f46" : "#b91c1c",
            border: `1px solid ${feedback.type === "success" ? "#10b981" : "#f87171"}`,
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Daily Streak & Cashback Vault */}
      <div
        style={{
          background: "linear-gradient(135deg, #033121 0%, #007749 100%)",
          borderRadius: "1.25rem",
          padding: "1.35rem",
          color: "#ffffff",
          marginBottom: "1.25rem",
          boxShadow: "0 12px 26px rgba(0, 119, 73, 0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.85 }}>
            Active Daily Streak
          </span>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#a7f3d0" }}>
            🔥 {user.checkInStreak} Days Active
          </span>
        </div>

        <div style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "monospace", marginBottom: "0.5rem" }}>
          {formatKoboToNaira(user.cashBankKobo || user.cashbackKobo)} accumulated cashback
        </div>

        <p style={{ fontSize: "0.76rem", opacity: 0.9, margin: "0 0 1rem 0" }}>
          Check in daily to build your active streak and collect your ₦50.00 daily cashback bonus.
        </p>

        <button
          type="button"
          disabled={claimedToday}
          onClick={handleClaimDailyReward}
          style={{
            width: "100%",
            backgroundColor: claimedToday ? "rgba(255,255,255,0.2)" : "#ffffff",
            color: claimedToday ? "#ffffff" : "#007749",
            padding: "0.75rem",
            borderRadius: "0.75rem",
            fontWeight: 800,
            fontSize: "0.82rem",
            border: "none",
            cursor: claimedToday ? "not-allowed" : "pointer",
          }}
        >
          {claimedToday ? "✓ Daily Reward Claimed Today" : "Claim Daily ₦50.00 Cashback"}
        </button>
      </div>
    </main>
  );
}