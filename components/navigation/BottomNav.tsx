"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getActiveUser, EcoUser } from "@/lib/database/user-store";
import styles from "./BottomNav.module.css";

interface BottomNavProps {
  activeTab?: "home" | "market" | "invest" | "rewards" | "opportunities" | "loans" | "transfers" | "profile" | "usd" | "cards";
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<EcoUser | null>(null);

  useEffect(() => {
    setUser(getActiveUser());
  }, []);

  const current =
    activeTab ||
    (pathname === "/"
      ? "home"
      : pathname.startsWith("/marketplace")
      ? "market"
      : pathname.startsWith("/investments")
      ? "invest"
      : pathname.startsWith("/rewards")
      ? "rewards"
      : pathname.startsWith("/opportunities")
      ? "opportunities"
      : pathname.startsWith("/loans")
      ? "loans"
      : pathname.startsWith("/usd-account")
      ? "usd"
      : pathname.startsWith("/cards")
      ? "cards"
      : pathname.startsWith("/transfers")
      ? "transfers"
      : pathname.startsWith("/profile")
      ? "profile"
      : "home");

  return (
    <aside className={styles.navigationShell} aria-label="Main Navigation">
      {/* ── DESKTOP SIDEBAR HEADER (Visible ≥ 768px) ── */}
      <div className={styles.desktopBrand}>
        <Link href="/" className={styles.brandLink}>
          <div className={styles.brandLogoWrap}>
            <Image
              src="/brand/ecocampus-logo.png"
              alt="EcoCampus"
              width={34}
              height={34}
              className={styles.brandLogoImg}
            />
          </div>
          <div className={styles.brandTextWrap}>
            <span className={styles.brandTitle}>
              Eco<span className={styles.brandAccent}>Campus</span>
            </span>
            <span className={styles.brandSub}>Student FinTech</span>
          </div>
        </Link>

        {/* Official Ecobank Partnership Badge */}
        <div className={styles.ecobankPartnerBadge}>
          <Image
            src="/brand/ecobank.png"
            alt="Ecobank"
            width={72}
            height={20}
            style={{ height: "16px", width: "auto", objectFit: "contain" }}
          />
          <span className={styles.partnerText}>Official Partner</span>
        </div>
      </div>

      {/* ── MAIN NAVIGATION LINKS (Shared Mobile + Desktop) ── */}
      <nav className={styles.navContainer}>
        {/* Desktop Section Header */}
        <div className={styles.desktopSectionLabel}>MAIN MENU</div>

        <Link
          href="/"
          className={`${styles.navItem} ${current === "home" ? styles.navItemActive : ""}`}
          aria-label="Home"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className={styles.navLabel}>Home</span>
        </Link>

        <Link
          href="/marketplace"
          className={`${styles.navItem} ${current === "market" ? styles.navItemActive : ""}`}
          aria-label="EcoMarket"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className={styles.navLabel}>EcoMarket</span>
        </Link>

        <Link
          href="/investments"
          className={`${styles.navItem} ${current === "invest" ? styles.navItemActive : ""}`}
          aria-label="EcoInvest"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className={styles.navLabel}>EcoInvest</span>
          <span className={styles.desktopBadge}>18.7%</span>
        </Link>

        <Link
          href="/rewards"
          className={`${styles.navItem} ${current === "rewards" ? styles.navItemActive : ""}`}
          aria-label="EcoRewards"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <span className={styles.navLabel}>EcoRewards</span>
        </Link>

        <Link
          href="/loans"
          className={`${styles.navItem} ${current === "loans" ? styles.navItemActive : ""}`}
          aria-label="Loans"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className={styles.navLabel}>Loans</span>
          <span className={styles.desktopZeroBadge}>0% APR</span>
        </Link>

        {/* ── DESKTOP-ONLY SECONDARY SERVICES (≥ 768px) ── */}
        <div className={styles.desktopSectionLabel} style={{ marginTop: "1.25rem" }}>
          BANKING &amp; FX
        </div>

        <Link
          href="/usd-account"
          className={`${styles.navItem} ${styles.desktopOnly} ${current === "usd" ? styles.navItemActive : ""}`}
          aria-label="USD Dom & Card"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className={styles.navLabel}>USD Dom &amp; Card</span>
        </Link>

        <Link
          href="/cards"
          className={`${styles.navItem} ${styles.desktopOnly} ${current === "cards" ? styles.navItemActive : ""}`}
          aria-label="NGN Virtual Card"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span className={styles.navLabel}>Virtual Cards</span>
        </Link>

        <Link
          href="/transfers"
          className={`${styles.navItem} ${styles.desktopOnly} ${current === "transfers" ? styles.navItemActive : ""}`}
          aria-label="Instant Transfers"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span className={styles.navLabel}>Bank Transfers</span>
        </Link>

        <Link
          href="/opportunities"
          className={`${styles.navItem} ${styles.desktopOnly} ${current === "opportunities" ? styles.navItemActive : ""}`}
          aria-label="Opportunities"
        >
          <div className={styles.navIconWrap}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className={styles.navLabel}>Opportunities</span>
        </Link>
      </nav>

      {/* ── DESKTOP SIDEBAR FOOTER (Profile link) ── */}
      <div className={styles.desktopProfileCard}>
        <Link href="/profile" className={styles.profileLinkWrap}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarCircle}>
              {user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : "EC"}
            </div>
            <span className={styles.onlineDot} />
          </div>
          <div className={styles.profileTextWrap}>
            <span className={styles.profileName}>
              {user?.fullName || "EcoCampus Member"}
            </span>
            <span className={styles.profileSub}>
              {user?.institutionName ? user.institutionName.split(" ")[0] : "Student"} · Verified
            </span>
          </div>
          <svg width="16" height="16" fill="none" stroke="#94A3B8" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}

export default BottomNav;
