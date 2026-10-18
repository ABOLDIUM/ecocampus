// ============================================================================
// ECOCAMPUS LIVE STOCK EXCHANGE INVESTMENT MODULE — APP/(DASHBOARD)/INVESTMENTS/PAGE.TSX
// Live NGX Equities Desk with Ecobank Transnational Inc. (ETI) Ranked #1
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import styles from "../transfers/transfer.module.css";

interface StockListing {
  rank: number;
  ticker: string;
  name: string;
  exchange: string;
  priceNaira: number;
  changePercent: number;
  dividendYield: string;
  marketCap: string;
  isFeaturedEcobank?: boolean;
}

interface HoldingMap {
  [ticker: string]: number; // number of shares held
}

const INITIAL_STOCKS: StockListing[] = [
  {
    rank: 1,
    ticker: "ETI",
    name: "Ecobank Transnational Inc.",
    exchange: "NGX / BRVM",
    priceNaira: 26.85,
    changePercent: +4.68,
    dividendYield: "6.4%",
    marketCap: "₦492.8B",
    isFeaturedEcobank: true,
  },
  {
    rank: 2,
    ticker: "MTNN",
    name: "MTN Nigeria Communications PLC",
    exchange: "NGX",
    priceNaira: 218.5,
    changePercent: +1.92,
    dividendYield: "5.8%",
    marketCap: "₦4.58T",
  },
  {
    rank: 3,
    ticker: "GTCO",
    name: "Guaranty Trust Holding Co. PLC",
    exchange: "NGX",
    priceNaira: 48.2,
    changePercent: +2.15,
    dividendYield: "7.1%",
    marketCap: "₦1.42T",
  },
  {
    rank: 4,
    ticker: "ZENITHBANK",
    name: "Zenith Bank PLC",
    exchange: "NGX",
    priceNaira: 39.75,
    changePercent: +1.45,
    dividendYield: "8.2%",
    marketCap: "₦1.24T",
  },
  {
    rank: 5,
    ticker: "DANGCEM",
    name: "Dangote Cement PLC",
    exchange: "NGX",
    priceNaira: 590.0,
    changePercent: -0.42,
    dividendYield: "4.9%",
    marketCap: "₦10.05T",
  },
  {
    rank: 6,
    ticker: "ACCESSCORP",
    name: "Access Holdings PLC",
    exchange: "NGX",
    priceNaira: 22.4,
    changePercent: +3.11,
    dividendYield: "7.5%",
    marketCap: "₦796.2B",
  },
];

export default function StockInvestmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [stocks, setStocks] = useState<StockListing[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<StockListing>(INITIAL_STOCKS[0]);
  const [sharesToTrade, setSharesToTrade] = useState<string>("50");
  const [holdings, setHoldings] = useState<HoldingMap>({ ETI: 120 }); // Pre-seeded with 120 Ecobank shares
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);

    const savedHoldings = localStorage.getItem(`ecocampus_ngx_holdings_${active.id}`);
    if (savedHoldings) {
      try {
        setHoldings(JSON.parse(savedHoldings));
      } catch {
        // Use default
      }
    }

    // Simulate live NGX orderbook micro-ticks every 4 seconds
    const tickerInterval = window.setInterval(() => {
      setStocks((prev) =>
        prev.map((st) => {
          const delta = (Math.random() - 0.46) * 0.25;
          const updatedPrice = Math.max(5, Math.round((st.priceNaira + delta) * 100) / 100);
          const updatedChange = Math.round((st.changePercent + delta * 0.2) * 100) / 100;
          return { ...st, priceNaira: updatedPrice, changePercent: updatedChange };
        })
      );
    }, 4000);

    return () => window.clearInterval(tickerInterval);
  }, [router]);

  useEffect(() => {
    const current = stocks.find((s) => s.ticker === selectedStock.ticker);
    if (current) setSelectedStock(current);
  }, [stocks, selectedStock.ticker]);

  if (!user) return null;

  function saveHoldingsMap(updated: HoldingMap) {
    setHoldings(updated);
    localStorage.setItem(`ecocampus_ngx_holdings_${user!.id}`, JSON.stringify(updated));
  }

  const totalPortfolioNaira = stocks.reduce((sum, st) => {
    const qty = holdings[st.ticker] || 0;
    return sum + qty * st.priceNaira;
  }, 0);

  function handleBuyShares(e: React.FormEvent) {
    e.preventDefault();
    const qty = Math.floor(Number(sharesToTrade));
    if (isNaN(qty) || qty <= 0) {
      setFeedback({ type: "error", message: "Enter a valid number of shares to purchase." });
      return;
    }

    const totalCostNaira = qty * selectedStock.priceNaira;
    const totalCostKobo = Math.round(totalCostNaira * 100);

    if (user!.balanceKobo < totalCostKobo) {
      setFeedback({
        type: "error",
        message: `Insufficient Naira wallet balance. Required: ${formatKoboToNaira(totalCostKobo)}.`,
      });
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    all[idx].balanceKobo -= totalCostKobo;
    all[idx].transactions.unshift({
      id: `tx-stk-buy-${Date.now()}`,
      reference: `NGX-BUY-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "DEBIT",
      category: "TRANSFER",
      title: `Bought ${qty} Shares of ${selectedStock.ticker}`,
      counterpartyName: "NGX / CSCS Clearing House",
      counterpartyAccount: selectedStock.ticker,
      amountKobo: totalCostKobo,
      status: "SUCCESSFUL",
      narration: `${qty} units @ ₦${selectedStock.priceNaira.toFixed(2)}`,
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser(all[idx]);

    const nextHoldings = {
      ...holdings,
      [selectedStock.ticker]: (holdings[selectedStock.ticker] || 0) + qty,
    };
    saveHoldingsMap(nextHoldings);

    setFeedback({
      type: "success",
      message: `Order Executed: Bought ${qty} shares of ${selectedStock.name} (${selectedStock.ticker}) for ${formatKoboToNaira(totalCostKobo)}.`,
    });
  }

  function handleSellShares() {
    const qty = Math.floor(Number(sharesToTrade));
    const currentOwned = holdings[selectedStock.ticker] || 0;

    if (isNaN(qty) || qty <= 0 || qty > currentOwned) {
      setFeedback({
        type: "error",
        message: `You currently own ${currentOwned} shares of ${selectedStock.ticker}.`,
      });
      return;
    }

    const proceedsKobo = Math.round(qty * selectedStock.priceNaira * 100);
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    all[idx].balanceKobo += proceedsKobo;
    all[idx].transactions.unshift({
      id: `tx-stk-sell-${Date.now()}`,
      reference: `NGX-SEL-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "CREDIT",
      category: "DEPOSIT",
      title: `Sold ${qty} Shares of ${selectedStock.ticker}`,
      counterpartyName: "NGX / CSCS Settlement",
      counterpartyAccount: selectedStock.ticker,
      amountKobo: proceedsKobo,
      status: "SUCCESSFUL",
      narration: `Sale @ ₦${selectedStock.priceNaira.toFixed(2)}`,
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser(all[idx]);

    const nextHoldings = {
      ...holdings,
      [selectedStock.ticker]: currentOwned - qty,
    };
    saveHoldingsMap(nextHoldings);

    setFeedback({
      type: "success",
      message: `Sold ${qty} shares of ${selectedStock.ticker}. ${formatKoboToNaira(proceedsKobo)} credited to your wallet.`,
    });
  }

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
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
          Stock Exchange Investment
        </h1>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            color: "#059669",
            background: "#ecfdf5",
            padding: "0.2rem 0.5rem",
            borderRadius: "999px",
          }}
        >
          ● NGX LIVE
        </span>
      </header>

      {/* Portfolio Valuation Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #033121 0%, #007749 100%)",
          borderRadius: "1.25rem",
          padding: "1.35rem",
          color: "#ffffff",
          marginBottom: "1.15rem",
          boxShadow: "0 12px 26px rgba(0, 119, 73, 0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.85 }}>
            CSCS Equities Portfolio Value
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a7f3d0" }}>
            Cash: {formatKoboToNaira(user.balanceKobo)}
          </span>
        </div>
        <div style={{ fontSize: "1.7rem", fontWeight: 900, fontFamily: "monospace", marginBottom: "0.5rem" }}>
          ₦{totalPortfolioNaira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: "0.74rem", opacity: 0.9, display: "flex", justifyContent: "space-between" }}>
          <span>Ecobank (ETI) Shares Held: <strong>{holdings["ETI"] || 0} Units</strong></span>
          <span style={{ color: "#a7f3d0", fontWeight: 700 }}>SEC / NGX Regulated</span>
        </div>
      </div>

      {/* Live Stock Exchange List (#1 Ecobank ETI) */}
      <section style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
          <h2 style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Top Listed Equities (NGX / Pan-African)
          </h2>
          <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}>Tap stock to trade</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {stocks.map((st) => {
            const isSelected = selectedStock.ticker === st.ticker;
            const userUnits = holdings[st.ticker] || 0;
            return (
              <div
                key={st.ticker}
                onClick={() => {
                  setSelectedStock(st);
                  setFeedback(null);
                }}
                style={{
                  background: st.isFeaturedEcobank
                    ? "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)"
                    : "#ffffff",
                  border: isSelected
                    ? "2px solid #007749"
                    : st.isFeaturedEcobank
                    ? "1.5px solid #6ee7b7"
                    : "1px solid #e2e8f0",
                  borderRadius: "0.95rem",
                  padding: "0.85rem 1rem",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: st.isFeaturedEcobank ? "#007749" : "#0f172a",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "0.75rem",
                    }}
                  >
                    #{st.rank}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <strong style={{ fontSize: "0.86rem", color: "#0f172a" }}>{st.ticker}</strong>
                      {st.isFeaturedEcobank && (
                        <span
                          style={{
                            background: "#007749",
                            color: "#ffffff",
                            fontSize: "0.58rem",
                            fontWeight: 800,
                            padding: "0.1rem 0.45rem",
                            borderRadius: "999px",
                          }}
                        >
                          #1 TOP PICK
                        </span>
                      )}
                      {userUnits > 0 && (
                        <span
                          style={{
                            background: "#e0f2fe",
                            color: "#0369a1",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            padding: "0.1rem 0.4rem",
                            borderRadius: "4px",
                          }}
                        >
                          {userUnits} shs
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: "0.73rem", color: "#475569" }}>
                      {st.name} • Yield {st.dividendYield}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 900, fontSize: "0.9rem", color: "#0f172a", fontFamily: "monospace" }}>
                    ₦{st.priceNaira.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: st.changePercent >= 0 ? "#059669" : "#dc2626",
                    }}
                  >
                    {st.changePercent >= 0 ? "▲ +" : "▼ "}
                    {st.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instant Order Execution Ticket */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.25rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div>
            <h3 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Trade {selectedStock.name} ({selectedStock.ticker})
            </h3>
            <p style={{ fontSize: "0.72rem", color: "#64748b", margin: 0 }}>
              Market Cap: {selectedStock.marketCap} • Owned: {holdings[selectedStock.ticker] || 0} shares
            </p>
          </div>
          {selectedStock.isFeaturedEcobank && (
            <Image src="/brand/ecobank.png" alt="Ecobank" width={80} height={26} style={{ width: "auto", height: "24px", objectFit: "contain" }} />
          )}
        </div>

        <form onSubmit={handleBuyShares}>
          <div className={styles.formGroup} style={{ marginBottom: "0.75rem" }}>
            <label className={styles.formLabel}>Number of Shares (Units)</label>
            <input
              type="number"
              min="1"
              max="100000"
              required
              className={styles.formInput}
              value={sharesToTrade}
              onChange={(e) => setSharesToTrade(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              color: "#334155",
              marginBottom: "0.9rem",
              background: "#f8fafc",
              padding: "0.65rem 0.85rem",
              borderRadius: "0.65rem",
            }}
          >
            <span>Estimated Order Value:</span>
            <strong>
              ₦{(Number(sharesToTrade || 0) * selectedStock.priceNaira).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          {feedback && (
            <div
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: "0.75rem",
                fontSize: "0.76rem",
                fontWeight: 700,
                marginBottom: "0.85rem",
                background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: feedback.type === "success" ? "#065f46" : "#b91c1c",
                border: `1px solid ${feedback.type === "success" ? "#10b981" : "#f87171"}`,
              }}
            >
              {feedback.message}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#007749",
                color: "#ffffff",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                fontWeight: 800,
                fontSize: "0.8rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Buy {selectedStock.ticker} Shares
            </button>
            <button
              type="button"
              onClick={handleSellShares}
              style={{
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                fontWeight: 800,
                fontSize: "0.8rem",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
              }}
            >
              Sell Shares
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}