// ============================================================================
// ECOCAMPUS INVESTMENT & WEALTH DESK — APP/(DASHBOARD)/INVESTMENTS/PAGE.TSX
// Professional Stock Exchange Investment leading with Ecobank Capital EDC Fund
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";
import { BottomNav } from "@/components/navigation/BottomNav";
import styles from "./investments.module.css";

interface StockListing {
  rank: number;
  ticker: string;
  name: string;
  exchange: string;
  category: "ecobank" | "banking" | "tech" | "industrial";
  priceNaira: number;
  changePercent: number;
  dividendYield: string;
  marketCap: string;
  isLeadEcobank?: boolean;
}

interface HoldingMap {
  [ticker: string]: number;
}

const STOCK_CATALOG: StockListing[] = [
  {
    rank: 1,
    ticker: "ETI",
    name: "Ecobank Transnational Inc.",
    exchange: "NGX / BRVM",
    category: "ecobank",
    priceNaira: 26.85,
    changePercent: +4.68,
    dividendYield: "6.4%",
    marketCap: "₦492.8B",
    isLeadEcobank: true,
  },
  {
    rank: 2,
    ticker: "GTCO",
    name: "Guaranty Trust Holding Co. PLC",
    exchange: "NGX",
    category: "banking",
    priceNaira: 48.20,
    changePercent: +2.15,
    dividendYield: "7.1%",
    marketCap: "₦1.42T",
  },
  {
    rank: 3,
    ticker: "ZENITHBANK",
    name: "Zenith Bank PLC",
    exchange: "NGX",
    category: "banking",
    priceNaira: 39.75,
    changePercent: +1.45,
    dividendYield: "8.2%",
    marketCap: "₦1.24T",
  },
  {
    rank: 4,
    ticker: "MTNN",
    name: "MTN Nigeria Communications PLC",
    exchange: "NGX",
    category: "tech",
    priceNaira: 218.50,
    changePercent: +1.92,
    dividendYield: "5.8%",
    marketCap: "₦4.58T",
  },
  {
    rank: 5,
    ticker: "DANGCEM",
    name: "Dangote Cement PLC",
    exchange: "NGX",
    category: "industrial",
    priceNaira: 590.00,
    changePercent: -0.42,
    dividendYield: "4.9%",
    marketCap: "₦10.05T",
  },
  {
    rank: 6,
    ticker: "ACCESSCORP",
    name: "Access Holdings PLC",
    exchange: "NGX",
    category: "banking",
    priceNaira: 22.40,
    changePercent: +3.11,
    dividendYield: "7.5%",
    marketCap: "₦796.2B",
  },
];

export default function InvestmentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [stocks, setStocks] = useState<StockListing[]>(STOCK_CATALOG);
  const [selectedStock, setSelectedStock] = useState<StockListing>(STOCK_CATALOG[0]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ECOBANK" | "BANKING" | "TECH" | "BLUE_CHIPS">("ALL");
  const [sharesToTrade, setSharesToTrade] = useState<string>("50");
  const [holdings, setHoldings] = useState<HoldingMap>({ ETI: 150 });
  const [edcFundBalanceNaira, setEdcFundBalanceNaira] = useState<number>(25000);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);

    const savedHoldings = localStorage.getItem(`ecocampus_invest_holdings_${active.id}`);
    if (savedHoldings) {
      try {
        setHoldings(JSON.parse(savedHoldings));
      } catch { /* use default */ }
    }

    const savedEdc = localStorage.getItem(`ecocampus_edc_fund_${active.id}`);
    if (savedEdc) {
      try {
        setEdcFundBalanceNaira(Number(savedEdc) || 25000);
      } catch { /* use default */ }
    }

    // Live micro-ticks for NGX stocks
    const interval = window.setInterval(() => {
      setStocks((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.47) * 0.2;
          const updatedPrice = Math.max(5, Math.round((s.priceNaira + delta) * 100) / 100);
          const updatedChange = Math.round((s.changePercent + delta * 0.15) * 100) / 100;
          return { ...s, priceNaira: updatedPrice, changePercent: updatedChange };
        })
      );
    }, 4500);

    return () => window.clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const fresh = stocks.find((s) => s.ticker === selectedStock.ticker);
    if (fresh) setSelectedStock(fresh);
  }, [stocks, selectedStock.ticker]);

  function playAlertSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch { /* AudioContext unsupported */ }
  }

  if (!user) return null;

  function saveHoldings(updated: HoldingMap) {
    setHoldings(updated);
    localStorage.setItem(`ecocampus_invest_holdings_${user!.id}`, JSON.stringify(updated));
  }

  // Calculate total portfolio
  const equitiesValuationNaira = stocks.reduce((sum, st) => {
    const qty = holdings[st.ticker] || 0;
    return sum + qty * st.priceNaira;
  }, 0);

  const totalWealthNaira = equitiesValuationNaira + edcFundBalanceNaira;

  function handleInvestInEdcFund() {
    const investAmountNaira = 5000;
    const investKobo = investAmountNaira * 100;

    if (user!.balanceKobo < investKobo) {
      setFeedback({
        type: "error",
        message: `Insufficient wallet balance. You need at least ₦5,000.00 to top up Ecobank Capital Fund.`,
      });
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx === -1) return;

    all[idx].balanceKobo -= investKobo;
    all[idx].transactions.unshift({
      id: `tx-edc-${Date.now()}`,
      reference: `EDC-FND-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "DEBIT",
      category: "TRANSFER",
      title: "Ecobank EDC Sovereign Fund Top-Up",
      counterpartyName: "Ecobank Asset Management",
      counterpartyAccount: "EDC-TREASURY-01",
      amountKobo: investKobo,
      status: "SUCCESSFUL",
      narration: "Fixed Income Fund @ 18.75% p.a.",
      createdAt: "Just now",
    });

    saveUsers(all);
    setUser({ ...all[idx] });

    const newEdcBal = edcFundBalanceNaira + investAmountNaira;
    setEdcFundBalanceNaira(newEdcBal);
    localStorage.setItem(`ecocampus_edc_fund_${user!.id}`, String(newEdcBal));

    playAlertSound();
    setFeedback({
      type: "success",
      message: `Successfully invested ₦5,000.00 in Ecobank EDC Sovereign Fund. Yield: 18.75% p.a.`,
    });
  }

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
        message: `Insufficient wallet balance. Required: ${formatKoboToNaira(totalCostKobo)}.`,
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
    setUser({ ...all[idx] });

    const nextHoldings = {
      ...holdings,
      [selectedStock.ticker]: (holdings[selectedStock.ticker] || 0) + qty,
    };
    saveHoldings(nextHoldings);

    playAlertSound();
    setFeedback({
      type: "success",
      message: `Executed: Bought ${qty} units of ${selectedStock.name} (${selectedStock.ticker}) for ${formatKoboToNaira(totalCostKobo)}.`,
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
    setUser({ ...all[idx] });

    const nextHoldings = {
      ...holdings,
      [selectedStock.ticker]: currentOwned - qty,
    };
    saveHoldings(nextHoldings);

    playAlertSound();
    setFeedback({
      type: "success",
      message: `Sold ${qty} shares of ${selectedStock.ticker}. ${formatKoboToNaira(proceedsKobo)} credited to your wallet.`,
    });
  }

  const filteredStocks = stocks.filter((s) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "ECOBANK") return s.category === "ecobank";
    if (activeFilter === "BANKING") return s.category === "banking" || s.category === "ecobank";
    if (activeFilter === "TECH") return s.category === "tech";
    if (activeFilter === "BLUE_CHIPS") return s.category === "industrial" || s.isLeadEcobank;
    return true;
  });

  return (
    <main className={styles.investContainer}>
      {/* Header */}
      <header className={styles.investHeader}>
        <Link href="/" className={styles.backBtn} aria-label="Back to dashboard">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 className={styles.headerTitle}>EcoInvest</h1>
        <div className={styles.marketStatusPill}>
          <span className={styles.pulseDot} />
          NGX LIVE
        </div>
      </header>

      {/* ── Responsive Dual-Column Investment Desk ── */}
      <div className={styles.investGrid}>
        {/* ── Left Column: Funds & Watchlist ── */}
        <div className={styles.investColPrimary}>
          {/* Primary Leading Element: Ecobank Capital Sovereign Fund */}
          <section className={styles.ecobankHeroCard} aria-label="Ecobank Capital Sovereign Fund">
        <div className={styles.ecobankCardTop}>
          <div className={styles.ecobankBadgeWrap}>
            <Image
              src="/brand/ecobank.png"
              alt="Ecobank Nigeria"
              width={88}
              height={26}
              style={{ width: "auto", height: "22px", objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
            <span className={styles.ecobankTag}>Featured #1</span>
          </div>
          <span style={{ fontSize: "0.68rem", color: "#a7f3d0", fontWeight: 700 }}>
            SEC &amp; CBN Regulated
          </span>
        </div>

        <h2 className={styles.fundTitle}>
          Ecobank Money Market Fund
        </h2>
        <p className={styles.fundSub}>
          Fixed-income treasury fund offering 18.75% annual yield.
        </p>

        <div className={styles.fundMetricsGrid}>
          <div className={styles.fundMetricItem}>
            <span className={styles.fundMetricLabel}>Annual Yield</span>
            <span className={styles.fundMetricVal} style={{ color: "#a7f3d0" }}>18.75%</span>
          </div>
          <div className={styles.fundMetricItem}>
            <span className={styles.fundMetricLabel}>Your Invested</span>
            <span className={styles.fundMetricVal}>₦{edcFundBalanceNaira.toLocaleString()}</span>
          </div>
          <div className={styles.fundMetricItem}>
            <span className={styles.fundMetricLabel}>Min. Entry</span>
            <span className={styles.fundMetricVal}>₦1,000</span>
          </div>
        </div>

        <div className={styles.fundActionRow}>
          <button
            type="button"
            className={styles.fundInvestBtn}
            onClick={handleInvestInEdcFund}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Invest ₦5,000 Now
          </button>
        </div>
      </section>

      {/* Portfolio Overview */}
      <section className={styles.portfolioCard}>
        <div className={styles.portfolioHeader}>
          <span className={styles.portfolioLabel}>Total Portfolio</span>
          <span className={styles.gainBadge}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +12.4% Overall
          </span>
        </div>

        <div className={styles.portfolioValue}>
          ₦{totalWealthNaira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <div className={styles.portfolioSubRow}>
          <span>Ecobank Fund: <strong>₦{edcFundBalanceNaira.toLocaleString()}</strong></span>
          <span>NGX Equities: <strong>₦{equitiesValuationNaira.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
        </div>
      </section>

      {/* NGX Equities Watchlist */}
      <section className={styles.marketSection}>
        <div className={styles.marketSectionHeader}>
          <h2 className={styles.marketSectionTitle}>Stocks (NGX)</h2>
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Select to trade</span>
        </div>

        {/* Filter Scroll */}
        <div className={styles.filterScroll} role="tablist">
          {[
            { id: "ALL", label: "All" },
            { id: "ECOBANK", label: "Ecobank" },
            { id: "BANKING", label: "Banking" },
            { id: "TECH", label: "Tech" },
            { id: "BLUE_CHIPS", label: "Blue Chips" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.filterChip} ${activeFilter === tab.id ? styles.filterChipActive : ""}`}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stock List */}
        <div className={styles.stockList}>
          {filteredStocks.map((st) => {
            const isSelected = selectedStock.ticker === st.ticker;
            const userUnits = holdings[st.ticker] || 0;
            return (
              <div
                key={st.ticker}
                onClick={() => {
                  setSelectedStock(st);
                  setFeedback(null);
                }}
                className={`${styles.stockCard} ${
                  isSelected ? styles.stockCardSelected : ""
                } ${st.isLeadEcobank ? styles.stockCardEcobank : ""}`}
              >
                <div className={styles.stockLeft}>
                  <div
                    className={`${styles.stockRankBadge} ${
                      st.isLeadEcobank ? styles.stockRankBadgeEcobank : ""
                    }`}
                  >
                    #{st.rank}
                  </div>
                  <div>
                    <div className={styles.stockTickerRow}>
                      <span className={styles.stockTicker}>{st.ticker}</span>
                      {st.isLeadEcobank && (
                        <span className={styles.stockLeadBadge}>#1 PICK</span>
                      )}
                      {userUnits > 0 && (
                        <span className={styles.stockHoldingBadge}>{userUnits} shs</span>
                      )}
                    </div>
                    <p className={styles.stockName}>
                      {st.name} &middot; Yield {st.dividendYield}
                    </p>
                  </div>
                </div>

                <div className={styles.stockRight}>
                  <div className={styles.stockPrice}>
                    ₦{st.priceNaira.toFixed(2)}
                  </div>
                  <div
                    className={`${styles.stockChange} ${
                      st.changePercent >= 0 ? styles.stockChangePositive : styles.stockChangeNegative
                    }`}
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
    </div>

    {/* ── Right Column: Sticky Order Ticket & Feedback ── */}
    <div className={styles.investColSecondary}>
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`${styles.feedbackBanner} ${
            feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError
          }`}
        >
          {feedback.type === "success" ? (
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {feedback.message}
        </div>
      )}

      {/* Instant Order Ticket */}
      <section className={styles.tradeCard}>
        <div className={styles.tradeCardHeader}>
          <div>
            <h3 className={styles.tradeTitle}>
              Trade {selectedStock.ticker}
            </h3>
            <p className={styles.tradeSub}>
              Owned: {holdings[selectedStock.ticker] || 0} shares &middot; Div: {selectedStock.dividendYield}
            </p>
          </div>
          {selectedStock.isLeadEcobank && (
            <span className={styles.stockLeadBadge}>ECOBANK LEAD</span>
          )}
        </div>

        <form onSubmit={handleBuyShares}>
          <div className={styles.tradeFormGroup}>
            <label className={styles.tradeLabel} htmlFor="sharesInput">
              Shares
            </label>
            <input
              id="sharesInput"
              type="number"
              min="1"
              max="100000"
              required
              className={styles.tradeInput}
              value={sharesToTrade}
              onChange={(e) => setSharesToTrade(e.target.value)}
            />
          </div>

          <div className={styles.tradeSummaryBox}>
            <span>Total:</span>
            <span className={styles.tradeSummaryVal}>
              ₦{(Number(sharesToTrade || 0) * selectedStock.priceNaira).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className={styles.tradeBtnGrid}>
            <button type="submit" className={styles.buyBtn}>
              Buy {selectedStock.ticker}
            </button>
            <button type="button" onClick={handleSellShares} className={styles.sellBtn}>
              Sell {selectedStock.ticker}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>

  {/* Persistent Bottom Navigation */}
  <BottomNav activeTab="invest" />
</main>
  );
}