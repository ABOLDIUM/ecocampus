"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUsers, setActiveUser } from "@/lib/database/user-store";
import styles from "../auth.module.css";

// ── Brand Left Panel ────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className={styles.brandPanel}>
      <div className={styles.brandPanelGlow} />
      <div className={styles.brandPanelGlow2} />
      <div className={styles.brandNav}>
        <Link href="/landing" className={styles.backToSite}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to site
        </Link>
      </div>
      <div className={styles.brandContent}>
        <div className={styles.brandLogoWrap}>
          <Image src="/brand/2.png" alt="EcoCampus" width={160} height={56} style={{ objectFit: "contain" }} />
        </div>
        <h2 className={styles.brandTagline}>
          Your campus.<br />
          <span className={styles.brandTaglineAccent}>Your finances.</span><br />
          Your future.
        </h2>
        <p className={styles.brandSubtext}>
          The only platform that combines zero-interest student loans, secure campus commerce, and career fast-tracks — all in one place.
        </p>
      </div>
      <div className={styles.brandFooterBadge}>
        <span className={styles.brandEcoLabel}>Powered by</span>
        <Image src="/brand/ecobank.png" alt="Ecobank" width={80} height={28} style={{ objectFit: "contain", filter: "brightness(0) invert(1) opacity(0.5)" }} />
      </div>
    </div>
  );
}

// ── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fillDemo() {
    setEmail("ajugu.david@ecocampus.ng");
    setPassword("ecocampus123");
    setError("");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const q = email.trim().toLowerCase();
      const cleanQ = q.replace(/[\s\-\+]/g, "");

      const found = users.find(u =>
        u.email.toLowerCase() === q ||
        u.accountNumber === email.trim() ||
        (u.phone && u.phone.replace(/[\s\-\+]/g, "") === cleanQ)
      );

      if (!found) {
        setError("Account not found. Please check your email/account number or register below.");
        setLoading(false);
        return;
      }

      const passMatch = found.password
        ? found.password === password
        : (password === "ecocampus123" || password.length >= 6);

      if (!passMatch) {
        setError("Incorrect password. Please verify your password or use 'Forgot password'.");
        setLoading(false);
        return;
      }

      setActiveUser(found.id);
      router.push("/");
    }, 600);
  }

  return (
    <div className={styles.authPage}>
      <BrandPanel />
      <div className={styles.formPanel}>
        <div className={`${styles.formCard} ${styles.fadeUp}`}>
          <div className={styles.formCardHeader}>
            <h1 className={styles.formTitle}>Welcome back</h1>
            <p className={styles.formSubtitle}>Sign in to your EcoCampus financial dashboard</p>
          </div>

          {/* Quick Demo Pill */}
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "0.75rem", padding: "0.6rem 0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#166534", lineHeight: 1.4 }}>
              <strong>Demo:</strong> ajugu.david@ecocampus.ng &middot; <code>ecocampus123</code>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              style={{ background: "#00C853", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "0.25rem 0.65rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Auto-fill
            </button>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.formBody}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="login-email">Email or Account Number</label>
              <input
                id="login-email"
                type="text"
                required
                autoComplete="email"
                className={styles.input}
                placeholder="name@university.edu.ng or 2420347201"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.formFooterRow}>
                <label className={styles.label} htmlFor="login-password">Password</label>
                <Link href="/recover-password" className={styles.forgotLink}>Forgot password?</Link>
              </div>
              <div className={styles.inputWrap}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className={styles.inputIconBtn} onClick={() => setShowPassword(p => !p)} aria-label="Toggle password visibility">
                  {showPassword
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading} id="login-submit-btn">
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" /></path></svg>
                  Signing In...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p className={styles.formFooter}>
            Don&apos;t have an account?{" "}
            <Link href="/register">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
