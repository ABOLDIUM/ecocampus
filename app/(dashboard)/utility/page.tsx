// ============================================================================
// ECOCAMPUS UTILITY & TUITION HUB — APP/(DASHBOARD)/UTILITY/PAGE.TSX
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import styles from "../transfers/transfer.module.css";

const UTILITY_CATEGORIES = [
  { id: "SCHOOL_FEES", name: "School Fees / Tuition" },
  { id: "AI_SUB", name: "AI Subscriptions (ChatGPT / Gemini)" },
  { id: "ELECTRICITY", name: "Electricity Bill (AEDC / Prepaid)" },
  { id: "WATER", name: "Water & Utility Rates" },
];

export default function UtilityPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(UTILITY_CATEGORIES[0].id);
  const [amountNaira, setAmountNaira] = useState("25000");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [matricNumberInput, setMatricNumberInput] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
    if (active.customerId) setMatricNumberInput(active.customerId);
    if (active.courseOfStudy) setCourseInput(active.courseOfStudy);
    if (active.institutionName) setReferenceNumber(`${active.institutionName} - Bursary`);
  }, [router]);

  if (!user) return null;

  function handlePayUtility(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amountNaira);
    if (isNaN(amt) || amt <= 0) {
      setFeedback({ type: "error", message: "Enter a valid payment amount." });
      return;
    }

    const costKobo = Math.round(amt * 100);
    if (user!.balanceKobo < costKobo) {
      setFeedback({ type: "error", message: "Insufficient Naira balance for this payment." });
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    all[idx].balanceKobo -= costKobo;
    const catObj = UTILITY_CATEGORIES.find((c) => c.id === selectedCategory);
    const ref = `UTIL-${Math.floor(100000 + Math.random() * 900000)}`;

    const narrationText =
      selectedCategory === "SCHOOL_FEES"
        ? `School Fees payment for Matric: ${matricNumberInput}, Course: ${courseInput}`
        : `Utility settlement (${catObj?.name})`;

    all[idx].transactions.unshift({
      id: `tx-util-${Date.now()}`,
      reference: ref,
      type: "DEBIT",
      category: "BILL",
      title: `${catObj?.name || "Utility Bill"}`,
      counterpartyName: selectedCategory === "SCHOOL_FEES" ? `${user.institutionName} Bursary Account` : "Ecobank Utility Gateway",
      counterpartyAccount: referenceNumber || "GEN-REF-001",
      amountKobo: costKobo,
      status: "SUCCESSFUL",
      narration: narrationText,
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser(all[idx]);
    setFeedback({
      type: "success",
      message: `Successfully paid ₦${amt.toLocaleString()} for ${catObj?.name}.`,
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
          }}
        >
          &larr; Dashboard
        </a>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Utility &amp; Tuition Hub
        </h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Category Cards (No descriptions) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.25rem" }}>
        {UTILITY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: isSelected ? "#ecfdf5" : "#ffffff",
                border: isSelected ? "2px solid #007749" : "1px solid #e2e8f0",
                borderRadius: "1rem",
                padding: "0.85rem 1rem",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ fontSize: "0.88rem", color: isSelected ? "#065f46" : "#0f172a" }}>{cat.name}</strong>
              {isSelected && <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#059669" }}>✓ Selected</span>}
            </div>
          );
        })}
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

      {/* Payment Form */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.35rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <form onSubmit={handlePayUtility}>
          {selectedCategory === "SCHOOL_FEES" && (
            <>
              <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
                <label className={styles.formLabel}>Matriculation Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24/203MBB/472"
                  className={styles.formInput}
                  value={matricNumberInput}
                  onChange={(e) => setMatricNumberInput(e.target.value)}
                />
              </div>

              <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
                <label className={styles.formLabel}>Course / Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medicine and Surgery"
                  className={styles.formInput}
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                />
              </div>
            </>
          )}

          <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
            <label className={styles.formLabel}>
              {selectedCategory === "SCHOOL_FEES" ? "School Bursary Reference" : "Account / Meter / Subscription ID"}
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "1.15rem" }}>
            <label className={styles.formLabel}>Amount (₦)</label>
            <input
              type="number"
              min="100"
              required
              className={styles.formInput}
              value={amountNaira}
              onChange={(e) => setAmountNaira(e.target.value)}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#007749",
              color: "#ffffff",
              padding: "0.85rem",
              borderRadius: "0.75rem",
              fontWeight: 800,
              fontSize: "0.82rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(0, 119, 73, 0.25)",
            }}
          >
            Pay Now ({formatKoboToNaira(user.balanceKobo)} available)
          </button>
        </form>
      </div>
    </main>
  );
}