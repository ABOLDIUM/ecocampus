"use client";

import React, { useState } from "react";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import styles from "./transfer.module.css";

export default function TransfersPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [amountNaira, setAmountNaira] = useState("");
  const [narration, setNarration] = useState("Upkeep support");
  const [error, setError] = useState("");
  const [successReceipt, setSuccessReceipt] = useState<any>(null);

  // Simulated account resolution database
  function handleAccountInput(val: string) {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(clean);
    setError("");
    setResolvedName("");

    if (clean === "3094827104") {
      setResolvedName("CHINEDU OKAFOR (University of Abuja • 300L)");
    } else if (clean === "3098412095") {
      setResolvedName("AMINA BELLO (NYSC Lagos • PPA Ministry of Health)");
    } else if (clean.length === 10) {
      setResolvedName("ESTHER ADEBAYO (Covenant University • 400L)");
    }
  }

  function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = parseFloat(amountNaira);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid transfer amount.");
      return;
    }
    if (accountNumber === "3094827104") {
      setError("Cannot transfer to your own active account.");
      return;
    }

    const amountKobo = Math.round(amountNum * 100);
    const reference = `ECO-TRF-${Math.floor(100000 + Math.random() * 900000)}`;

    setSuccessReceipt({
      reference,
      amountKobo,
      recipient: resolvedName || `Account ${accountNumber}`,
      narration,
      timestamp: new Date().toLocaleString(),
    });
  }

  if (successReceipt) {
    return (
      <main className={styles.transferContainer}>
        <div className={styles.successReceipt}>
          <div className={styles.receiptIcon}>✓</div>
          <h1 className={styles.title}>Transfer Successful</h1>
          <p className={`${styles.receiptAmount} ec-mono-amount`}>
            {formatKoboToNaira(successReceipt.amountKobo)}
          </p>
          <p className={styles.receiptMeta}>
            Sent to <strong>{successReceipt.recipient}</strong>
            <br />
            Narration: {successReceipt.narration}
            <br />
            Ref: {successReceipt.reference} • {successReceipt.timestamp}
          </p>
          <a href="/" className={styles.doneBtn}>
            Back to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.transferContainer}>
      <header className={styles.headerRow}>
        <a href="/" className={styles.backLink}>
          &lt; Back
        </a>
        <h1 className={styles.title}>EcoCampus Transfer</h1>
        <div style={{ width: 40 }} />
      </header>

      {error && <p className={styles.errorBox}>{error}</p>}

      <div className={styles.card}>
        <form onSubmit={handleTransfer}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="accNum">
              Recipient Account Number (10 Digits)
            </label>
            <input
              id="accNum"
              type="text"
              inputMode="numeric"
              required
              maxLength={10}
              className={styles.input}
              placeholder="e.g. 3094827104"
              value={accountNumber}
              onChange={(e) => handleAccountInput(e.target.value)}
            />
            {resolvedName && <div className={styles.resolveBox}>✓ {resolvedName}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="amount">
              Amount (₦)
            </label>
            <input
              id="amount"
              type="number"
              min="100"
              step="50"
              required
              className={styles.input}
              placeholder="5000"
              value={amountNaira}
              onChange={(e) => setAmountNaira(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="narration">
              Narration / Remark
            </label>
            <textarea
              id="narration"
              rows={2}
              className={styles.textarea}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Send Money Instantly
          </button>
        </form>
      </div>
    </main>
  );
}