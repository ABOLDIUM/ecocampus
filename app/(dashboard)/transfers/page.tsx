"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import {
  getActiveUser,
  executeDynamicTransfer,
  getUsers,
  saveUsers,
  EcoUser,
} from "@/lib/database/user-store";
import { resolveBankAccountNumber } from "@/lib/api/banking-services";
import { NIGERIAN_BANKS } from "@/lib/data/nigerian-banks";
import { BottomNav } from "@/components/navigation/BottomNav";
import styles from "./transfer.module.css";

export default function TransfersPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [transferMode, setTransferMode] = useState<"ECOCAMPUS" | "OTHER_BANKS">("ECOCAMPUS");
  const [selectedBankCode, setSelectedBankCode] = useState<string>(NIGERIAN_BANKS[0].code);
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [amountNaira, setAmountNaira] = useState("");
  const [narration, setNarration] = useState("Upkeep support");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    reference: string;
    amountKobo: number;
    recipient: string;
    narration: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.replace("/landing");
      return;
    }
    setUser(active);
  }, [router]);

  async function handleAccountInput(val: string, mode = transferMode, bankCode = selectedBankCode) {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(clean);
    setError("");
    setResolvedName("");

    if (clean.length === 10) {
      setIsResolving(true);
      const codeToQuery = mode === "ECOCAMPUS" ? "ECO" : bankCode;
      const res = await resolveBankAccountNumber(clean, codeToQuery);
      setIsResolving(false);
      if (res.success) {
        setResolvedName(res.accountName);
      } else {
        setResolvedName("");
        if (res.error) setError(res.error);
      }
    }
  }

  function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please sign in to transfer funds.");
      return;
    }

    const amountNum = parseFloat(amountNaira);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid transfer amount.");
      return;
    }

    const amountKobo = Math.round(amountNum * 100);
    if (user.balanceKobo < amountKobo) {
      setError("Insufficient balance in your EcoCampus account.");
      return;
    }

    if (transferMode === "ECOCAMPUS" && accountNumber === user.accountNumber) {
      setError("Cannot transfer to your own active account.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (transferMode === "ECOCAMPUS") {
        const res = executeDynamicTransfer(
          user.id,
          accountNumber,
          amountKobo,
          narration || "EcoCampus Transfer"
        );

        setLoading(false);

        if (!res.ok) {
          setError(res.error || "Transfer failed. Please try again.");
          return;
        }

        const updated = getActiveUser();
        setUser(updated);

        setSuccessReceipt({
          reference: res.reference || `ECO-TRF-${Date.now()}`,
          amountKobo,
          recipient: resolvedName || `Account ${accountNumber}`,
          narration: narration || "EcoCampus Transfer",
          timestamp: new Date().toLocaleString(),
        });
      } else {
        const selectedBank = NIGERIAN_BANKS.find((b) => b.code === selectedBankCode);
        const all = getUsers();
        const idx = all.findIndex((u) => u.id === user.id);
        if (idx === -1) {
          setLoading(false);
          return;
        }

        const ref = `EXT-TRF-${Math.floor(100000 + Math.random() * 900000)}`;
        all[idx].balanceKobo -= amountKobo;
        all[idx].transactions.unshift({
          id: `tx-ext-${Date.now()}`,
          reference: ref,
          type: "DEBIT",
          category: "TRANSFER",
          title: `Transfer to ${selectedBank?.name || "Other Bank"}`,
          counterpartyName: resolvedName || "External Recipient",
          counterpartyAccount: accountNumber,
          amountKobo,
          status: "SUCCESSFUL",
          narration: narration || "Interbank transfer",
          createdAt: "Just now",
        });

        saveUsers(all);
        setUser({ ...all[idx] });
        setLoading(false);

        setSuccessReceipt({
          reference: ref,
          amountKobo,
          recipient: `${resolvedName || accountNumber} (${selectedBank?.name || "Other Bank"})`,
          narration: narration || "Interbank transfer",
          timestamp: new Date().toLocaleString(),
        });
      }
    }, 600);
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
            Ref: {successReceipt.reference} &middot; {successReceipt.timestamp}
          </p>
          <Link href="/" className={styles.doneBtn}>
            Back to Dashboard
          </Link>
        </div>
        <BottomNav activeTab="transfers" />
      </main>
    );
  }

  return (
    <main className={styles.transferContainer} style={{ paddingBottom: "80px" }}>
      <header className={styles.headerRow}>
        <Link href="/" className={styles.backLink}>
          &larr; Back
        </Link>
        <h1 className={styles.title}>Transfer Funds</h1>
        <div style={{ width: 40 }} />
      </header>

      {error && <p className={styles.errorBox}>{error}</p>}

      <div className={styles.card}>
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748B" }}>
          <span>Available Balance:</span>
          <strong style={{ color: "#0A1628" }}>{user ? formatKoboToNaira(user.balanceKobo) : "₦0.00"}</strong>
        </div>

        {/* Mode toggle tabs */}
        <div className={styles.transferTabGroup} role="tablist" aria-label="Transfer mode">
          <button
            type="button"
            role="tab"
            aria-selected={transferMode === "ECOCAMPUS"}
            onClick={() => {
              setTransferMode("ECOCAMPUS");
              setResolvedName("");
              setAccountNumber("");
              setError("");
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
              setResolvedName("");
              setAccountNumber("");
              setError("");
            }}
            className={`${styles.transferTab} ${transferMode === "OTHER_BANKS" ? styles.transferTabActive : ""}`}
          >
            Other Banks
          </button>
        </div>

        <form onSubmit={handleTransfer}>
          {transferMode === "OTHER_BANKS" && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="bankSelect">Select Bank</label>
              <select
                id="bankSelect"
                className={styles.input}
                value={selectedBankCode}
                onChange={(e) => {
                  setSelectedBankCode(e.target.value);
                  if (accountNumber.length === 10) {
                    handleAccountInput(accountNumber, "OTHER_BANKS", e.target.value);
                  }
                }}
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* EcoCampus accounts quick selection */}
          {transferMode === "ECOCAMPUS" && (() => {
            const peers = getUsers().filter((u) => u.id !== user?.id);
            return peers.length > 0 ? (
              <div style={{ marginBottom: "0.85rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "0.35rem" }}>
                  EcoCampus Accounts
                </span>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {peers.map((peer) => (
                    <button
                      key={peer.id}
                      type="button"
                      onClick={() => handleAccountInput(peer.accountNumber, "ECOCAMPUS")}
                      style={{
                        background: accountNumber === peer.accountNumber ? "#003b73" : "#f1f5f9",
                        color: accountNumber === peer.accountNumber ? "#ffffff" : "#1e293b",
                        border: "1px solid",
                        borderColor: accountNumber === peer.accountNumber ? "#003b73" : "#e2e8f0",
                        borderRadius: "9999px",
                        padding: "0.3rem 0.65rem",
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      aria-label={`Select ${peer.firstName}`}
                    >
                      {peer.firstName} · {peer.accountNumber}
                    </button>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="accNum">
              {transferMode === "ECOCAMPUS" ? "EcoCampus Account Number (10 Digits)" : "Account Number (10 Digits)"}
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
            {isResolving && (
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.4rem" }}>
                Resolving account...
              </div>
            )}
            {resolvedName && !isResolving && (
              <div className={styles.resolveBox}>✓ {resolvedName}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="amount">
              Amount (₦)
            </label>
            <input
              id="amount"
              type="number"
              min="50"
              step="50"
              required
              className={styles.input}
              placeholder="5000"
              value={amountNaira}
              onChange={(e) => setAmountNaira(e.target.value)}
            />
          </div>

          {/* Quick Amount Chips */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {[1000, 2000, 5000, 10000, 20000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountNaira(String(amt))}
                style={{
                  background: amountNaira === String(amt) ? "#001F3F" : "#F1F5F9",
                  color: amountNaira === String(amt) ? "#FFFFFF" : "#334155",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Processing Transfer..." : "Send Money Instantly"}
          </button>
        </form>
      </div>

      <BottomNav activeTab="transfers" />
    </main>
  );
}