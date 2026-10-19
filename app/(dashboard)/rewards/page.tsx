// ============================================================================
// ECOCAMPUS REWARDS & CASHBACK HUB — APP/(DASHBOARD)/REWARDS/PAGE.TSX
// Clean, Professional Student Loyalty & Cashback System
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import { BottomNav } from "@/components/navigation/BottomNav";
import styles from "./rewards.module.css";

const DAYS_OF_WEEK = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

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

  function playAlertSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch { /* AudioContext unsupported */ }
  }

  if (!user) return null;

  function handleClaimDailyReward() {
    const today = new Date().toISOString().split("T")[0];
    if (user!.lastCheckInDate === today) {
      setFeedback({ type: "error", message: "You have already claimed your daily reward today. Check back tomorrow!" });
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    const rewardKobo = 5000; // ₦50.00
    all[idx].balanceKobo += rewardKobo;
    all[idx].cashbackKobo = (all[idx].cashbackKobo || 0) + rewardKobo;
    all[idx].checkInStreak = (all[idx].checkInStreak || 0) + 1;
    all[idx].lastCheckInDate = today;

    all[idx].transactions.unshift({
      id: `tx-reward-${Date.now()}`,
      reference: `ECO-RWD-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "CREDIT",
      category: "REWARD",
      title: `Daily Check-In Bonus (Day ${all[idx].checkInStreak})`,
      counterpartyName: "EcoRewards Program",
      counterpartyAccount: "REWARDS-VAULT",
      amountKobo: rewardKobo,
      status: "SUCCESSFUL",
      narration: "Daily active streak credit",
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser({ ...all[idx] });
    setClaimedToday(true);
    playAlertSound();
    setFeedback({
      type: "success",
      message: `Day ${all[idx].checkInStreak} Streak Claimed! ₦50.00 credited to your wallet.`,
    });
  }

  function handleRedeemCashback() {
    if (!user || (user.cashbackKobo || 0) <= 0) {
      setFeedback({ type: "error", message: "No accumulated cashback to redeem right now." });
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user.id);
    if (idx === -1) return;

    const redeemedKobo = all[idx].cashbackKobo;
    // Move cashback to active balance
    all[idx].cashbackKobo = 0;

    all[idx].transactions.unshift({
      id: `tx-red-${Date.now()}`,
      reference: `ECO-RED-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "CREDIT",
      category: "REWARD",
      title: "Cashback Redeemed to Wallet",
      counterpartyName: "EcoRewards Vault",
      counterpartyAccount: "REWARDS-VAULT",
      amountKobo: redeemedKobo,
      status: "SUCCESSFUL",
      narration: "Cashback converted to spendable balance",
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser({ ...all[idx] });
    playAlertSound();
    setFeedback({
      type: "success",
      message: `Successfully redeemed ${formatKoboToNaira(redeemedKobo)} into your main wallet!`,
    });
  }

  const currentStreak = user.checkInStreak || 0;
  const streakDayIndex = (currentStreak % 7);

  return (
    <main className={styles.rewardsContainer}>
      {/* Header */}
      <header className={styles.rewardsHeader}>
        <Link href="/" className={styles.backBtn} aria-label="Back to dashboard">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 className={styles.headerTitle}>EcoRewards</h1>
        <div className={styles.headerSpacer} />
      </header>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`${styles.feedbackBanner} ${
            feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError
          }`}
        >
          {feedback.type === "success" ? (
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {feedback.message}
        </div>
      )}

      {/* ── Rewards Content (Balance & 7-Day Streak) ── */}
      <div className={styles.rewardsContent}>
        {/* Hero Cashback Balance Card */}
        <div className={styles.balanceCard}>
          <div className={styles.balanceCardHeader}>
            <span className={styles.balanceLabel}>Accumulated Cashback</span>
            <span className={styles.streakPill}>
              🔥 {currentStreak} Days Active
            </span>
          </div>

          <div className={styles.balanceAmount}>
            {formatKoboToNaira(user.cashbackKobo || 0)}
          </div>

          <div className={styles.balanceActions}>
            <button
              type="button"
              className={styles.redeemBtn}
              onClick={handleRedeemCashback}
              disabled={(user.cashbackKobo || 0) <= 0}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Redeem to Main Wallet
            </button>
          </div>
        </div>

        {/* Daily Check-In Streak Section */}
        <section className={styles.streakSection}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>7-Day Streak Rewards</h2>
            <span style={{ fontSize: "0.72rem", color: "#007749", fontWeight: 700 }}>
              +₦50 daily &middot; +₦200 on Day 7
            </span>
          </div>

          <div className={styles.streakDaysGrid}>
            {DAYS_OF_WEEK.map((dayName, idx) => {
              const isCompleted = idx < streakDayIndex;
              const isToday = idx === streakDayIndex;
              return (
                <div
                  key={dayName}
                  className={`${styles.streakDayItem} ${
                    isCompleted ? styles.streakDayItemDone : isToday ? styles.streakDayItemActive : ""
                  }`}
                >
                  <span className={styles.streakDayLabel}>{dayName}</span>
                  <span className={styles.streakDayAmount}>
                    {idx === 6 ? "₦200" : "₦50"}
                  </span>
                  {isCompleted && (
                    <svg width="12" height="12" fill="none" stroke="#007749" strokeWidth="3" viewBox="0 0 24 24" style={{ marginTop: "3px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.claimDailyBtn}
            onClick={handleClaimDailyReward}
            disabled={claimedToday}
          >
            {claimedToday ? (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Daily Reward Claimed Today
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Claim Today&apos;s ₦50.00 Bonus
              </>
            )}
          </button>
        </section>
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomNav activeTab="rewards" />
    </main>
  );
}