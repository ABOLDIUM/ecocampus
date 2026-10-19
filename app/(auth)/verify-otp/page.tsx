"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../auth.module.css";

const MOCK_OTP = "123456";
const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  function handleChange(idx: number, val: string) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = char;
    setOtp(next);
    setError("");
    if (char && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const next = [...otp]; next[idx] = ""; setOtp(next);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleVerify() {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { setError("Please enter the complete 6-digit code."); return; }
    if (code !== MOCK_OTP) { setError("Incorrect OTP. Please check the code and try again. (Hint: use 123456)"); return; }
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    }, 800);
  }

  function handleResend() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setTimer(59);
    inputRefs.current[0]?.focus();
  }

  return (
    <div className={styles.authPage}>
      {/* Brand Panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandPanelGlow} />
        <div className={styles.brandPanelGlow2} />
        <div className={styles.brandNav}>
          <Link href="/register" className={styles.backToSite}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to register
          </Link>
        </div>
        <div className={styles.brandContent}>
          <div className={styles.brandLogoWrap}>
            <Image src="/brand/2.png" alt="EcoCampus" width={160} height={56} style={{ objectFit: "contain" }} />
          </div>
          <h2 className={styles.brandTagline}>
            One last step<br />to your<br /><span className={styles.brandTaglineAccent}>secure account.</span>
          </h2>
          <p className={styles.brandSubtext}>
            We sent a 6-digit verification code to your registered phone number. This confirms your identity and activates your account.
          </p>
          <div className={styles.brandPillars}>
            <div className={styles.brandPillar}>
              <div className={styles.brandPillarIcon} style={{ background: "rgba(0,230,118,0.1)" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div className={styles.brandPillarText}>
                <span className={styles.brandPillarTitle}>Two-Factor Security</span>
                <span className={styles.brandPillarSub}>OTP verification prevents unauthorised access</span>
              </div>
            </div>
            <div className={styles.brandPillar}>
              <div className={styles.brandPillarIcon} style={{ background: "rgba(0,230,118,0.1)" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div className={styles.brandPillarText}>
                <span className={styles.brandPillarTitle}>CBN Compliant KYC</span>
                <span className={styles.brandPillarSub}>Phone verification meets CBN Tier 1 requirements</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.brandFooterBadge}>
          <span className={styles.brandEcoLabel}>Powered by</span>
          <Image src="/brand/ecobank.png" alt="Ecobank" width={80} height={28} style={{ objectFit: "contain", filter: "brightness(0) invert(1) opacity(0.5)" }} />
        </div>
      </div>

      {/* Form Panel */}
      <div className={styles.formPanel}>
        <div className={`${styles.formCard} ${styles.fadeUp}`}>
          <div className={styles.formCardHeader}>
            <div style={{ width: 52, height: 52, background: "#E6FAF0", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.25rem" }}>
              <svg width="26" height="26" fill="none" stroke="#007749" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <h1 className={styles.formTitle}>Verify your phone</h1>
            <p className={styles.formSubtitle}>Enter the 6-digit code sent to your registered phone number. <strong>Demo code: 123456</strong></p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.successBox}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Phone verified! Redirecting to your dashboard...</span>
            </div>
          )}

          <div className={styles.formBody}>
            <div className={styles.otpRow} onPaste={handlePaste}>
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  id={`otp-cell-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className={`${styles.otpCell} ${val ? styles.otpCellFilled : ""}`}
                  aria-label={`OTP digit ${idx + 1}`}
                  autoComplete="one-time-code"
                  disabled={success}
                />
              ))}
            </div>

            <div className={styles.otpResend}>
              {timer > 0
                ? <span>Resend code in <strong>00:{String(timer).padStart(2, "0")}</strong></span>
                : <span>Didn&apos;t receive a code? <button className={styles.otpResendBtn} onClick={handleResend}>Resend OTP</button></span>
              }
            </div>

            <button className={styles.submitBtn} onClick={handleVerify} disabled={loading || success} id="otp-verify-btn">
              {loading
                ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" /></path></svg> Verifying...</>
                : "Verify & Activate Account"
              }
            </button>
          </div>

          <p className={styles.formFooter}>
            <Link href="/login">Already verified? Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
