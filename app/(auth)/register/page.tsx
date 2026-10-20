"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { registerNewUser } from "@/lib/database/user-store";
import styles from "../auth.module.css";

type Step = "PERSONAL" | "IDENTITY" | "PASSWORD" | "TERMS" | "ANIMATING";

const STEPS: { id: Step; label: string }[] = [
  { id: "PERSONAL", label: "Personal" },
  { id: "IDENTITY", label: "Identity" },
  { id: "PASSWORD", label: "Password" },
  { id: "TERMS",    label: "Terms"    },
];

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
          Join <span className={styles.brandTaglineAccent}>47,000+</span><br />students already<br />on EcoCampus.
        </h2>
        <p className={styles.brandSubtext}>Create your account in under 3 minutes. Zero interest loans, fraud-proof marketplace, and career opportunities await.</p>
      </div>
      <div className={styles.brandFooterBadge}>
        <span className={styles.brandEcoLabel}>Powered by</span>
        <div className={styles.brandEcoLogoWrap}>
          <Image
            src="/brand/ecobank.png"
            alt="Ecobank"
            width={78}
            height={24}
            style={{ objectFit: "contain", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex(s => s.id === current);
  return (
    <div>
      <div className={styles.stepIndicator}>
        {STEPS.map((s, idx) => {
          const done   = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <React.Fragment key={s.id}>
              <div className={`${styles.stepDot} ${active ? styles.stepDotActive : ""} ${done ? styles.stepDotDone : ""}`}>
                {done
                  ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : idx + 1
                }
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`${styles.stepLine} ${done ? styles.stepLineDone : ""}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
        {STEPS.map((s, idx) => {
          const active = idx === currentIdx;
          return <span key={s.id} className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ""}`}>{s.label}</span>;
        })}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("PERSONAL");

  const [fullName,     setFullName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [dob,          setDob]          = useState("");
  const [nin,          setNin]          = useState("");
  const [bvn,          setBvn]          = useState("");
  const [password,     setPassword]     = useState("");
  const [confirmPass,  setConfirmPass]  = useState("");
  const [showPass,     setShowPass]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [termsAgreed,  setTermsAgreed]  = useState(false);
  const [error,        setError]        = useState("");

  const stepTitles: Record<Step, { title: string; sub: string }> = {
    PERSONAL:   { title: "Create your account",             sub: "Enter your personal details to get started" },
    IDENTITY:   { title: "Identity verification",            sub: "Required for CBN KYC compliance" },
    PASSWORD:   { title: "Secure your account",              sub: "Create a strong password" },
    TERMS:      { title: "Terms & Conditions",               sub: "Please read and accept to proceed" },
    ANIMATING:  { title: "",                                  sub: "" },
  };

  function validatePersonal() {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim() || !email.includes("@")) return "A valid email address is required.";
    if (!phone.trim() || phone.length < 10) return "A valid Nigerian phone number is required.";
    if (!dob) return "Date of birth is required.";
    return "";
  }

  function validateIdentity() {
    if (!nin || nin.length !== 11) return "NIN must be exactly 11 digits.";
    if (bvn && bvn.length !== 11) return "BVN must be exactly 11 digits if provided.";
    return "";
  }

  function validatePassword() {
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPass) return "Passwords do not match.";
    return "";
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (step === "PERSONAL") {
      const err = validatePersonal();
      if (err) { setError(err); return; }
      setStep("IDENTITY");
    } else if (step === "IDENTITY") {
      const err = validateIdentity();
      if (err) { setError(err); return; }
      setStep("PASSWORD");
    } else if (step === "PASSWORD") {
      const err = validatePassword();
      if (err) { setError(err); return; }
      setStep("TERMS");
    } else if (step === "TERMS") {
      if (!termsAgreed) { setError("You must accept the Terms and Conditions to proceed."); return; }
      setStep("ANIMATING");
      setTimeout(() => {
        const names = fullName.trim().split(" ");
        registerNewUser({
          fullName,
          firstName: names[0] || "User",
          email: email.toLowerCase().trim(),
          phone,
          dateOfBirth: dob,
          nin,
          bvn: bvn || undefined,
          password,
        });
        router.push("/verify-otp");
      }, 1800);
    }
  }

  // Animating state
  if (step === "ANIMATING") {
    return (
      <div className={styles.authPage}>
        <BrandPanel />
        <div className={styles.formPanel}>
          <div className={`${styles.formCard} ${styles.fadeUp}`}>
            <div className={styles.animatingState}>
              <Image src="/brand/2.png" alt="EcoCampus" width={140} height={50} style={{ objectFit: "contain" }} />
              <p className={styles.animatingTitle}>Initializing Secure Vault...</p>
              <p className={styles.animatingSubtext}>Establishing encrypted session & provisioning your account</p>
              <div className={styles.progressBar}><div className={styles.progressBarFill} /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { title, sub } = stepTitles[step];

  return (
    <div className={styles.authPage}>
      <BrandPanel />
      <div className={styles.formPanel}>
        <div className={`${styles.formCard} ${styles.fadeUp}`}>
          <StepIndicator current={step} />

          <div className={styles.formCardHeader}>
            <h1 className={styles.formTitle}>{title}</h1>
            <p className={styles.formSubtitle}>{sub}</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleNext} className={styles.formBody}>
            {/* Step 1: Personal */}
            {step === "PERSONAL" && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reg-fullname">Full Legal Name</label>
                  <input id="reg-fullname" type="text" required className={styles.input} placeholder="e.g. Ajugu Boluwatife David" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="reg-phone">Phone Number</label>
                    <input id="reg-phone" type="tel" required className={styles.input} placeholder="08030000000" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="reg-dob">Date of Birth</label>
                    <input id="reg-dob" type="date" required className={styles.input} value={dob} onChange={e => setDob(e.target.value)} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" type="email" required className={styles.input} placeholder="name@university.edu.ng" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </>
            )}

            {/* Step 2: Identity */}
            {step === "IDENTITY" && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reg-nin">National Identification Number (NIN)</label>
                  <input id="reg-nin" type="text" required maxLength={11} className={styles.input} placeholder="11-digit NIN" value={nin} onChange={e => setNin(e.target.value.replace(/\D/g, ""))} />
                  <span className={styles.inputHint}>{nin.length}/11 digits &mdash; required for CBN KYC compliance</span>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reg-bvn">Bank Verification Number (BVN) &mdash; Optional</label>
                  <input id="reg-bvn" type="text" maxLength={11} className={styles.input} placeholder="11-digit BVN (unlocks loan access)" value={bvn} onChange={e => setBvn(e.target.value.replace(/\D/g, ""))} />
                  <span className={styles.inputHint}>{bvn.length}/11 digits &mdash; required to apply for loans</span>
                </div>
                {/* <div className={styles.successBox}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <span>Your NIN and BVN are encrypted with AES-256 and handled under NDPR regulations. We never store them in plain text.</span>
                </div> */}
              </>
            )}

            {/* Step 3: Password */}
            {step === "PASSWORD" && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reg-password">Create Password</label>
                  <div className={styles.inputWrap}>
                    <input id="reg-password" type={showPass ? "text" : "password"} required minLength={6} className={`${styles.input} ${styles.inputWithIcon}`} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className={styles.inputIconBtn} onClick={() => setShowPass(p => !p)} aria-label="Toggle">
                      {showPass ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg> : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reg-confirm">Confirm Password</label>
                  <div className={styles.inputWrap}>
                    <input id="reg-confirm" type={showConfirm ? "text" : "password"} required className={`${styles.input} ${styles.inputWithIcon}`} placeholder="Repeat your password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                    <button type="button" className={styles.inputIconBtn} onClick={() => setShowConfirm(p => !p)} aria-label="Toggle">
                      {showConfirm ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg> : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                </div>
                {password.length > 0 && (
                  <div className={styles.inputHint} style={{ display: "flex", gap: "0.25rem" }}>
                    {["Length 6+", "Mixed chars", "Match"].map((label, i) => {
                      const checks = [password.length >= 6, /[A-Z]/.test(password) || /[0-9]/.test(password), password === confirmPass && confirmPass.length > 0];
                      return <span key={label} style={{ padding: "0.2rem 0.5rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, background: checks[i] ? "#E6FAF0" : "#F5F7FA", color: checks[i] ? "#065F46" : "#7A91A8" }}>{label}</span>;
                    })}
                  </div>
                )}
              </>
            )}

            {/* Step 4: Terms */}
            {step === "TERMS" && (
              <>
                <div className={styles.termsBox}>
                  <h4>EcoCampus Terms &amp; Conditions</h4>
                  <p><strong>1. General Services:</strong> EcoCampus provides youth and tertiary student financial technology services, savings, and peer-to-peer transfers built on Ecobank Nigeria&apos;s banking infrastructure.</p>
                  <p><strong>2. Loan Verification:</strong> Student loans and Corps Member financing require separate institutional verification (Federal/State university matriculation records or valid NYSC state codes) and BVN verification during credit application.</p>
                  <p><strong>3. Global Standing Instruction (GSI):</strong> By applying for a loan, you authorise EcoCampus and Ecobank to execute a CBN-mandated GSI directive across all your bank accounts linked to your BVN in the event of default.</p>
                  <p><strong>4. Marketplace Escrow:</strong> Funds held in Smart Escrow are non-interest bearing and held solely for transaction settlement purposes. EcoCampus takes no commission on peer transactions during the MVP phase.</p>
                  <p><strong>5. Data Security:</strong> Your NIN and personal data are encrypted with AES-256 and handled in accordance with NDPR regulations and the Nigerian Data Protection Act 2023.</p>
                </div>
                <div className={styles.checkRow}>
                  <input type="checkbox" id="terms-agree" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)} />
                  <label htmlFor="terms-agree">I have read and agree to the EcoCampus Terms &amp; Conditions and Privacy Policy</label>
                </div>
              </>
            )}

            {/* Navigation buttons */}
            {step === "PERSONAL" && (
              <button type="submit" className={styles.submitBtn} id="reg-next-1">
                Continue &mdash; Identity Verification
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            )}
            {step === "IDENTITY" && (
              <div className={styles.btnRow}>
                <button type="button" className={styles.btnSecondary} onClick={() => { setError(""); setStep("PERSONAL"); }}>Back</button>
                <button type="submit" className={styles.submitBtn} id="reg-next-2">Continue</button>
              </div>
            )}
            {step === "PASSWORD" && (
              <div className={styles.btnRow}>
                <button type="button" className={styles.btnSecondary} onClick={() => { setError(""); setStep("IDENTITY"); }}>Back</button>
                <button type="submit" className={styles.submitBtn} id="reg-next-3">Continue</button>
              </div>
            )}
            {step === "TERMS" && (
              <div className={styles.btnRow}>
                <button type="button" className={styles.btnSecondary} onClick={() => { setError(""); setStep("PASSWORD"); }}>Back</button>
                <button type="submit" className={styles.submitBtn} id="reg-submit-btn">Agree &amp; Open Account</button>
              </div>
            )}
          </form>

          <p className={styles.formFooter}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>

          <div className={styles.mobileBrandFooter}>
            <span className={styles.mobileBrandLabel}>Powered by</span>
            <Image
              src="/brand/ecobank.png"
              alt="Ecobank"
              width={78}
              height={24}
              style={{ objectFit: "contain", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
