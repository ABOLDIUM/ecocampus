// ============================================================================
// ECOCAMPUS NYSC LOAN MODULE — APP/(DASHBOARD)/LOANS/NYSC/PAGE.TSX
// Polished vibrant UI matching student loan, NYSC batch/state verification, & instant disbursement
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import styles from "../../transfers/transfer.module.css";

export default function NyscLoanPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // NYSC Verification fields
  const [callupNumber, setCallupNumber] = useState("");
  const [nyscBatch, setNyscBatch] = useState("Batch A, 2026");
  const [stateOfDeployment, setStateOfDeployment] = useState("Abuja (FCT)");
  const [loanAmountNaira, setLoanAmountNaira] = useState("75000");
  const [repaymentMonths, setRepaymentMonths] = useState("6");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
  }, [router]);

  if (!user) return null;

  function handleVerifyBatch(e: React.FormEvent) {
    e.preventDefault();
    if (!callupNumber || callupNumber.length < 5) {
      setFeedback({ type: "error", message: "Enter a valid NYSC Call-up or State Code (e.g. FC/26A/1982)." });
      return;
    }
    setFeedback(null);
    setStep(2);
  }

  function handleDisburseLoan(e: React.FormEvent) {
    e.preventDefault();
    const principalNaira = Number(loanAmountNaira);
    if (isNaN(principalNaira) || principalNaira <= 0) {
      setFeedback({ type: "error", message: "Enter a valid loan advance amount." });
      return;
    }

    const principalKobo = Math.round(principalNaira * 100);
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    all[idx].balanceKobo += principalKobo;
    const ref = `NYSC-ADV-${Math.floor(100000 + Math.random() * 900000)}`;
    all[idx].transactions.unshift({
      id: `tx-nysc-${Date.now()}`,
      reference: ref,
      type: "CREDIT",
      category: "DEPOSIT",
      title: "NYSC Corps Member Advance Disbursement",
      counterpartyName: "Ecobank NYSC Liquidity Desk",
      counterpartyAccount: user.accountNumber,
      amountKobo: principalKobo,
      status: "SUCCESSFUL",
      narration: `Deployment: ${stateOfDeployment} • Batch: ${nyscBatch}`,
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser(all[idx]);
    setStep(3);
  }

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
      {/* Professional Back Navigation Button */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <a
          href="/loans"
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
          &larr; Back to Loan Hub
        </a>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          NYSC Corps Advance
        </h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Vibrant Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #007749 0%, #065f46 65%, #0f172a 100%)",
          borderRadius: "1.25rem",
          padding: "1.35rem 1.5rem",
          color: "#ffffff",
          marginBottom: "1.25rem",
          boxShadow: "0 12px 30px rgba(0, 119, 73, 0.28)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: "-15px", bottom: "-15px", opacity: 0.12, fontSize: "6rem", fontWeight: 900 }}>
          🇳🇬
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            background: "rgba(255,255,255,0.2)",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            letterSpacing: "0.5px",
          }}
        >
          FEDERAL CORP WELFARE FACILITY
        </span>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, margin: "0.5rem 0 0.3rem 0" }}>
          Low-Interest NYSC Advance
        </h2>
        <p style={{ fontSize: "0.78rem", opacity: 0.9, margin: 0, lineHeight: 1.45 }}>
          Special liquidity support for serving Corps members backed by Ecobank &amp; NYSC state directorates.
        </p>
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

      {/* Step 1: Batch & State Verification */}
      {step === 1 && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "1.35rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.72rem", fontWeight: 800, color: "#007749" }}>
            <span>STEP 1 OF 2: CORPS VERIFICATION</span>
            <span>Batch &amp; State</span>
          </div>

          <form onSubmit={handleVerifyBatch}>
            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.formLabel}>NYSC Call-up Number or State Code</label>
              <input
                type="text"
                required
                placeholder="e.g. FC/26A/1982"
                className={styles.formInput}
                value={callupNumber}
                onChange={(e) => setCallupNumber(e.target.value)}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.formLabel}>Service Batch</label>
              <select
                className={styles.formInput}
                value={nyscBatch}
                onChange={(e) => setNyscBatch(e.target.value)}
              >
                <option value="Batch A, 2026">Batch A, 2026</option>
                <option value="Batch B, 2026">Batch B, 2026</option>
                <option value="Batch C, 2025">Batch C, 2025</option>
                <option value="Batch A, 2025">Batch A, 2025</option>
              </select>
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "1.15rem" }}>
              <label className={styles.formLabel}>State of Primary Assignment (PPA)</label>
              <select
                className={styles.formInput}
                value={stateOfDeployment}
                onChange={(e) => setStateOfDeployment(e.target.value)}
              >
                <option value="Abuja (FCT)">Abuja (FCT)</option>
                <option value="Lagos State">Lagos State</option>
                <option value="Rivers State">Rivers State</option>
                <option value="Oyo State">Oyo State</option>
                <option value="Kaduna State">Kaduna State</option>
                <option value="Kano State">Kano State</option>
                <option value="Other States">Other States</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#007749",
                color: "#ffffff",
                padding: "0.8rem",
                borderRadius: "0.75rem",
                fontWeight: 800,
                fontSize: "0.82rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Verify Corps Details &amp; Continue
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Loan Amount & Tenor */}
      {step === 2 && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "1.35rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.72rem", fontWeight: 800, color: "#007749" }}>
            <span>STEP 2 OF 2: SELECT ADVANCE AMOUNT</span>
            <span>0% Interest Tier</span>
          </div>

          <form onSubmit={handleDisburseLoan}>
            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.formLabel}>Advance Amount (₦20,000 - ₦150,000)</label>
              <input
                type="number"
                min="20000"
                max="150000"
                step="5000"
                required
                className={styles.formInput}
                value={loanAmountNaira}
                onChange={(e) => setLoanAmountNaira(e.target.value)}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "1.15rem" }}>
              <label className={styles.formLabel}>Repayment Tenor (Months)</label>
              <select
                className={styles.formInput}
                value={repaymentMonths}
                onChange={(e) => setRepaymentMonths(e.target.value)}
              >
                <option value="3">3 Months (Deducted from Allowance)</option>
                <option value="6">6 Months (Flexible)</option>
                <option value="12">12 Months (Extended)</option>
              </select>
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "0.85rem",
                borderRadius: "0.75rem",
                fontSize: "0.78rem",
                color: "#334155",
                marginBottom: "1.15rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Verified Corp Member:</span>
                <strong>{user.fullName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Deployment State:</span>
                <strong>{stateOfDeployment}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Interest Rate:</span>
                <strong style={{ color: "#059669" }}>0.0% p.a. (Subsidized)</strong>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#007749",
                color: "#ffffff",
                padding: "0.8rem",
                borderRadius: "0.75rem",
                fontWeight: 800,
                fontSize: "0.82rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(0, 119, 73, 0.25)",
              }}
            >
              Disburse ₦{Number(loanAmountNaira || 0).toLocaleString()} Instantly
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Success Confirmation */}
      {step === 3 && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "2rem 1.5rem",
            textAlign: "center",
            border: "1px solid #10b981",
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#ecfdf5",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              margin: "0 auto 1rem auto",
              fontWeight: 900,
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem" }}>
            NYSC Advance Disbursed Successfully!
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#475569", marginBottom: "1.5rem", lineHeight: 1.5 }}>
            Your advance of ₦{Number(loanAmountNaira || 0).toLocaleString()} has been credited to your EcoCampus account and is now ready for use.
          </p>
          <a
            href="/"
            style={{
              display: "block",
              backgroundColor: "#007749",
              color: "#ffffff",
              padding: "0.8rem",
              borderRadius: "0.75rem",
              fontWeight: 800,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Return to Dashboard
          </a>
        </div>
      )}
    </main>
  );
}