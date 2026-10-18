"use client";

import React, { useState } from "react";
import { NUC_UNIVERSITIES } from "@/lib/data/nigerian-institutions";
import { getStoredSession, setStoredSession } from "@/lib/auth/session";
import styles from "../transfers/transfer.module.css";

export default function VerificationPortalPage() {
  const session = getStoredSession();
  const [selectedUniCode, setSelectedUniCode] = useState("UNIABUJA");
  const [matricNumber, setMatricNumber] = useState(session?.identifier || "24/203MBB/472");
  const [verifiedStatus, setVerifiedStatus] = useState<boolean | null>(null);

  const activeUni = NUC_UNIVERSITIES.find((u) => u.code === selectedUniCode) || NUC_UNIVERSITIES[0];

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!matricNumber.trim()) return;

    setVerifiedStatus(true);
    if (session) {
      setStoredSession({
        ...session,
        institutionName: activeUni.name,
        identifier: matricNumber.toUpperCase(),
      });
    }
  }

  return (
    <main className={styles.transferContainer}>
      <header className={styles.headerRow}>
        <a href="/" className={styles.backLink}>&lt; Home</a>
        <h1 className={styles.title}>University &amp; Academic Verification</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className={styles.card}>
        <form onSubmit={handleVerify}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Accredited Institution</label>
            <select
              className={styles.input}
              value={selectedUniCode}
              onChange={(e) => setSelectedUniCode(e.target.value)}
            >
              {NUC_UNIVERSITIES.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.name} ({u.category})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Matriculation Number</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. 24/203MBB/472"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Verify Academic Status
          </button>
        </form>

        {verifiedStatus && (
          <div style={{ marginTop: "1rem", backgroundColor: "#e8faed", border: "1px solid #179c3e", borderRadius: "0.75rem", padding: "0.85rem", color: "#0b5322" }}>
            <p style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.2rem" }}>✓ Student Record Verified</p>
            <p style={{ fontSize: "0.81rem" }}>
              Institution: {activeUni.name}<br />
              Matriculation No: {matricNumber}<br />
              Status: Active 200L+ Undergraduate (Eligible for 0% Student Loan)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}