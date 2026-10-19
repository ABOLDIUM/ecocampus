// ============================================================================
// ECOCAMPUS PROFILE & ACCOUNT MANAGEMENT — APP/(DASHBOARD)/PROFILE/PAGE.TSX
// User identity, KYC Tier 1 Prime, Institutional Credentials & Sign Out
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveUser, clearActiveUser, EcoUser } from "@/lib/database/user-store";
import { BottomNav } from "@/components/navigation/BottomNav";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/landing");
      return;
    }
    setUser(active);
  }, [router]);

  if (!user) return null;

  function handleCopy(text: string, label: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2500);
    }
  }

  function handleSignOut() {
    clearActiveUser();
    router.push("/landing");
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "EC";

  return (
    <main className={styles.container}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <a href="/" className={styles.backBtn}>
          <span>&larr;</span> Dashboard
        </a>
        <h1 className={styles.headerTitle}>Profile & Settings</h1>
        <div className={styles.tierBadge}>
          Tier 1 Prime
        </div>
      </header>

      {/* ── Profile Hero Card ───────────────────────────────────────────── */}
      <div className={styles.profileHero}>
        <div className={styles.avatarLarge}>
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            initials
          )}
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>{user.fullName}</div>
          <div className={styles.profileEmail}>{user.email}</div>
          <div className={styles.memberPill}>
            <span>Member #{user.memberNumber || "000247"}</span>
            <span>·</span>
            <span>{user.accountType === "student" ? "Student" : "Corps Member"}</span>
          </div>
        </div>
      </div>

      {/* ── Banking Account Details ─────────────────────────────────────── */}
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <span>Banking Information</span>
          <span style={{ color: "#007749" }}>CBN / NDIC Insured</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Account Number</span>
          <div className={styles.infoValue}>
            <span>{user.accountNumber}</span>
            <button
              type="button"
              className={styles.copyBadge}
              onClick={() => handleCopy(user.accountNumber, "acct")}
            >
              {copiedField === "acct" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Bank</span>
          <span className={styles.infoValue}>Ecobank Nigeria</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Account Name</span>
          <span className={styles.infoValue}>{user.fullName.toUpperCase()}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Campus Score</span>
          <span className={styles.infoValue} style={{ color: "#007749" }}>
            {user.campusScore || 720} / 1000
          </span>
        </div>
      </section>

      {/* ── Academic & KYC Verification ─────────────────────────────────── */}
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <span>Institutional Verification</span>
          <span style={{ color: "#007749" }}>Verified</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Institution</span>
          <span className={styles.infoValue}>{user.institutionName || "University of Abuja"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Level / Status</span>
          <span className={styles.infoValue}>{user.academicLevel || "Undergraduate"}</span>
        </div>

        {user.courseOfStudy && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Course</span>
            <span className={styles.infoValue}>{user.courseOfStudy}</span>
          </div>
        )}

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Matric / ID</span>
          <span className={styles.infoValue}>{user.customerId || "UNIABUJA/2024/472"}</span>
        </div>

        {user.phone && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone</span>
            <span className={styles.infoValue}>{user.phone}</span>
          </div>
        )}
      </section>

      {/* ── Sign Out Action ─────────────────────────────────────────────── */}
      <button
        type="button"
        className={styles.signOutBtn}
        onClick={handleSignOut}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out of EcoCampus
      </button>

      {/* ── Persistent Bottom Navigation ─────────────────────────────────── */}
      <BottomNav />
    </main>
  );
}
