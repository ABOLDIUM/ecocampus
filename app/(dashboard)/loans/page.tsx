// ============================================================================
// ECOCAMPUS MASTER LOAN SELECTION GATEWAY MODULE
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { getActiveUser, EcoUser } from "@/lib/database/user-store";
import styles from "../transfers/transfer.module.css";

export default function LoanGatewayPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
  }, [router]);

  if (!user) return null;

  return (
    <main className={styles.transferContainer}>
      <header className={styles.headerRow}>
        <a href="/" className={styles.backLink}>&lt; Home</a>
        <h1 className={styles.title}>Choose Your Financing Category</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className={styles.card} style={{ marginBottom: "1.25rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
          Select your institutional standing below to apply for the appropriate credit facility.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
        {/* Student Loan Card */}
        <div
          onClick={() => router.push("/loans/student")}
          className={styles.card}
          style={{
            cursor: "pointer",
            border: "2px solid #e2e8f0",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
            🎓
          </div>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.2rem" }}>Student Loan</h3>
            <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.4 }}>
              Zero interest loan
            </p>
          </div>
        </div>

        {/* Corp Member Loan Card */}
        <div
          onClick={() => router.push("/loans/corp-member")}
          className={styles.card}
          style={{
            cursor: "pointer",
            border: "2px solid #e2e8f0",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <img src="/brand/nysc.png" alt="NYSC Logo" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.2rem" }}>Nysc Loan</h3>
            <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.4 }}>
              Low interest loan
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}