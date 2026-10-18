// ============================================================================
// ECOCAMPUS AIRTIME & DATA HUB — APP/(DASHBOARD)/AIRTIME-DATA/PAGE.TSX
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import styles from "../transfers/transfer.module.css";

const NETWORKS = [
  { id: "MTN", name: "MTN Nigeria", color: "#facc15", badgeBg: "#fef9c3", text: "#713f12" },
  { id: "AIRTEL", name: "Airtel Nigeria", color: "#ef4444", badgeBg: "#fee2e2", text: "#991b1b" },
  { id: "GLO", name: "Globacom (GLO)", color: "#22c55e", badgeBg: "#dcfce7", text: "#166534" },
  { id: "9MOBILE", name: "9mobile", color: "#14532d", badgeBg: "#f0fdf4", text: "#14532d" },
];

const PRESETS = [
  { amount: 100, cashback: 1.0 },
  { amount: 200, cashback: 2.0 },
  { amount: 300, cashback: 3.0 },
  { amount: 500, cashback: 5.0 },
  { amount: 1000, cashback: 10.0 },
  { amount: 2000, cashback: 20.0 },
];

export default function AirtimeDataPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0].id);
  const [phone, setPhone] = useState("");
  const [amountNaira, setAmountNaira] = useState("500");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [useCashbackToggle, setUseCashbackToggle] = useState(false);
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

  function handleOpenCheckout(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amountNaira);
    if (isNaN(amt) || amt < 50) {
      setFeedback({ type: "error", message: "Enter a valid amount between ₦50 and ₦500,000." });
      return;
    }
    if (!phone || phone.length < 10) {
      setFeedback({ type: "error", message: "Enter a valid 11-digit phone number." });
      return;
    }
    setFeedback(null);
    setShowCheckoutModal(true);
  }

  function handleConfirmPay() {
    const amt = Number(amountNaira);
    const costKobo = Math.round(amt * 100);

    if (user!.balanceKobo < costKobo) {
      setFeedback({ type: "error", message: "Insufficient Naira wallet balance for this purchase." });
      setShowCheckoutModal(false);
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    all[idx].balanceKobo -= costKobo;
    const ref = `AIRTIME-${Math.floor(100000 + Math.random() * 900000)}`;
    all[idx].transactions.unshift({
      id: `tx-air-${Date.now()}`,
      reference: ref,
      type: "DEBIT",
      category: "BILL",
      title: `${selectedNetwork} Airtime Top-Up`,
      counterpartyName: `${selectedNetwork} Gateway`,
      counterpartyAccount: phone,
      amountKobo: costKobo,
      status: "SUCCESSFUL",
      narration: `Top-up for ${phone}`,
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser(all[idx]);
    setShowCheckoutModal(false);
    setFeedback({ type: "success", message: `Successfully paid ₦${amt.toLocaleString()} for ${selectedNetwork} airtime.` });
  }

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
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
          Airtime &amp; Data
        </h1>
        <div style={{ width: 40 }} />
      </header>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.1rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
          {NETWORKS.map((net) => {
            const isSelected = selectedNetwork === net.id;
            return (
              <button
                key={net.id}
                type="button"
                onClick={() => setSelectedNetwork(net.id)}
                style={{
                  padding: "0.5rem 0.2rem",
                  borderRadius: "0.75rem",
                  border: isSelected ? "2px solid #007749" : "1px solid #cbd5e1",
                  background: isSelected ? net.badgeBg : "#ffffff",
                  color: net.text,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  cursor: "pointer",
                }}
              >
                {net.id}
              </button>
            );
          })}
        </div>

        <div className={styles.formGroup} style={{ marginBottom: "0.5rem" }}>
          <label className={styles.formLabel}>Recipient Mobile Number</label>
          <input
            type="tel"
            maxLength={11}
            required
            placeholder="0812 000 0000"
            className={styles.formInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
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

      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.25rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.85rem" }}>Top up</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem", marginBottom: "1.1rem" }}>
          {PRESETS.map((p) => {
            const isSelected = amountNaira === String(p.amount);
            return (
              <div
                key={p.amount}
                onClick={() => setAmountNaira(String(p.amount))}
                style={{
                  background: isSelected ? "#ecfdf5" : "#f8fafc",
                  border: isSelected ? "2px solid #007749" : "1px solid #e2e8f0",
                  borderRadius: "0.85rem",
                  padding: "0.75rem 0.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: "0.95rem", color: "#0f172a", marginBottom: "0.15rem" }}>
                  ₦{p.amount.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.66rem", fontWeight: 800, color: "#059669" }}>
                  ₦{p.cashback.toFixed(2)} Cashback
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleOpenCheckout}>
          <div className={styles.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={styles.formLabel}>Amount (₦50 - ₦500,000)</label>
            <input
              type="number"
              min="50"
              max="500000"
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
              borderRadius: "0.85rem",
              fontWeight: 800,
              fontSize: "0.85rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Pay
          </button>
        </form>
      </div>

      {showCheckoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "480px",
              borderTopLeftRadius: "1.5rem",
              borderTopRightRadius: "1.5rem",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.1rem", fontWeight: 800, cursor: "pointer" }}
              >
                ✕
              </button>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>Confirm Payment</h3>
              <div style={{ width: 20 }} />
            </div>

            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0f172a", fontFamily: "monospace" }}>
                ₦{Number(amountNaira || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "0.85rem",
                padding: "0.85rem",
                fontSize: "0.78rem",
                color: "#334155",
                marginBottom: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Product:</span>
                <strong>{selectedNetwork} Airtime</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Recipient:</span>
                <strong>{phone}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Use Cashback Balance:</span>
                <input
                  type="checkbox"
                  checked={useCashbackToggle}
                  onChange={(e) => setUseCashbackToggle(e.target.checked)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPay}
              style={{
                width: "100%",
                backgroundColor: "#007749",
                color: "#ffffff",
                padding: "0.85rem",
                borderRadius: "0.85rem",
                fontWeight: 800,
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Pay
            </button>
          </div>
        </div>
      )}
    </main>
  );
}