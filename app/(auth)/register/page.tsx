"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { registerNewUser } from "@/lib/database/user-store";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"DETAILS" | "TERMS" | "ANIMATING">("DETAILS");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState("");

  function handleInitialSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !phone || !dob || !nin || !password) {
      setError("Please fill in all required standard financial fields including NIN.");
      return;
    }
    if (nin.length !== 11) {
      setError("National Identification Number (NIN) must be exactly 11 digits.");
      return;
    }
    setError("");
    setStep("TERMS");
  }

  function handleFinalRegistration() {
    if (!termsAgreed) {
      setError("You must accept the terms and conditions to proceed.");
      return;
    }

    setStep("ANIMATING");

    setTimeout(() => {
      const names = fullName.trim().split(" ");
      const firstName = names[0] || "User";

      registerNewUser({
        fullName,
        firstName,
        email: email.toLowerCase(),
        phone,
        dateOfBirth: dob,
        nin,
        bvn: bvn ? bvn : undefined,
        password,
      });

      router.push("/");
    }, 1800);
  }

  if (step === "ANIMATING") {
    return (
      <main className={styles.authViewport}>
        <div style={{ textAlign: "center", color: "#ffffff" }}>
          <div style={{ transform: "scale(1.1)", marginBottom: "1.5rem" }}>
            <BrandLogo variant="icon" showMotto={true} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>Initializing Secure Vault...</h2>
          <p style={{ fontSize: "0.82rem", opacity: 0.85 }}>Establishing encrypted session &amp; provisioning account</p>
          <div style={{ width: "180px", height: "4px", background: "rgba(255,255,255,0.2)", margin: "1.5rem auto 0", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "#10b981", animation: "loadingSlide 1.2s ease-in-out infinite alternate" }} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.authViewport}>
      <div className={styles.authCard}>
        <div className={styles.brandHeader}>
          <BrandLogo variant="full" showMotto={true} />
          <h1 className={styles.title}>
            {step === "DETAILS" ? "Create Account" : "Terms & Conditions"}
          </h1>
          <p className={styles.subtitle}>
            {step === "DETAILS" ? "Standard financial onboarding & verification" : "Please review and accept our platform policies"}
          </p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {step === "DETAILS" ? (
          <form onSubmit={handleInitialSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="e.g. Ajugu Boluwatife David"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  required
                  className={styles.input}
                  placeholder="08030000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="name@university.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  required
                  className={styles.input}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>NIN (11 Digits)</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  className={styles.input}
                  placeholder="Enter 11-digit NIN"
                  value={nin}
                  onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>BVN (Optional)</label>
              <input
                type="text"
                maxLength={11}
                className={styles.input}
                placeholder="Enter 11-digit BVN (Optional)"
                value={bvn}
                onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className={styles.input}
                  style={{ paddingRight: "2.5rem" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Continue to Terms &amp; Conditions
            </button>
          </form>
        ) : (
          <div>
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "0.75rem", padding: "1rem", maxHeight: "200px", overflowY: "auto", fontSize: "0.78rem", color: "#334155", marginBottom: "1rem", lineHeight: 1.5 }}>
              <p style={{ fontWeight: 700, marginBottom: "0.4rem" }}>EcoCampus Terms &amp; Conditions</p>
              <p style={{ marginBottom: "0.4rem" }}>1. <strong>General Services:</strong> EcoCampus provides youth and tertiary student financial technology services, savings, and peer-to-peer transfers.</p>
              <p style={{ marginBottom: "0.4rem" }}>2. <strong>Loan Verification:</strong> Student loans and Corp Member financing require separate institutional verification (Federal/State university matriculation records or valid NYSC state codes) and BVN verification during credit application.</p>
              <p>3. <strong>Data Security:</strong> Your NIN and personal data are encrypted and handled in accordance with NDPR regulations.</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#059669", cursor: "pointer" }}
              />
              <label htmlFor="terms" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", cursor: "pointer" }}>
                I agree to the Terms and Conditions
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setStep("DETAILS")}
                style={{ padding: "0.85rem", border: "1px solid #cbd5e1", borderRadius: "0.75rem", background: "#ffffff", fontWeight: 700, cursor: "pointer", color: "#475569" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalRegistration}
                className={styles.submitBtn}
                style={{ marginTop: 0 }}
              >
                Agree &amp; Open Account
              </button>
            </div>
          </div>
        )}

        {step === "DETAILS" && (
          <p className={styles.footerLink}>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        )}
      </div>
    </main>
  );
}