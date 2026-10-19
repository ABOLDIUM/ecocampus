"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUsers, updateUserPassword } from "@/lib/database/user-store";
import styles from "../auth.module.css";

type RecoveryStep = "REQUEST" | "OTP" | "RESET" | "SUCCESS";

const MOCK_OTP = "123456";
const OTP_LENGTH = 6;

function BrandPanel() {
  return (
    <div className={styles.brandPanel}>
      <div className={styles.brandPanelGlow} />
      <div className={styles.brandPanelGlow2} />
      <div className={styles.brandNav}>
        <Link href="/login" className={styles.backToSite}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sign In
        </Link>
      </div>
      <div className={styles.brandContent}>
        <div className={styles.brandLogoWrap}>
          <Image src="/brand/2.png" alt="EcoCampus" width={160} height={56} style={{ objectFit: "contain" }} />
        </div>
        <h2 className={styles.brandTagline}>
          Account Security &amp;<br />
          <span className={styles.brandTaglineAccent}>Safe Recovery.</span>
        </h2>
        <p className={styles.brandSubtext}>
          We safeguard your finances with multi-factor authentication and bank-grade encryption certified by Ecobank Nigeria.
        </p>
        <div className={styles.brandPillars}>
          <div className={styles.brandPillar}>
            <div className={styles.brandPillarIcon} style={{ background: "rgba(0,230,118,0.1)" }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className={styles.brandPillarText}>
              <span className={styles.brandPillarTitle}>Encrypted Recovery</span>
              <span className={styles.brandPillarSub}>One-time passcode sent directly to your device</span>
            </div>
          </div>
          <div className={styles.brandPillar}>
            <div className={styles.brandPillarIcon} style={{ background: "rgba(0,230,118,0.1)" }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className={styles.brandPillarText}>
              <span className={styles.brandPillarTitle}>Zero Unauthorized Takeovers</span>
              <span className={styles.brandPillarSub}>Strict CBN-mandated identity verification</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.brandFooterBadge}>
        <span className={styles.brandEcoLabel}>Powered by</span>
        <Image
          src="/brand/ecobank.png"
          alt="Ecobank"
          width={80}
          height={28}
          style={{ objectFit: "contain", filter: "brightness(0) invert(1) opacity(0.5)" }}
        />
      </div>
    </div>
  );
}

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>("REQUEST");

  // Step 1: Request
  const [identifier, setIdentifier] = useState("");

  // Step 2: OTP
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3: Reset
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (step !== "OTP" || timer <= 0) return;
    const interval = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(interval);
  }, [step, timer]);

  // Step 1 Submission
  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Please enter your registered email address or phone number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("OTP");
      setTimer(59);
    }, 600);
  }

  // Step 2 OTP Handlers
  function handleOtpChange(idx: number, val: string) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = char;
    setOtp(next);
    setError("");
    if (char && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleOtpKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => {
      next[i] = c;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    if (code !== MOCK_OTP) {
      setError("Incorrect code. Please check and try again. (Hint: use 123456)");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("RESET");
    }, 600);
  }

  function handleResendOtp() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setTimer(59);
    inputRefs.current[0]?.focus();
  }

  // Step 3 Password Reset
  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Attempt to update in store if user exists
      updateUserPassword(identifier, newPassword);
      setLoading(false);
      setStep("SUCCESS");
    }, 700);
  }

  return (
    <div className={styles.authPage}>
      <BrandPanel />
      <div className={styles.formPanel}>
        <div className={`${styles.formCard} ${styles.fadeUp}`}>
          {/* STEP 1: REQUEST */}
          {step === "REQUEST" && (
            <>
              <div className={styles.formCardHeader}>
                <h1 className={styles.formTitle}>Forgot Password?</h1>
                <p className={styles.formSubtitle}>
                  Enter your registered email address or phone number and we will send you a 6-digit verification code.
                </p>
              </div>

              {error && (
                <div className={styles.errorBox}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequest} className={styles.formBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="recover-identifier">
                    Email or Phone Number
                  </label>
                  <input
                    id="recover-identifier"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="name@university.edu.ng or 08012345678"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading} id="recover-send-btn">
                  {loading ? (
                    <>
                      <span className={styles.spinner} />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Recovery Code
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className={styles.formCardFooter}>
                Remember your password?{" "}
                <Link href="/login" className={styles.footerLink}>
                  Sign in
                </Link>
              </div>
            </>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === "OTP" && (
            <>
              <div className={styles.formCardHeader}>
                <h1 className={styles.formTitle}>Enter Verification Code</h1>
                <p className={styles.formSubtitle}>
                  We sent a 6-digit code to <strong>{identifier}</strong>. Enter it below to proceed. (Use: <strong>123456</strong>)
                </p>
              </div>

              {error && (
                <div className={styles.errorBox}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className={styles.formBody}>
                <div className={styles.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      className={`${styles.otpCell} ${digit ? styles.otpCellFilled : ""}`}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className={styles.otpResend}>
                  {timer > 0 ? (
                    <span>Resend code in <strong>{timer}s</strong></span>
                  ) : (
                    <button type="button" className={styles.otpResendBtn} onClick={handleResendOtp}>
                      Resend code
                    </button>
                  )}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading} id="recover-verify-btn">
                  {loading ? (
                    <>
                      <span className={styles.spinner} />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
              </form>

              <div className={styles.formCardFooter}>
                Wrong contact info?{" "}
                <button
                  type="button"
                  onClick={() => setStep("REQUEST")}
                  style={{ background: "none", border: "none", color: "#007749", fontWeight: 700, cursor: "pointer", padding: 0 }}
                >
                  Change
                </button>
              </div>
            </>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === "RESET" && (
            <>
              <div className={styles.formCardHeader}>
                <h1 className={styles.formTitle}>Set New Password</h1>
                <p className={styles.formSubtitle}>Choose a strong password to protect your EcoCampus account.</p>
              </div>

              {error && (
                <div className={styles.errorBox}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className={styles.formBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="new-password">New Password</label>
                  <div className={styles.inputWrap}>
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`${styles.input} ${styles.inputWithIcon}`}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.inputIconBtn}
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="confirm-password">Confirm New Password</label>
                  <div className={styles.inputWrap}>
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      required
                      className={`${styles.input} ${styles.inputWithIcon}`}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.inputIconBtn}
                      onClick={() => setShowConfirm((p) => !p)}
                      aria-label="Toggle password visibility"
                    >
                      {showConfirm ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Criteria checklist */}
                <div style={{ background: "#F1F5F9", borderRadius: "0.75rem", padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.75rem", color: "#475569" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: newPassword.length >= 8 ? "#00C853" : "#64748B" }}>
                    <span>{newPassword.length >= 8 ? "✓" : "○"}</span> At least 8 characters
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: newPassword && newPassword === confirmPassword ? "#00C853" : "#64748B" }}>
                    <span>{newPassword && newPassword === confirmPassword ? "✓" : "○"}</span> Passwords match
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading} id="recover-submit-btn">
                  {loading ? (
                    <>
                      <span className={styles.spinner} />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "SUCCESS" && (
            <div style={{ textAlign: "center", padding: "2rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(0, 200, 83, 0.12)",
                  color: "#00C853",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0A1628", margin: "0 0 0.5rem" }}>
                  Password Reset Complete!
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#64748B", maxWidth: "340px", margin: 0, lineHeight: 1.6 }}>
                  Your password has been successfully updated. You can now log in to your EcoCampus account with your new credentials.
                </p>
              </div>

              <Link
                href="/login"
                className={styles.submitBtn}
                style={{ textDecoration: "none", textAlign: "center", display: "inline-flex", justifyContent: "center" }}
                id="recover-login-btn"
              >
                Sign In Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
