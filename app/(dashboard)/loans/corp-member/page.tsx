"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { NYSC_STATE_PREFIXES, generateNyscStateCode } from "@/lib/data/nigerian-institutions";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import styles from "../../transfers/transfer.module.css";

export default function CorpMemberLoanPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [nyscPrefix, setNyscPrefix] = useState("FC");
  const [nyscBatch, setNyscBatch] = useState("26A");
  const [nyscCode, setNyscCode] = useState("FC/26A/4821");
  const [loanAmount, setLoanAmount] = useState("100000");
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
    if (active.nyscStateCode) setNyscCode(active.nyscStateCode);
  }, [router]);

  const statePrefixEntries = useMemo(() => {
    return NYSC_STATE_PREFIXES ? Object.entries(NYSC_STATE_PREFIXES) : [];
  }, []);

  if (!user) return null;

  const numericAmount = parseFloat(loanAmount) || 0;
  const principalKobo = Math.round(numericAmount * 100);
  const serviceFeeKobo = Math.round(principalKobo * 0.05);
  const totalRepaymentKobo = principalKobo + serviceFeeKobo;

  function handleVerifyNyscCode(e: React.FormEvent) {
    e.preventDefault();
    if (!nyscCode) {
      setError("Please provide your valid NYSC State Code.");
      return;
    }
    setError("");
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedCode(nyscCode.toUpperCase());
    }, 1200);
  }

  function handleOpenTerms(e: React.FormEvent) {
    e.preventDefault();
    if (!verifiedCode) {
      setError("Please verify your NYSC State Code first.");
      return;
    }
    setError("");
    setShowTermsModal(true);
  }

  function handleDisburseLoan() {
    if (!termsAgreed) {
      setError("You must agree to the NYSC Loan Terms & Conditions.");
      return;
    }

    const allUsers = getUsers();
    const idx = allUsers.findIndex((u) => u.id === user?.id);
    if (idx === -1) return;

    const ref = `ECO-NYSC-${Math.floor(100000 + Math.random() * 900000)}`;
    allUsers[idx].loanProfileType = "CORP_MEMBER";
    allUsers[idx].nyscStateCode = verifiedCode;
    allUsers[idx].balanceKobo += principalKobo;
    allUsers[idx].transactions.unshift({
      id: `tx-nysclookup-${Date.now()}`,
      reference: ref,
      type: "CREDIT",
      category: "LOAN",
      title: "NYSC Allawee Advance",
      counterpartyName: "EcoCampus Credit Desk",
      counterpartyAccount: "CORP-MEMBER-POOL",
      amountKobo: principalKobo,
      status: "SUCCESSFUL",
      narration: "Low interest service advance",
      createdAt: "Just now",
    });

    saveUsers(allUsers);
    setUser(allUsers[idx]);
    setShowTermsModal(false);
    setTermsAgreed(true);
  }

  return (
    <main className={styles.transferContainer}>
      <header className={styles.headerRow}>
        <a href="/loans" className={styles.backLink}>&lt; Back</a>
        <h1 className={styles.title}>Nysc Loan (Low Interest)</h1>
        <div style={{ width: 40 }} />
      </header>

      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.card}>
        <form onSubmit={handleOpenTerms}>
          <div className="rowTwo" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div>
              <label className={styles.formLabel}>Deployment State</label>
              <select
                className={styles.formInput}
                value={nyscPrefix}
                onChange={(e) => {
                  const prefix = e.target.value;
                  setNyscPrefix(prefix);
                  setNyscCode(generateNyscStateCode(prefix, nyscBatch));
                  setVerifiedCode("");
                }}
              >
                {statePrefixEntries.map(([prefix, name]) => (
                  <option key={prefix} value={prefix}>{name} ({prefix})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.formLabel}>Service Batch</label>
              <select
                className={styles.formInput}
                value={nyscBatch}
                onChange={(e) => {
                  const batch = e.target.value;
                  setNyscBatch(batch);
                  setNyscCode(generateNyscStateCode(nyscPrefix, batch));
                  setVerifiedCode("");
                }}
              >
                <option value="26A">2026 Batch A</option>
                <option value="26B">2026 Batch B</option>
                <option value="25C">2025 Batch C</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
              <label className={styles.formLabel} style={{ marginBottom: 0 }}>NYSC State Code</label>
              <button
                type="button"
                onClick={() => {
                  setNyscCode(generateNyscStateCode(nyscPrefix, nyscBatch));
                  setVerifiedCode("");
                }}
                style={{ background: "none", border: "none", color: "#059669", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}
              >
                Generate Code
              </button>
            </div>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. FC/26A/4821"
              value={nyscCode}
              onChange={(e) => {
                setNyscCode(e.target.value.toUpperCase());
                setVerifiedCode("");
              }}
            />
          </div>

          {!verifiedCode ? (
            <div style={{ marginBottom: "1rem" }}>
              {isVerifying ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", background: "#f1f5f9", borderRadius: "0.75rem" }}>
                  <div style={{ width: "20px", height: "20px", border: "3px solid #cbd5e1", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Verifying NYSC Secretariat database...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyNyscCode}
                  className="ec-btn-secondary"
                  style={{ width: "100%", padding: "0.75rem", fontWeight: 700 }}
                >
                  Verify NYSC State Code
                </button>
              )}
            </div>
          ) : (
            <div style={{ background: "#ecfdf5", border: "1px solid #10b981", borderRadius: "0.75rem", padding: "0.75rem", marginBottom: "1rem", color: "#065f46", fontSize: "0.82rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>✓ Verified Corp Member Code: {verifiedCode}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Requested Advance (₦)</label>
            <input
              type="number"
              min="20000"
              max="500000"
              step="10000"
              required
              className={styles.formInput}
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!verifiedCode}
            className="ec-btn-primary"
            style={{ width: "100%", backgroundColor: verifiedCode ? "#059669" : "#94a3b8", cursor: verifiedCode ? "pointer" : "not-allowed" }}
          >
            Apply
          </button>
        </form>
      </div>

      {/* NYSC Terms Pop-up Modal */}
      {showTermsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", padding: "1.5rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>NYSC Loan Terms &amp; Conditions</h3>
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "0.75rem", padding: "1rem", maxHeight: "180px", overflowY: "auto", fontSize: "0.78rem", color: "#334155", marginBottom: "1rem", lineHeight: 1.5 }}>
              <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>Official Corp Member Service Advance Agreement</p>
              <p style={{ marginBottom: "0.3rem" }}>• Low interest service fee of 5% applies to the principal advance amount for serving members.</p>
              <p style={{ marginBottom: "0.3rem" }}>• Requires a valid state code and active primary assignment deployment confirmation.</p>
              <p>• Repayment aligns with standard monthly allowance cycles.</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <input
                type="checkbox"
                id="nysc-popup-terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#059669", cursor: "pointer" }}
              />
              <label htmlFor="nysc-popup-terms" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", cursor: "pointer" }}>
                I agree to the NYSC Loan Terms &amp; Conditions
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={{ padding: "0.85rem", border: "1px solid #cbd5e1", borderRadius: "0.75rem", background: "#ffffff", fontWeight: 700, cursor: "pointer", color: "#475569" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisburseLoan}
                className="ec-btn-primary"
                style={{ backgroundColor: "#059669", margin: 0 }}
              >
                Accept &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}