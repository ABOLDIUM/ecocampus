// ============================================================================
// ECOCAMPUS MASTER FINANCING & LOAN ENGINE — APP/(DASHBOARD)/LOANS/PAGE.TSX
// Flagship Sprint 2 Overhaul | Zero-Interest 200L+ Undergrad & NYSC Advance
// Executive Presentation for ADEBANKE Oladejo, VICTOR Yalokwu, BABAWALE John
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import {
  getActiveUser,
  getUsers,
  saveUsers,
  disburseStudentLoan,
  disburseNyscLoan,
  repayActiveLoan,
  EcoUser,
  ActiveLoan,
} from "@/lib/database/user-store";
import styles from "./loans.module.css";

export default function LoansMasterPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);

  // Active tab: "student" | "nysc"
  const [activeTab, setActiveTab] = useState<"student" | "nysc">("student");

  // Student loan state
  const [studentAmount, setStudentAmount] = useState<number>(100000);
  const [studentPurpose, setStudentPurpose] = useState<string>("Tuition & Laboratory Fees");
  const [disbursementMethod, setDisbursementMethod] = useState<"BURSARY" | "DIRECT_WALLET">("BURSARY");
  const [matricNumber, setMatricNumber] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [institution, setInstitution] = useState<string>("University of Abuja");

  // NYSC loan state
  const [nyscAmount, setNyscAmount] = useState<number>(150000);
  const [nyscTenure, setNyscTenure] = useState<number>(6);
  const [nyscStateCode, setNyscStateCode] = useState<string>("FC/26A/4821");
  const [nyscPurpose, setNyscPurpose] = useState<string>("Workstation Laptop for Tech PPA");
  const [stateOfDeployment, setStateOfDeployment] = useState<string>("Abuja (FCT)");

  // Modals & simulation
  const [isGsiModalOpen, setIsGsiModalOpen] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [disbursementStage, setDisbursementStage] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");
  const [currentStageText, setCurrentStageText] = useState<string>("");
  const [disbursedResult, setDisbursedResult] = useState<{ reference: string; amountKobo: number } | null>(null);
  const [repayFeedback, setRepayFeedback] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
    if (active.customerId) setMatricNumber(active.customerId);
    if (active.courseOfStudy) setDepartment(active.courseOfStudy);
    if (active.institutionName) setInstitution(active.institutionName);
    if (active.nyscStateCode) setNyscStateCode(active.nyscStateCode);
  }, [router]);

  if (!user) return null;

  // NYSC monthly deduction calculated from ₦33k allowance
  const nyscTotalRepay = nyscAmount + Math.round(nyscAmount * 0.035);
  const nyscMonthlyDeduction = Math.round(nyscTotalRepay / nyscTenure);
  const nyscAllowanceRemaining = 33000 - nyscMonthlyDeduction;

  // Student monthly calculation (6 months 0% interest)
  const studentMonthly = Math.round(studentAmount / 6);

  // Trigger GSI Mandate Flow
  function handleInitiateLoan() {
    setIsGsiModalOpen(true);
    setSignature(user?.fullName || "Ajugu Boluwatife David");
  }

  // Execute Core Banking Disbursement Simulation
  function handleConfirmGsiAndDisburse() {
    setIsSigning(true);
    const gsiRef = `NIBSS-GSI-ECO-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      setIsGsiModalOpen(false);
      setIsSigning(false);
      setDisbursementStage("PROCESSING");
      setCurrentStageText("Validating Institutional Identity & JAMB / NYSC Database...");

      setTimeout(() => {
        setCurrentStageText("Registering GSI Direct Debit Mandate with NIBSS...");

        setTimeout(() => {
          setCurrentStageText("Ecobank OmniCore 24-hr Liquidity Disbursement Approved...");

          setTimeout(() => {
            if (activeTab === "student") {
              const res = disburseStudentLoan(user!.id, {
                amountNaira: studentAmount,
                purpose: studentPurpose,
                institution,
                matricNumber: matricNumber || "UNIABUJA/2024/472",
                department: department || "Medicine and Surgery",
                disbursementMethod,
                bursaryAccount: `${institution} Consolidated Bursary`,
                gsiMandateRef: gsiRef,
              });
              if (res.ok && res.loan) {
                setDisbursedResult({ reference: res.reference!, amountKobo: res.loan.principalKobo });
                const updated = getActiveUser();
                setUser(updated);
              }
            } else {
              const res = disburseNyscLoan(user!.id, {
                amountNaira: nyscAmount,
                purpose: nyscPurpose,
                nyscCode: nyscStateCode,
                stateOfDeployment,
                tenureMonths: nyscTenure,
                gsiMandateRef: gsiRef,
              });
              if (res.ok && res.loan) {
                setDisbursedResult({ reference: res.reference!, amountKobo: res.loan.principalKobo });
                const updated = getActiveUser();
                setUser(updated);
              }
            }
            setDisbursementStage("SUCCESS");
          }, 1000);
        }, 1200);
      }, 1200);
    }, 800);
  }

  // Handle active loan partial/full repayment
  function handleRepayment() {
    if (!user?.activeLoan) return;
    const amountToRepay = Math.min(user.activeLoan.remainingKobo, user.activeLoan.monthlyDeductionKobo);
    const res = repayActiveLoan(user.id, amountToRepay);
    if (res.ok) {
      setRepayFeedback(`Repayment of ${formatKoboToNaira(amountToRepay)} processed via GSI simulated mandate!`);
      const updated = getActiveUser();
      setUser(updated);
      setTimeout(() => setRepayFeedback(null), 4000);
    } else {
      setRepayFeedback(res.error || "Repayment failed");
    }
  }

  return (
    <main className={styles.container}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <a href="/" className={styles.backBtn}>
          <span>&larr;</span> Dashboard
        </a>
        <h1 className={styles.headerTitle}>EcoCampus Credit</h1>
        <div className={styles.cbnBadge}>
          <span>🛡️</span> CBN & NIBSS GSI
        </div>
      </header>

      {/* ── Active Loan Card (if exists) ─────────────────────────────────── */}
      {user.activeLoan && user.activeLoan.status === "ACTIVE" && (
        <section className={styles.activeLoanCard}>
          <div className={styles.activeLoanHeader}>
            <span className={styles.activeLoanTag}>
              {user.activeLoan.type === "STUDENT_ZERO_INTEREST" ? "🎓 Active Student Loan" : "🇳🇬 Active NYSC Advance"}
            </span>
            <span className={styles.activeLoanRef}>Ref: {user.activeLoan.reference}</span>
          </div>
          <div className={styles.activeLoanAmounts}>
            <div>
              <div className={styles.activeLoanBalTitle}>Remaining Balance</div>
              <div className={styles.activeLoanBalVal}>
                {formatKoboToNaira(user.activeLoan.remainingKobo)}
              </div>
            </div>
            <div className={styles.activeLoanNextDue}>
              Next Auto-Deduction<br />
              <strong>{user.activeLoan.nextDeductionDate}</strong>
            </div>
          </div>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.85rem" }}>
            Mandate: <span style={{ color: "#00E676", fontFamily: "monospace" }}>{user.activeLoan.gsiMandateRef}</span> · Destination: {user.activeLoan.destinationAccount}
          </div>
          {repayFeedback && (
            <div style={{ background: "rgba(0,230,118,0.15)", border: "1px solid #00E676", color: "#00E676", padding: "0.5rem", borderRadius: "8px", fontSize: "0.75rem", marginBottom: "0.75rem", textAlign: "center" }}>
              {repayFeedback}
            </div>
          )}
          <button className={styles.repayBtn} onClick={handleRepayment}>
            Make Simulated Monthly Repayment ({formatKoboToNaira(user.activeLoan.monthlyDeductionKobo)})
          </button>
        </section>
      )}

      {/* ── Strategic Comparison Hero: EcoCampus vs NELFUND ──────────────── */}
      <section className={styles.heroComparison}>
        <div className={styles.heroBadgeRow}>
          <span className={styles.heroTag}>Ecobank Innovation</span>
          <div className={styles.heroSpeed}>
            Disbursement: <strong>24–48 Hours</strong>
          </div>
        </div>
        <h2 className={styles.heroTitle}>Zero-Interest Tertiary Financing Built for Speed</h2>
        <p className={styles.heroSub}>
          NELFUND takes months of bureaucratic red-tape. EcoCampus delivers zero-interest direct bursary and living finance within 48 hours, fully secured with CBN Global Standing Instructions.
        </p>

        <div className={styles.comparisonGrid}>
          <div className={`${styles.compCol} ${styles.compColEco}`}>
            <span className={styles.compColTitle}>✨ EcoCampus</span>
            <span className={styles.compItem}>⚡ 24–48hr Direct Bursary</span>
            <span className={styles.compItem}>🎓 0.0% APR for 200L+</span>
            <span className={styles.compItem}>🔒 NIBSS GSI Automated</span>
            <span className={styles.compItem}>💻 Hardware & Corper Loans</span>
          </div>
          <div className={`${styles.compCol} ${styles.compColNel}`}>
            <span className={styles.compColTitle}>❌ Traditional / NELFUND</span>
            <span className={`${styles.compItem} ${styles.compItem.dim}`}>⏳ 3–6 Months Wait Time</span>
            <span className={`${styles.compItem} ${styles.compItem.dim}`}>📄 Tedious Paperwork</span>
            <span className={`${styles.compItem} ${styles.compItem.dim}`}>🚫 Tuition Only</span>
            <span className={`${styles.compItem} ${styles.compItem.dim}`}>⚠️ High Default Risk</span>
          </div>
        </div>
      </section>

      {/* ── Campus Score Live Breakdown (Algorithmic Underwriting) ────────── */}
      <section className={styles.scoreCard}>
        <div className={styles.scoreHeader}>
          <div className={styles.scoreHeading}>
            <span>📊</span> Campus Credit Score Engine
          </div>
          <span className={styles.scoreBadgeTier}>Tier 1 • Prime Eligible</span>
        </div>

        <div className={styles.scoreVisualRow}>
          <div className={styles.scoreGauge}>
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r="36" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke="url(#greenGlow)"
                strokeWidth="8"
                strokeDasharray="226"
                strokeDashoffset="63"
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
              />
              <defs>
                <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C853" />
                  <stop offset="100%" stopColor="#00E676" />
                </linearGradient>
              </defs>
            </svg>
            <div className={styles.scoreGaugeNumber}>
              <div className={styles.scoreNumberVal}>{user.campusScore || 720}</div>
              <div className={styles.scoreNumberMax}>/ 1000</div>
            </div>
          </div>

          <div className={styles.scoreStatsCol}>
            <div className={styles.scoreStatItem}>
              <span className={styles.scoreStatLabel}>Underwriting Limit</span>
              <span className={styles.scoreStatVal}>₦250,000.00</span>
            </div>
            <div className={styles.scoreStatItem}>
              <span className={styles.scoreStatLabel}>Academic Standing</span>
              <span className={styles.scoreStatVal}>CGPA 4.25 (MBBS)</span>
            </div>
            <div className={styles.scoreStatItem}>
              <span className={styles.scoreStatLabel}>Recovery Safeguard</span>
              <span className={styles.scoreStatVal}>GSI Active</span>
            </div>
          </div>
        </div>

        <div className={styles.scoreBreakdownDetails}>
          <div className={styles.breakdownBarRow}>
            <div className={styles.breakdownLabelRow}>
              <span className={styles.breakdownName}>Academic Performance & 200L+ Status (35%)</span>
              <span className={styles.breakdownPts}>285 / 350 pts</span>
            </div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: "81%" }} />
            </div>
          </div>

          <div className={styles.breakdownBarRow}>
            <div className={styles.breakdownLabelRow}>
              <span className={styles.breakdownName}>Daily Streak & Balance Discipline (25%)</span>
              <span className={styles.breakdownPts}>195 / 250 pts</span>
            </div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: "78%" }} />
            </div>
          </div>

          <div className={styles.breakdownBarRow}>
            <div className={styles.breakdownLabelRow}>
              <span className={styles.breakdownName}>Identity & Institutional Biometrics (25%)</span>
              <span className={styles.breakdownPts}>210 / 250 pts</span>
            </div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: "84%" }} />
            </div>
          </div>

          <div className={styles.breakdownBarRow}>
            <div className={styles.breakdownLabelRow}>
              <span className={styles.breakdownName}>Campus Marketplace History (15%)</span>
              <span className={styles.breakdownPts}>110 / 150 pts</span>
            </div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: "73%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Facility Selector Tabs ───────────────────────────────────────── */}
      <div className={styles.tabRow}>
        <button
          className={`${styles.tabBtn} ${activeTab === "student" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("student")}
        >
          <span>🎓</span> 200L+ Undergrad (0% APR)
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "nysc" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("nysc")}
        >
          <span>🇳🇬</span> NYSC Corper Advance
        </button>
      </div>

      {/* ── Loan Calculator & Application Box ────────────────────────────── */}
      {disbursementStage === "IDLE" && (
        <section className={styles.calcCard}>
          {activeTab === "student" ? (
            <>
              <h3 className={styles.calcCardTitle}>Zero-Interest Undergraduate Facility</h3>
              <p className={styles.calcCardSub}>
                Strictly for 200L+ students in accredited tertiary institutions. Direct bursary settlement protects funds against diversion.
              </p>

              {/* Amount Slider */}
              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span className={styles.sliderLabel}>Financing Amount</span>
                  <span className={styles.sliderAmountVal}>₦{studentAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="5000"
                  value={studentAmount}
                  onChange={(e) => setStudentAmount(Number(e.target.value))}
                  className={styles.sliderInput}
                />
                <div className={styles.sliderRangeLabels}>
                  <span>Min: ₦20,000</span>
                  <span>Max Limit: ₦250,000</span>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className={styles.metricsStrip}>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Interest Rate</span>
                  <span className={`${styles.metricValue} ${styles.metricZeroInterest}`}>0.0% APR</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Processing Fee</span>
                  <span className={`${styles.metricValue} ${styles.metricZeroInterest}`}>₦0.00 Free</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Repayment</span>
                  <span className={styles.metricValue}>₦{studentMonthly.toLocaleString()}/mo</span>
                </div>
              </div>

              {/* Disbursement Destination Options */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Disbursement Destination</label>
                <div className={styles.disbursementOptionRow}>
                  <div
                    className={`${styles.disburseOptionCard} ${disbursementMethod === "BURSARY" ? styles.disburseOptionCardActive : ""}`}
                    onClick={() => setDisbursementMethod("BURSARY")}
                  >
                    <div className={styles.disburseOptTitle}>
                      <span>🏫</span> Direct Bursary
                    </div>
                    <div className={styles.disburseOptSub}>
                      Paid straight to {institution} Bursary Account. Zero diversion risk.
                    </div>
                  </div>
                  <div
                    className={`${styles.disburseOptionCard} ${disbursementMethod === "DIRECT_WALLET" ? styles.disburseOptionCardActive : ""}`}
                    onClick={() => setDisbursementMethod("DIRECT_WALLET")}
                  >
                    <div className={styles.disburseOptTitle}>
                      <span>💳</span> Student Wallet
                    </div>
                    <div className={styles.disburseOptSub}>
                      Credited directly into your Ecobank account for books & lab gear.
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Institution & Department</label>
                <input
                  type="text"
                  value={`${institution} — ${department || "MBBS Medicine"}`}
                  disabled
                  className={styles.formInput}
                  style={{ background: "#F1F5F9", color: "#64748B" }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Matriculation / Student ID</label>
                <input
                  type="text"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  placeholder="e.g. UNIABUJA/2024/472"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Financing Purpose</label>
                <select
                  value={studentPurpose}
                  onChange={(e) => setStudentPurpose(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="Tuition & Laboratory Fees">Tuition & School Charges</option>
                  <option value="Final Year Project / Research Equipment">Final Year Research & Project</option>
                  <option value="Clinical Rotations & Medical Kits">Medical / Nursing Clinical Kits</option>
                  <option value="Engineering Tooling & Software Licenses">Tech / Engineering Tooling</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.calcCardTitle}>NYSC Corper Equipment & Entrepreneur Advance</h3>
              <p className={styles.calcCardSub}>
                Subsidized credit for corps members. Repayment is automatically split from your Federal ₦33,000 monthly allowance via NIBSS.
              </p>

              {/* Amount Slider */}
              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span className={styles.sliderLabel}>Advance Amount</span>
                  <span className={styles.sliderAmountVal}>₦{nyscAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="10000"
                  value={nyscAmount}
                  onChange={(e) => setNyscAmount(Number(e.target.value))}
                  className={styles.sliderInput}
                />
                <div className={styles.sliderRangeLabels}>
                  <span>Min: ₦50,000</span>
                  <span>Max: ₦500,000</span>
                </div>
              </div>

              {/* Split Deduction Metrics */}
              <div className={styles.metricsStrip}>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Subsidized Fee</span>
                  <span className={styles.metricValue}>3.5% Flat</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Monthly Split</span>
                  <span className={styles.metricValue}>₦{nyscMonthlyDeduction.toLocaleString()}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Allowance Left</span>
                  <span className={`${styles.metricValue} ${styles.metricZeroInterest}`}>
                    ₦{Math.max(0, nyscAllowanceRemaining).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              {/* Form Inputs */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>NYSC State Code</label>
                <input
                  type="text"
                  value={nyscStateCode}
                  onChange={(e) => setNyscStateCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FC/26A/4821"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Place of Deployment / PPA</label>
                <input
                  type="text"
                  value={stateOfDeployment}
                  onChange={(e) => setStateOfDeployment(e.target.value)}
                  placeholder="e.g. Abuja (FCT) — Ministry of Innovation"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Financing Purpose</label>
                <select
                  value={nyscPurpose}
                  onChange={(e) => setNyscPurpose(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="Workstation Laptop for Tech PPA">Workstation Laptop (Remote PPA)</option>
                  <option value="Small Business Kickstart (Fashion/Food)">SME / Enterprise Setup</option>
                  <option value="Professional Certification & Exam Voucher">ACCA / AWS / Google Certification</option>
                  <option value="Relocation & PPA Housing Deposit">PPA Housing Deposit</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tenure Duration</label>
                <select
                  value={nyscTenure}
                  onChange={(e) => setNyscTenure(Number(e.target.value))}
                  className={styles.formSelect}
                >
                  <option value={3}>3 Months (Fast Clear)</option>
                  <option value={6}>6 Months (Recommended)</option>
                  <option value={9}>9 Months (Low Monthly Split)</option>
                </select>
              </div>
            </>
          )}

          {/* GSI Callout Banner */}
          <div className={styles.gsiCallout}>
            <div className={styles.gsiIcon}>🏛️</div>
            <div className={styles.gsiText}>
              <strong>CBN GSI (Global Standing Instruction) Protection:</strong> By proceeding, you will execute a legally binding GSI direct debit mandate registered on the NIBSS central switch. This guarantees zero non-performing loan risk for Ecobank.
            </div>
          </div>

          <button className={styles.ctaBtn} onClick={handleInitiateLoan}>
            <span>Proceed to GSI Mandate Signing &rarr;</span>
          </button>
        </section>
      )}

      {/* ── Live Core Banking Disbursement Animation State ───────────────── */}
      {disbursementStage === "PROCESSING" && (
        <section className={styles.calcCard} style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
          <div className={styles.spinnerCircle} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#001F3F", marginBottom: "0.5rem" }}>
            Processing Ecobank Core Banking Disbursement
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#64748B", maxWidth: "340px", margin: "0 auto" }}>
            {currentStageText}
          </p>
          <div style={{ marginTop: "1.5rem", display: "inline-block", background: "#F1F5F9", padding: "0.4rem 0.8rem", borderRadius: "999px", fontSize: "0.72rem", color: "#007749", fontWeight: 700 }}>
            🔒 256-bit NIBSS Encrypted Gateway
          </div>
        </section>
      )}

      {/* ── Success State Screen ─────────────────────────────────────────── */}
      {disbursementStage === "SUCCESS" && disbursedResult && (
        <section className={styles.calcCard} style={{ textAlign: "center", padding: "2rem 1.25rem" }}>
          <div className={styles.successIcon}>✓</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#001F3F", marginBottom: "0.25rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Disbursement Successful!
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#64748B", marginBottom: "1.25rem" }}>
            {activeTab === "student" && disbursementMethod === "BURSARY"
              ? `₦${(disbursedResult.amountKobo / 100).toLocaleString()} has been disbursed directly into the ${institution} Bursary account.`
              : `₦${(disbursedResult.amountKobo / 100).toLocaleString()} has been credited to your Ecobank account.`}
          </p>

          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1rem", textAlign: "left", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "#64748B" }}>Transaction Ref</span>
              <span style={{ fontWeight: 800, fontFamily: "monospace" }}>{disbursedResult.reference}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "#64748B" }}>GSI Mandate ID</span>
              <span style={{ fontWeight: 800, color: "#00C853", fontFamily: "monospace" }}>{user.gsiMandateRef || "NIBSS-GSI-774921"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
              <span style={{ color: "#64748B" }}>First Repayment Due</span>
              <span style={{ fontWeight: 800, color: "#001F3F" }}>15th Next Month</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => {
                setDisbursementStage("IDLE");
                router.push("/");
              }}
              className={styles.ctaBtn}
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setDisbursementStage("IDLE")}
              style={{
                flex: 1,
                background: "white",
                border: "1.5px solid #CBD5E1",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#334155",
                cursor: "pointer",
              }}
            >
              New Application
            </button>
          </div>
        </section>
      )}

      {/* ── Interactive GSI Mandate Modal ─────────────────────────────────── */}
      {isGsiModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>NIBSS GSI Mandate Authorization</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsGsiModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.76rem", color: "#64748B", marginBottom: "0.75rem" }}>
              In accordance with Central Bank of Nigeria (CBN) regulations on Global Standing Instructions (GSI), this mandate permits automated recovery from any linked Nigerian bank account should default occur.
            </p>

            <div className={styles.mandateBox}>
              <strong>GSI RECOVERY CLAUSE & COMMITMENT:</strong><br />
              I, <strong>{user.fullName}</strong> (BVN Verified), hereby authorize Ecobank Nigeria PLC and the Nigeria Inter-Bank Settlement System (NIBSS) to execute automated debit instructions on my account <strong>{user.accountNumber}</strong> or any account linked to my BVN across all commercial and microfinance banks in Nigeria for the sum of <strong>₦{(activeTab === "student" ? studentAmount : nyscTotalRepay).toLocaleString()}</strong> upon maturity.
            </div>

            <div className={styles.nibssBadgeRow}>
              <span>🏛️ CBN Circular: BSD/DIR/GEN/LAB/13/053</span>
              <span style={{ color: "#059669", fontWeight: 800 }}>NIBSS Verified</span>
            </div>

            <div style={{ marginBottom: "0.5rem", fontSize: "0.74rem", fontWeight: 700, color: "#334155" }}>
              Digital Signature Authorization
            </div>

            <div
              className={`${styles.signaturePadArea} ${signature ? styles.signaturePadAreaSigned : ""}`}
              onClick={() => setSignature(user.fullName)}
            >
              {signature ? (
                <div style={{ textAlign: "center" }}>
                  <div className={styles.sigText}>{signature}</div>
                  <div style={{ fontSize: "0.65rem", color: "#059669", fontWeight: 700, marginTop: "0.2rem" }}>
                    ✓ Biometrically Bound Digital Stamp ({new Date().toLocaleDateString()})
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                  Click here to sign digitally
                </span>
              )}
            </div>

            <button
              className={styles.ctaBtn}
              disabled={isSigning || !signature}
              onClick={handleConfirmGsiAndDisburse}
            >
              {isSigning ? "Signing Mandate via NIBSS Switch..." : "Authorize Mandate & Disburse Loan"}
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <nav className={styles.bottomNav} aria-label="Main navigation">
        <a href="/" className={styles.bottomNavItem}>
          <span style={{ fontSize: "1.1rem" }}>🏠</span>
          <span>Home</span>
        </a>
        <a href="/marketplace" className={styles.bottomNavItem}>
          <span style={{ fontSize: "1.1rem" }}>🛍️</span>
          <span>Market</span>
        </a>
        <a href="/opportunities" className={styles.bottomNavItem}>
          <span style={{ fontSize: "1.1rem" }}>💼</span>
          <span>Opportunities</span>
        </a>
        <a href="/loans" className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
          <span style={{ fontSize: "1.1rem" }}>🎓</span>
          <span>Loans</span>
        </a>
        <button
          type="button"
          className={styles.bottomNavItem}
          onClick={() => {
            localStorage.removeItem("ecocampus_active_user_id_v5");
            router.push("/login");
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </main>
  );
}