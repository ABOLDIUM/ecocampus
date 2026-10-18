"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/branding/BrandLogo";
import styles from "./otp.module.css";

const EXPECTED_SECURITY_CODE = "123456";

export default function VerifySecurityCodePage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  function handleDigitChange(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setErrorMessage(null);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i += 1) {
      next[i] = pasted[i];
    }
    setDigits(next);
  }

  function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (secondsRemaining <= 0) {
      setErrorMessage("Verification code has expired. Request a new code below.");
      return;
    }
    const entered = digits.join("");
    if (entered !== EXPECTED_SECURITY_CODE) {
      setErrorMessage("Invalid 6-digit verification code. Please check and try again.");
      return;
    }
    router.push("/");
  }

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <main className={styles.otpContainer}>
      <div className="ec-card">
        <BrandLogo variant="icon" showMotto={true} />
        <h1 className={styles.heading}>Verify Your Account</h1>
        <p className={styles.subtext}>
          Enter the 6-digit security code sent to your registered phone and email.
        </p>

        <form onSubmit={handleVerifySubmit}>
          <div className={styles.digitRow}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${idx + 1}`}
                className={styles.digitBox}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <p className={styles.timerRow}>
            Code expires in {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>

          {errorMessage && (
            <div className={styles.statusAlert}>{errorMessage}</div>
          )}

          <button type="submit" className="ec-btn-primary">
            Verify &amp; Continue to Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}