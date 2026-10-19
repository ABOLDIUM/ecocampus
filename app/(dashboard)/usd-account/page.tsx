// ============================================================================
// ECOCAMPUS USD DOMICILIARY ACCOUNT & VIRTUAL CARD — APP/(DASHBOARD)/USD-ACCOUNT/PAGE.TSX
// Stylistic Minimal Domiciliary Details, Hero USD Virtual Card & Wise-Style Conversion
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
import { BottomNav } from "@/components/navigation/BottomNav";
import styles from "./usd-account.module.css";

interface FxRateData {
  source: string;
  cbnMidRate: number;
  ecobankRate: number;
  updatedAt: string;
}

function playSuccessChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  } catch {}
}

export default function UsdDomiciliaryAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [products, setProducts] = useState<UserBankingProducts | null>(null);
  const [usdNetworkChoice, setUsdNetworkChoice] = useState<CardNetwork>("VISA");
  const [isUsdCardFlipped, setIsUsdCardFlipped] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // FX state
  const [fxData, setFxData] = useState<FxRateData>({
    source: "Ecobank Live FX Desk",
    cbnMidRate: 1585.5,
    ecobankRate: 1598.0,
    updatedAt: new Date().toISOString(),
  });
  const [loadingFx, setLoadingFx] = useState(false);

  // Conversion inputs (two-way sync)
  const [usdAmount, setUsdAmount] = useState("20");
  const [nairaAmount, setNairaAmount] = useState((20 * 1598).toString());
  const [isConverting, setIsConverting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);

    let loaded = getUserBankingProducts(active);
    // Auto-open domiciliary account if not open so the user has immediate access
    if (!loaded.domProfile.hasDomAccount) {
      loaded = openUsdDomiciliaryAccount(active);
    }
    setProducts(loaded);
    setUsdNetworkChoice(loaded.domProfile.usdCardNetwork || "VISA");

    fetchLiveExchangeRate();
  }, [router]);

  async function fetchLiveExchangeRate() {
    setLoadingFx(true);
    try {
      const res = await fetch("/api/fx-rate");
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success" && data.ecobankRate) {
          setFxData({
            source: data.source || "Ecobank Live FX Desk",
            cbnMidRate: data.cbnMidRate || 1585.5,
            ecobankRate: data.ecobankRate,
            updatedAt: data.updatedAt,
          });
          // Update corresponding naira equivalent
          const u = Number(usdAmount) || 20;
          setNairaAmount(Math.round(u * data.ecobankRate).toString());
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoadingFx(false);
    }
  }

  if (!user || !products) return null;

  function handleUsdChange(val: string) {
    setUsdAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setNairaAmount(Math.round(num * fxData.ecobankRate).toString());
    } else {
      setNairaAmount("");
    }
  }

  function handleNairaChange(val: string) {
    setNairaAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && fxData.ecobankRate > 0) {
      setUsdAmount((num / fxData.ecobankRate).toFixed(2));
    } else {
      setUsdAmount("");
    }
  }

  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(text.replace(/\s+/g, ""));
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  }

  function handleIssueUsdCard() {
    const updated = createUsdVirtualCard(user!, usdNetworkChoice);
    setProducts({ ...updated });
    playSuccessChime();
    setFeedback({
      type: "success",
      message: `Ecobank ${usdNetworkChoice} USD Virtual Card activated successfully!`,
    });
    setTimeout(() => setFeedback(null), 5000);
  }

  function handleConvertAndFund(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const targetUsd = parseFloat(usdAmount);
    if (isNaN(targetUsd) || targetUsd < 1) {
      setFeedback({ type: "error", message: "Minimum conversion is $1.00." });
      return;
    }

    const requiredNaira = targetUsd * fxData.ecobankRate;
    const requiredKobo = Math.round(requiredNaira * 100);

    if (user!.balanceKobo < requiredKobo) {
      setFeedback({
        type: "error",
        message: `Insufficient Naira balance. You need ${formatKoboToNaira(requiredKobo)} for $${targetUsd.toFixed(2)}.`,
      });
      return;
    }

    setIsConverting(true);

    setTimeout(() => {
      const allUsers = getUsers();
      const idx = allUsers.findIndex((u) => u.id === user!.id);
      if (idx === -1) {
        setIsConverting(false);
        return;
      }

      const addedCents = Math.round(targetUsd * 100);
      allUsers[idx].balanceKobo -= requiredKobo;
      allUsers[idx].usdBalanceCents = (allUsers[idx].usdBalanceCents || 0) + addedCents;

      const ref = `ECO-FX-${Math.floor(100000 + Math.random() * 900000)}`;
      allUsers[idx].transactions.unshift({
        id: `tx-fx-${Date.now()}`,
        reference: ref,
        type: "DEBIT",
        category: "TRANSFER",
        title: `USD Domiciliary Funding ($${targetUsd.toFixed(2)})`,
        counterpartyName: "Ecobank Domiciliary Desk",
        counterpartyAccount: products!.domProfile.domAccountNumber,
        amountKobo: requiredKobo,
        status: "SUCCESSFUL",
        narration: `FX Conversion @ ₦${fxData.ecobankRate.toLocaleString()}/$1`,
        createdAt: "Just now",
      });

      saveUsers(allUsers);
      setUser(allUsers[idx]);

      const updatedProducts = getUserBankingProducts(allUsers[idx]);
      updatedProducts.domProfile.usdBalanceCents = allUsers[idx].usdBalanceCents;
      saveUserBankingProducts(user!.id, updatedProducts);
      setProducts({ ...updatedProducts });

      setIsConverting(false);
      playSuccessChime();
      setFeedback({
        type: "success",
        message: `Successfully converted ${formatKoboToNaira(requiredKobo)} to $${targetUsd.toFixed(2)} USD!`,
      });
      setTimeout(() => setFeedback(null), 5000);
    }, 750);
  }

  const hasCard = products.domProfile.hasUsdCard;

  return (
    <main className={styles.container}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <a href="/" className={styles.backBtn}>
          <span>&larr;</span> Dashboard
        </a>
        <h1 className={styles.headerTitle}>USD Account & Card</h1>
        <div className={styles.cbnBadge}>
          <span>CBN Licensed</span>
        </div>
      </header>

      {/* ── Feedback Notification ──────────────────────────────────────── */}
      {feedback && (
        <div
          className={`${styles.toastAlert} ${feedback.type === "success" ? styles.toastSuccess : styles.toastError}`}
          role="status"
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Responsive Dual-Column USD Account & FX Desk ── */}
      <div className={styles.usdGrid}>
        {/* ── Left Column: USD Details & Virtual Card ── */}
        <div className={styles.usdColPrimary}>
          {/* ── Stylistic Minimal USD Account Details Strip ─────────────────── */}
          <section className={styles.minimalAccountStrip}>
            <div className={styles.acctBalanceCol}>
              <span className={styles.acctBalanceLabel}>USD Balance</span>
              <span className={styles.acctBalanceValue}>
                {formatCentsToUsd(user.usdBalanceCents)}
              </span>
            </div>

            <div className={styles.acctDetailsCol}>
              <button
                type="button"
                className={styles.acctNumberBadge}
                onClick={() => handleCopy(products.domProfile.domAccountNumber, "acct")}
                title="Click to copy USD account number"
              >
                <span>{products.domProfile.domAccountNumber}</span>
                <span style={{ fontSize: "0.65rem", color: "#007749" }}>
                  {copiedText === "acct" ? "Copied" : "Copy"}
                </span>
              </button>
              <span className={styles.swiftCode}>SWIFT: {products.domProfile.routingSwift || "ECOCNGLA"}</span>
            </div>
          </section>

          {/* ── PRIMARY HERO ELEMENT: USD Virtual Card ──────────────────────── */}
          <section className={styles.cardHeroSection}>
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardSectionTitle}>USD Virtual Card</span>
              {hasCard && (
                <button
                  type="button"
                  className={styles.cardFlipHint}
                  onClick={() => setIsUsdCardFlipped((p) => !p)}
                >
                  {isUsdCardFlipped ? "Show Front" : "Tap to Flip for CVV"}
                </button>
              )}
            </div>

            {hasCard ? (
              <div
                className={styles.cardPerspective}
                onClick={() => setIsUsdCardFlipped((p) => !p)}
                role="button"
                tabIndex={0}
                aria-label="USD Card. Click to flip front and back."
              >
                <div className={`${styles.cardInner} ${isUsdCardFlipped ? styles.cardFlipped : ""}`}>
                  {/* CARD FRONT */}
                  <div className={styles.cardFront}>
                    <div className={styles.cardTopRow}>
                      <div className={styles.cardChip}>
                        <Image
                          src="/brand/ecocampus-logo.png"
                          alt="EcoCampus"
                          width={18}
                          height={18}
                          style={{ objectFit: "contain" }}
                        />
                        <span>EcoCampus USD</span>
                      </div>
                      {!imgError ? (
                        <Image
                          src="/brand/ecobank.png"
                          alt="Ecobank"
                          width={110}
                          height={32}
                          style={{ width: "auto", height: "30px", objectFit: "contain" }}
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <span style={{ fontWeight: 900, fontStyle: "italic" }}>Ecobank</span>
                      )}
                    </div>

                    <div className={styles.cardNumberDisplay}>
                      {products.domProfile.usdCardNumber}
                    </div>

                    <div className={styles.cardBottomRow}>
                      <div>
                        <div className={styles.cardExpiry}>
                          EXPIRES {products.domProfile.expiryDate || "11/29"} • TAP FOR CVV
                        </div>
                        <p className={styles.cardHolderName}>{user.fullName.toUpperCase()}</p>
                      </div>
                      <span className={styles.cardNetworkPill}>
                        {products.domProfile.usdCardNetwork || "VISA"}
                      </span>
                    </div>
                  </div>

                  {/* CARD BACK */}
                  <div className={styles.cardBack}>
                    <div className={styles.magStripe} />
                    <div className={styles.cvvContainer}>
                      <span className={styles.cvvLabel}>Security Code (CVV)</span>
                      <div className={styles.cvvBox}>
                        <span className={styles.cvvValue}>{products.domProfile.cvv || "412"}</span>
                      </div>
                    </div>
                    <div className={styles.cardBackFooter}>
                      Ecobank Global Virtual Card • Tap card to flip back
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Issue Card Card if not yet issued */
              <div className={styles.issueCardPrompt}>
                <p style={{ fontSize: "0.82rem", color: "#475569", margin: "0 0 0.75rem 0", lineHeight: 1.45 }}>
                  Generate your USD virtual debit card instantly to pay for international exams, Spotify, Coursera, and tech tools.
                </p>
                <div className={styles.networkSelectorRow}>
                  {(["VISA", "MASTERCARD"] as CardNetwork[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setUsdNetworkChoice(net)}
                      className={`${styles.networkSelectBtn} ${usdNetworkChoice === net ? styles.networkSelectActive : ""}`}
                    >
                      {net} USD
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleIssueUsdCard}
                  className={styles.activateCardBtn}
                >
                  Activate {usdNetworkChoice} USD Card &rarr;
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Right Column: FX Conversion Desk ── */}
        <div className={styles.usdColSecondary}>
          {/* ── SIMPLIFIED CONVERSION SECTION (Wise / Revolut Style) ────────── */}
          <section className={styles.conversionCard}>
            <div className={styles.conversionHeader}>
              <span className={styles.conversionTitle}>Convert & Fund USD</span>
              <div className={styles.rateBadge}>
                <span>$1.00 = ₦{fxData.ecobankRate.toLocaleString()}</span>
                <button
                  type="button"
                  onClick={fetchLiveExchangeRate}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#007749", padding: 0, fontSize: "0.75rem" }}
                  title="Refresh live rate"
                >
                  {loadingFx ? "..." : "↻"}
                </button>
              </div>
            </div>

            <form onSubmit={handleConvertAndFund}>
              <div className={styles.swapContainer}>
                {/* You Pay (Naira) */}
                <div className={styles.currencyBox}>
                  <div className={styles.currencyTopRow}>
                    <span className={styles.currencyLabel}>You pay</span>
                    <span className={styles.currencyBalanceHint}>
                      Balance: {formatKoboToNaira(user.balanceKobo)}
                    </span>
                  </div>
                  <div className={styles.currencyInputRow}>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      required
                      value={nairaAmount}
                      onChange={(e) => handleNairaChange(e.target.value)}
                      className={styles.currencyInput}
                      placeholder="0.00"
                    />
                    <div className={styles.currencyPill}>
                      <span style={{ fontSize: "0.9rem" }}>🇳🇬</span>
                      <span>NGN</span>
                    </div>
                  </div>
                </div>

                {/* Swap Divider */}
                <div className={styles.swapDivider}>
                  <div className={styles.swapIconBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 10l5 5 5-5" />
                      <path d="M12 15V3" />
                    </svg>
                  </div>
                </div>

                {/* You Receive (USD) */}
                <div className={styles.currencyBox}>
                  <div className={styles.currencyTopRow}>
                    <span className={styles.currencyLabel}>You receive</span>
                    <span className={styles.currencyBalanceHint}>
                      Zero conversion fee
                    </span>
                  </div>
                  <div className={styles.currencyInputRow}>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      required
                      value={usdAmount}
                      onChange={(e) => handleUsdChange(e.target.value)}
                      className={styles.currencyInput}
                      placeholder="0.00"
                    />
                    <div className={styles.currencyPill}>
                      <span style={{ fontSize: "0.9rem" }}>🇺🇸</span>
                      <span>USD</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isConverting}
                className={styles.convertSubmitBtn}
              >
                {isConverting ? (
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.55rem" }}>
                    <span className={styles.spinner} />
                    Converting via Ecobank FX Desk...
                  </span>
                ) : (
                  <>Convert &amp; Fund USD Account &rarr;</>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* ── Bottom Navigation ──────────────────────────────────────────── */}
      <BottomNav />
    </main>
  );
}