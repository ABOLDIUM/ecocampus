// ============================================================================
// ECOCAMPUS UNDERGRADUATE STUDENT LOAN MODULE — APP/(DASHBOARD)/LOANS/STUDENT/PAGE.TSX
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import styles from "../../transfers/transfer.module.css";

export default function StudentLoanPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [matricNumber, setMatricNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("University of Abuja");
  const [loanAmount, setLoanAmount] = useState("50000");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
    if (active.customerId) setMatricNumber(active.customerId);
    if (active.courseOfStudy) setDepartment(active.courseOfStudy);
    if (active.institutionName) setUniversity(active.institutionName);
  }, [router]);

  if (!user) return null;

  const levelStr = user.academicLevel || "";
  const isEligibleLevel = levelStr.includes("200") || levelStr.includes("300") || levelStr.includes("400") || levelStr.includes("500") || levelStr.includes("600");

  function handleVerifyStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!isEligibleLevel) {
      setFeedback({ type: "error", message: "Student loans are strictly available for 200 Level students and above." });
      return;
    }
    if (!matricNumber || !department) {
      setFeedback({ type: "error", message: "Please provide both your Matriculation number and Department." });
      return;
    }
    setFeedback(null);
    setStep(2);
  }

  function handleDisburseLoan(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedTerms) {
      setFeedback({ type: "error", message: "You must accept the terms and conditions to proceed." });
      return;
    }

    const amt = Number(loanAmount);
    if (isNaN(amt) || amt <= 0) {
      setFeedback({ type: "error", message: "Enter a valid loan amount." });
      return;
    }

    const costKobo = Math.round(amt * 100);
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    const ref = `STU-LOAN-${Math.floor(100000 + Math.random() * 900000)}`;
    all[idx].transactions.unshift({
      id: `tx-loan-${Date.now()}`,
      reference: ref,
      type: "CREDIT",
      category: "DEPOSIT",
      title: "Zero-Interest Student Loan Disbursement",
      counterpartyName: `${university} Bursary Account`,
      counterpartyAccount: "SCHOOL-BURSARY-01",
      amountKobo: costKobo,
      status: "SUCCESSFUL",
      narration: `Direct bursary disbursement for ${department} (${matricNumber})`,
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser(all[idx]);
    setFeedback({
      type: "success",
      message: `Successfully disbursed ₦${amt.toLocaleString()} directly into the ${university} bursary account for ${department}.`,
    });
  }

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
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
          }}
        >
          &larr; Back to Loan Hub
        </a>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Undergraduate Student Loan
        </h1>
        <div style={{ width: 40 }} />
      </header>

      <div
        style={{
          background: "linear-gradient(135deg, #007749 0%, #065f46 65%, #0f172a 100%)",
          borderRadius: "1.25rem",
          padding: "1.35rem 1.5rem",
          color: "#ffffff",
          marginBottom: "1.25rem",
          boxShadow: "0 12px 30px rgba(0, 119, 73, 0.28)",
        }}
      >
        <span style={{ fontSize: "0.65rem", fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
          ZERO INTEREST • 200L UPWARDS
        </span>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 900, margin: "0.4rem 0 0.3rem 0" }}>
          Direct Bursary Account Disbursement
        </h2>
        <p style={{ fontSize: "0.78rem", opacity: 0.9, margin: 0 }}>
          Level: <strong>{user.academicLevel}</strong> | Status: {isEligibleLevel ? "Eligible" : "Requires 200L+"}
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

      {step === 1 && (
        <div style={{ background: "#ffffff", borderRadius: "1.25rem", padding: "1.35rem", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 800, marginBottom: "0.75rem" }}>Academic &amp; Department Verification</h3>
          <form onSubmit={handleVerifyStudent}>
            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.formLabel}>University / Institution</label>
              <input
                type="text"
                required
                className={styles.formInput}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.formLabel}>Matriculation Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 24/203MBB/472"
                className={styles.formInput}
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
              />
            </div>
            <div className={styles.formGroup} style={{ marginBottom: "1.15rem" }}>
              <label className={styles.formLabel}>Department / Course of Study</label>
              <input
                type="text"
                required
                placeholder="e.g. Medicine and Surgery"
                className={styles.formInput}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
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
              Verify &amp; Proceed
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: "#ffffff", borderRadius: "1.25rem", padding: "1.35rem", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 800, marginBottom: "0.75rem" }}>Loan Amount &amp; Terms</h3>
          <form onSubmit={handleDisburseLoan}>
            <div className={styles.formGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.formLabel}>Loan Amount (₦)</label>
              <input
                type="number"
                min="10000"
                max="250000"
                required
                className={styles.formInput}
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>

            {/* Terms and Conditions Box */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "0.75rem",
                padding: "0.85rem",
                fontSize: "0.73rem",
                color: "#334155",
                maxHeight: "110px",
                overflowY: "auto",
                marginBottom: "0.85rem",
                lineHeight: 1.4,
              }}
            >
              <strong>Terms and Conditions:</strong>
              <br />
              1. This zero-interest loan facility is sponsored by Ecobank Nigeria in partnership with EcoCampus for verified undergraduate students in 200 Level and above.
              <br />
              2. Funds are disbursed directly to the university bursary account[cite: 11].
              <br />
              3. Repayment commences upon graduation or through structured semester installments.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.15rem", fontSize: "0.78rem" }}>
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="terms" style={{ fontWeight: 700, cursor: "pointer" }}>
                I accept the terms and conditions of this loan agreement.
              </label>
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
              Disburse Directly to School Account
            </button>
          </form>
        </div>
      )}
    </main>
  );
}