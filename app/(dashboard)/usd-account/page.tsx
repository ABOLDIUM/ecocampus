// ============================================================================
// ECOCAMPUS USD DOMICILIARY ACCOUNT MODULE — APP/(DASHBOARD)/USD-ACCOUNT/PAGE.TSX
// Exclusively displays Ecobank USD Domiciliary Account, Live CBN/Ecobank FX & USD Card
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCentsToUsd, formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import {
  CardNetwork,
  UserBankingProducts,
  getUserBankingProducts,
  openUsdDomiciliaryAccount,
  createUsdVirtualCard,
  saveUserBankingProducts,
} from "@/lib/api/banking-services";
import styles from "../transfers/transfer.module.css";

interface FxRateData {
  source: string;
  cbnMidRate: number;
  ecobankRate: number;
  updatedAt: string;
}

export default function UsdDomiciliaryAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [products, setProducts] = useState<UserBankingProducts | null>(null);
  const [usdNetworkChoice, setUsdNetworkChoice] = useState<CardNetwork>("VISA");
  const [isUsdCardFlipped, setIsUsdCardFlipped] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const [fxData, setFxData] = useState<FxRateData>({
    source: "CBN / Ecobank Live FX Desk",
    cbnMidRate: 1585.5,
    ecobankRate: 1598.0,
    updatedAt: new Date().toISOString(),
  });
  const [loadingFx, setLoadingFx] = useState(false);
  const [usdFundInput, setUsdFundInput] = useState("20");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
    const loaded = getUserBankingProducts(active);
    setProducts(loaded);
    setUsdNetworkChoice(loaded.domProfile.usdCardNetwork);
    fetchLiveExchangeRate();
  }, [router]);

  async function fetchLiveExchangeRate() {
    setLoadingFx(true);
    try {
      const res = await fetch("/api/fx-rate");
      const data = await res.json();
      if (data.status === "success") {
        setFxData({
          source: data.source,
          cbnMidRate: data.cbnMidRate,
          ecobankRate: data.ecobankRate,
          updatedAt: data.updatedAt,
        });
      }
    } catch {
      // Keep fallback rate
    } finally {
      setLoadingFx(false);
    }
  }

  if (!user || !products) return null;

  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(text.replace(/\s+/g, ""));
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  }

  function handleOpenDomiciliary() {
    const updated = openUsdDomiciliaryAccount(user!);
    setProducts({ ...updated });
    setFeedback({
      type: "success",
      message: `Ecobank USD Domiciliary Account (${updated.domProfile.domAccountNumber}) opened successfully.`,
    });
  }

  function handleFundDomiciliaryFromNaira(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const usdAmount = Number(usdFundInput);
    if (isNaN(usdAmount) || usdAmount < 5) {
      setFeedback({ type: "error", message: "Minimum domiciliary funding amount is $5.00." });
      return;
    }

    const requiredNaira = usdAmount * fxData.ecobankRate;
    const requiredKobo = Math.round(requiredNaira * 100);

    if (user!.balanceKobo < requiredKobo) {
      setFeedback({
        type: "error",
        message: `Insufficient Naira balance. You need ${formatKoboToNaira(requiredKobo)} at ₦${fxData.ecobankRate.toLocaleString()}/$1.`,
      });
      return;
    }

    const allUsers = getUsers();
    const idx = allUsers.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    const addedCents = Math.round(usdAmount * 100);
    allUsers[idx].balanceKobo -= requiredKobo;
    allUsers[idx].usdBalanceCents = (allUsers[idx].usdBalanceCents || 0) + addedCents;

    const ref = `ECO-FX-${Math.floor(100000 + Math.random() * 900000)}`;
    allUsers[idx].transactions.unshift({
      id: `tx-fx-${Date.now()}`,
      reference: ref,
      type: "DEBIT",
      category: "TRANSFER",
      title: `USD Domiciliary Funding ($${usdAmount.toFixed(2)})`,
      counterpartyName: "Ecobank Domiciliary Desk",
      counterpartyAccount: products!.domProfile.domAccountNumber,
      amountKobo: requiredKobo,
      status: "SUCCESSFUL",
      narration: `FX Conversion @ ₦${fxData.ecobankRate}/$1`,
      createdAt: "Just now",
    });

    saveUsers(allUsers);
    setUser(allUsers[idx]);

    const updatedProducts = getUserBankingProducts(allUsers[idx]);
    updatedProducts.domProfile.usdBalanceCents = allUsers[idx].usdBalanceCents;
    saveUserBankingProducts(user!.id, updatedProducts);
    setProducts({ ...updatedProducts });

    setFeedback({
      type: "success",
      message: `Funded $${usdAmount.toFixed(2)} into your USD Domiciliary Account (${formatKoboToNaira(requiredKobo)} debited).`,
    });
  }

  function handleIssueUsdCard() {
    if ((user?.usdBalanceCents || 0) < 500) {
      setFeedback({
        type: "error",
        message: "Maintain at least $5.00 in your USD Domiciliary Account before issuing a Dollar Card.",
      });
      return;
    }
    const updated = createUsdVirtualCard(user!, usdNetworkChoice);
    setProducts({ ...updated });
    setFeedback({
      type: "success",
      message: `Ecobank ${usdNetworkChoice} Virtual Dollar Card issued and linked to your USD Domiciliary Account.`,
    });
  }

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#007749",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          &larr; Dashboard
        </a>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          USD Domiciliary Account
        </h1>
        <div style={{ width: 48 }} />
      </header>

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

      {!products.domProfile.hasDomAccount ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "1.35rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "#1d4ed8",
                background: "#eff6ff",
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
              }}
            >
              FOREIGN EXCHANGE ACCOUNT
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Ecobank Domiciliary</span>
          </div>

          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.4rem 0" }}>
            Open Your Ecobank USD Domiciliary Account
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#475569", margin: "0 0 1.15rem 0", lineHeight: 1.5 }}>
            Hold United States Dollars, convert funds from your Naira wallet at live CBN / Ecobank FX rates, and issue a USD virtual card for global tuition and subscriptions.
          </p>

          <div
            style={{
              background: "#f8fafc",
              padding: "0.9rem",
              borderRadius: "0.85rem",
              fontSize: "0.78rem",
              color: "#334155",
              marginBottom: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Currency:</span>
              <strong>USD ($)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Partner Bank:</span>
              <strong>Ecobank Nigeria PLC (SWIFT: ECOCNGLA)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Live CBN / Ecobank Rate:</span>
              <strong style={{ color: "#007749" }}>₦{fxData.ecobankRate.toLocaleString()} / $1.00</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenDomiciliary}
            style={{
              width: "100%",
              backgroundColor: "#0b2545",
              color: "#ffffff",
              padding: "0.85rem",
              borderRadius: "0.85rem",
              fontWeight: 800,
              fontSize: "0.85rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create USD Domiciliary Account
          </button>
        </div>
      ) : (
        <>
          {/* USD Domiciliary Account Summary */}
          <div
            style={{
              background: "linear-gradient(135deg, #0b2545 0%, #134074 100%)",
              borderRadius: "1.25rem",
              padding: "1.35rem",
              color: "#ffffff",
              marginBottom: "1.25rem",
              boxShadow: "0 12px 28px rgba(11, 37, 69, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.8px", color: "#93c5fd" }}>
                ECOBANK USD DOMICILIARY ACCOUNT
              </span>
              <button
                type="button"
                onClick={() => setHideBalance((p) => !p)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                {hideBalance ? "Show Balance" : "Hide Balance"}
              </button>
            </div>

            <div
              onClick={() => setHideBalance((p) => !p)}
              style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "monospace", marginBottom: "0.85rem", color: "#a7f3d0", cursor: "pointer" }}
            >
              {hideBalance ? "••••••••" : formatCentsToUsd(user.usdBalanceCents)}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.76rem",
                background: "rgba(0,0,0,0.25)",
                padding: "0.55rem 0.8rem",
                borderRadius: "0.65rem",
              }}
            >
              <div>
                <span style={{ opacity: 0.75 }}>USD Acct: </span>
                <strong style={{ fontFamily: "monospace", letterSpacing: "1px" }}>
                  {products.domProfile.domAccountNumber}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(products.domProfile.domAccountNumber, "DOM_ACCT")}
                style={{
                  background: "#007749",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.2rem 0.55rem",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {copiedText === "DOM_ACCT" ? "Copied" : "Copy Acct"}
              </button>
            </div>
          </div>

          {/* Live FX Funding Box */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              border: "1px solid #e2e8f0",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Fund USD Account from Naira Wallet
              </h3>
              <button
                type="button"
                onClick={fetchLiveExchangeRate}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007749",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {loadingFx ? "Refreshing FX..." : "↻ Refresh Rate"}
              </button>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "0.75rem",
                padding: "0.65rem 0.85rem",
                fontSize: "0.75rem",
                color: "#065f46",
                marginBottom: "0.9rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{fxData.source}</span>
              <strong>$1.00 = ₦{fxData.ecobankRate.toLocaleString()}</strong>
            </div>

            <form onSubmit={handleFundDomiciliaryFromNaira}>
              <div className={styles.formGroup} style={{ marginBottom: "0.75rem" }}>
                <label className={styles.formLabel}>Amount to Credit in USD ($)</label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  step="1"
                  required
                  className={styles.formInput}
                  value={usdFundInput}
                  onChange={(e) => setUsdFundInput(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#475569", marginBottom: "0.9rem" }}>
                <span>Naira Debit Equivalent:</span>
                <strong style={{ color: "#0f172a" }}>
                  ₦{(Number(usdFundInput || 0) * fxData.ecobankRate).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#007749",
                  color: "#ffffff",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Convert NGN &amp; Fund USD Account
              </button>
            </form>
          </div>

          {/* Companion USD Virtual Card */}
          {!products.domProfile.hasUsdCard ? (
            <div style={{ background: "#ffffff", borderRadius: "1.25rem", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.35rem 0" }}>
                Issue Companion USD Dollar Card
              </h3>
              <p style={{ fontSize: "0.78rem", color: "#475569", margin: "0 0 0.9rem 0" }}>
                Generate a virtual USD Visa or Mastercard backed by your USD Domiciliary balance.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem" }}>
                {(["VISA", "MASTERCARD"] as CardNetwork[]).map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setUsdNetworkChoice(net)}
                    style={{
                      padding: "0.55rem",
                      borderRadius: "0.65rem",
                      fontWeight: 800,
                      fontSize: "0.74rem",
                      border: usdNetworkChoice === net ? "2px solid #0b2545" : "1px solid #cbd5e1",
                      background: usdNetworkChoice === net ? "#eff6ff" : "#ffffff",
                      color: usdNetworkChoice === net ? "#0b2545" : "#475569",
                      cursor: "pointer",
                    }}
                  >
                    {net} USD
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleIssueUsdCard}
                style={{
                  width: "100%",
                  backgroundColor: "#0b2545",
                  color: "#ffffff",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Activate {usdNetworkChoice} Dollar Card
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.65rem" }}>
                Companion USD Virtual Card (Tap to Flip for CVV)
              </h3>
              <div
                onClick={() => setIsUsdCardFlipped((p) => !p)}
                role="button"
                tabIndex={0}
                style={{ perspective: "1200px", width: "100%", height: "232px", cursor: "pointer", userSelect: "none" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isUsdCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* USD CARD FRONT */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: "linear-gradient(135deg, #0b2545 0%, #134074 55%, #007749 100%)",
                      borderRadius: "1.25rem",
                      padding: "1.35rem 1.5rem",
                      color: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.16)", padding: "0.25rem 0.65rem", borderRadius: "999px" }}>
                        <Image src="/brand/ecocampus-logo.png" alt="EcoCampus" width={20} height={20} style={{ objectFit: "contain" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 800 }}>EcoCampus USD</span>
                      </div>
                      {!imgError ? (
                        <Image src="/brand/ecobank.png" alt="Ecobank" width={125} height={36} style={{ width: "auto", height: "34px", objectFit: "contain" }} onError={() => setImgError(true)} />
                      ) : (
                        <span style={{ fontWeight: 900, fontStyle: "italic" }}>Ecobank</span>
                      )}
                    </div>

                    <div style={{ fontSize: "1.18rem", fontFamily: "monospace", letterSpacing: "2.8px", fontWeight: 700 }}>
                      {products.domProfile.usdCardNumber}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <span style={{ fontSize: "0.55rem", opacity: 0.8, fontFamily: "monospace" }}>
                          VALID THRU {products.domProfile.expiryDate} • TAP FOR CVV
                        </span>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: "0.82rem" }}>{user.fullName.toUpperCase()}</p>
                      </div>
                      <span style={{ background: "#ffffff", color: "#0b2545", padding: "0.25rem 0.65rem", borderRadius: "6px", fontWeight: 900, fontSize: "0.8rem" }}>
                        {products.domProfile.usdCardNetwork}
                      </span>
                    </div>
                  </div>

                  {/* USD CARD BACK */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "linear-gradient(135deg, #0b2545 0%, #134074 55%, #007749 100%)",
                      borderRadius: "1.25rem",
                      color: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      paddingBottom: "1.1rem",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: "100%", height: "46px", background: "#0f172a", marginTop: "1.25rem" }} />
                    <div style={{ padding: "0 1.5rem" }}>
                      <span style={{ fontSize: "0.6rem", opacity: 0.85 }}>AUTHORIZED SIGNATURE &amp; CVV</span>
                      <div style={{ background: "#f8fafc", padding: "0.45rem 0.75rem", borderRadius: "4px", textAlign: "right", marginTop: "0.25rem" }}>
                        <strong style={{ color: "#0f172a", fontFamily: "monospace", fontSize: "1rem", letterSpacing: "2px" }}>
                          {products.domProfile.cvv}
                        </strong>
                      </div>
                    </div>
                    <div style={{ padding: "0 1.5rem", fontSize: "0.6rem", opacity: 0.85 }}>
                      Ecobank USD Domiciliary Card • Tap to flip front
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}