#!/usr/bin/env python3
"""
EcoCampus Complete Project Scaffold Generator (create_ecocampus.py)
Official Motto: LEARN. GROW. ACHIEVE.

Requirements satisfied:
- Uses only Python standard library (os, sys, pathlib, json, argparse, datetime).
- Works on Windows, macOS, and Linux.
- Safe reruns: never overwrites existing files unless --force is explicitly passed.
- Reports created, skipped, and failed operations with a complete manifest.
- Zero inline CSS or React style={} props; strict separation of concerns.
- Never inserts real production secrets.
"""

from __future__ import annotations
import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

DIRECTORIES: List[str] = [
    "app/(auth)/login",
    "app/(auth)/register",
    "app/(auth)/verify-otp",
    "app/(auth)/recover-password",
    "app/(dashboard)/dashboard",
    "app/(dashboard)/transfers",
    "app/(dashboard)/verification",
    "app/(dashboard)/loans/student",
    "app/(dashboard)/loans/corp-member",
    "app/(dashboard)/marketplace",
    "app/(dashboard)/messages",
    "app/(dashboard)/rewards",
    "app/(dashboard)/airtime-data",
    "app/(dashboard)/cards",
    "app/(dashboard)/investments",
    "app/(dashboard)/subscriptions",
    "app/(dashboard)/wellness",
    "app/(dashboard)/support",
    "app/admin",
    "app/api/health",
    "app/api/auth",
    "app/api/transfers",
    "app/api/verification",
    "app/api/loans",
    "app/api/marketplace",
    "app/api/rewards",
    "app/api/airtime",
    "app/api/support",
    "components/branding",
    "components/navigation",
    "components/auth",
    "components/dashboard",
    "components/banking",
    "components/loans",
    "components/verification",
    "components/marketplace",
    "components/messaging",
    "components/rewards",
    "components/support",
    "components/ui",
    "lib/auth",
    "lib/database",
    "lib/security",
    "lib/validation",
    "lib/formatting",
    "services/banking",
    "services/identity",
    "services/loans",
    "services/marketplace",
    "services/rewards",
    "services/airtime",
    "services/investments",
    "services/subscriptions",
    "styles",
    "public/brand",
    "public/icons",
    "public/images",
    "database/migrations",
    "database/seed",
    "scripts",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    "docs",
]


def get_starter_files() -> Dict[str, str]:
    """Return dictionary mapping relative file paths to their exact starter contents."""
    files: Dict[str, str] = {}

    files["package.json"] = json.dumps(
        {
            "name": "ecocampus",
            "version": "0.1.0",
            "private": True,
            "description": "EcoCampus Youth Fintech Prototype - LEARN. GROW. ACHIEVE.",
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start",
                "lint": "next lint",
                "typecheck": "tsc --noEmit",
                "test": "vitest run",
                "test:watch": "vitest"
            },
            "dependencies": {
                "next": "15.1.6",
                "react": "19.0.0",
                "react-dom": "19.0.0",
                "pg": "^8.13.1",
                "zod": "^3.24.1"
            },
            "devDependencies": {
                "@types/node": "^22.10.2",
                "@types/pg": "^8.11.10",
                "@types/react": "^19.0.2",
                "@types/react-dom": "^19.0.2",
                "typescript": "^5.7.2",
                "vitest": "^2.1.8"
            }
        },
        indent=2,
    ) + "\n"

    files["tsconfig.json"] = json.dumps(
        {
            "compilerOptions": {
                "target": "ES2022",
                "lib": ["dom", "dom.iterable", "esnext"],
                "allowJs": False,
                "skipLibCheck": True,
                "strict": True,
                "noEmit": True,
                "esModuleInterop": True,
                "module": "esnext",
                "moduleResolution": "bundler",
                "resolveJsonModule": True,
                "isolatedModules": True,
                "jsx": "preserve",
                "incremental": True,
                "plugins": [{"name": "next"}],
                "paths": {
                    "@/*": ["./*"]
                }
            },
            "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
            "exclude": ["node_modules"]
        },
        indent=2,
    ) + "\n"

    files["next.config.mjs"] = """/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
"""

    files[".gitignore"] = """# Dependencies
/node_modules
/.pnp
.pnp.js

# Next.js build output
/.next/
/out/
/build

# Environment variables & secrets (NEVER COMMIT REAL CREDENTIALS)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Python cache
__pycache__/
*.py[cod]
.venv/
venv/

# Logs & OS artifacts
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
Thumbs.db
*.tsbuildinfo
next-env.d.ts
"""

    files[".env.example"] = """# ============================================================================
# ECOCAMPUS ENVIRONMENT CONFIGURATION TEMPLATE (.env.example)
# Copy this file to .env.local for local development.
# NEVER commit .env or .env.local containing real credentials to GitHub.
# ============================================================================

# Application Metadata
NEXT_PUBLIC_APP_NAME="EcoCampus"
NEXT_PUBLIC_APP_MOTTO="LEARN. GROW. ACHIEVE."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Database Connection (PostgreSQL via Supabase / Neon / Local Postgres)
# Use dummy placeholder below until Phase 4 configuration:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/ecocampus_dev"

# Authentication & Session Security
# Generate a 32+ character secret for production
AUTH_SESSION_SECRET="replace_with_at_least_32_characters_random_secret_key"

# Development-Only Fixed OTP Simulation (MUST be "false" in Production!)
ENABLE_DEV_FIXED_OTP="true"
DEV_FIXED_OTP_CODE="123456"
OTP_EXPIRY_MINUTES="10"

# Restricted Demo Funding Controls
ENABLE_DEMO_FUNDING="true"
MAX_DEMO_FUNDING_KOBO="50000000"
"""

    files["styles/tokens.css"] = """/* ==========================================================================
   EcoCampus Design System Tokens (Derived from official EcoCampus Logo)
   Official Motto: LEARN. GROW. ACHIEVE.
   ========================================================================== */

:root {
  /* Brand Blues (Graduation Cap & 'Eco' Wordmark) */
  --ec-blue-900: #00264d;
  --ec-blue-800: #003b73;
  --ec-blue-700: #00529b;
  --ec-blue-600: #0066cc;
  --ec-blue-500: #0a7cff;
  --ec-blue-100: #e6f2ff;
  --ec-blue-50: #f2f8ff;

  /* Brand Greens ('Campus' Wordmark & Leaf Emblem Swooshes) */
  --ec-green-900: #0b5322;
  --ec-green-700: #137a32;
  --ec-green-600: #179c3e;
  --ec-green-500: #2cc956;
  --ec-green-400: #68e370;
  --ec-green-100: #e8faed;
  --ec-green-50: #f3fcf5;

  /* Neutral Surface & Text Palette */
  --ec-bg-page: #f4f7fb;
  --ec-bg-surface: #ffffff;
  --ec-bg-subtle: #edf2f7;
  --ec-text-primary: #0f172a;
  --ec-text-secondary: #475569;
  --ec-text-muted: #64748b;
  --ec-border-subtle: #e2e8f0;
  --ec-border-focus: #0066cc;

  /* Semantic Status Colors */
  --ec-success-bg: #dcfce7;
  --ec-success-text: #166534;
  --ec-warning-bg: #fef9c3;
  --ec-warning-text: #854d0e;
  --ec-danger-bg: #fee2e2;
  --ec-danger-text: #991b1b;

  /* Gradients */
  --ec-gradient-primary: linear-gradient(135deg, #003b73 0%, #0066cc 55%, #179c3e 100%);
  --ec-gradient-balance: linear-gradient(135deg, #003b73 0%, #0d6e52 55%, #179c3e 100%);
  --ec-gradient-card-verve: linear-gradient(135deg, #00264d 0%, #00529b 60%, #137a32 100%);

  /* Spacing & Radii */
  --ec-radius-sm: 0.5rem;
  --ec-radius-md: 0.875rem;
  --ec-radius-lg: 1.25rem;
  --ec-radius-pill: 9999px;

  /* Shadows */
  --ec-shadow-sm: 0 2px 8px rgba(0, 38, 77, 0.06);
  --ec-shadow-md: 0 8px 24px rgba(0, 38, 77, 0.10);
  --ec-shadow-lg: 0 16px 40px rgba(0, 38, 77, 0.14);
}
"""

    files["styles/typography.css"] = """/* ==========================================================================
   EcoCampus Typography Rules
   ========================================================================== */

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--ec-text-primary);
  background-color: var(--ec-bg-page);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.ec-motto-text {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ec-blue-800);
}

.ec-mono-amount {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}
"""

    files["styles/components.css"] = """/* ==========================================================================
   EcoCampus Shared Component Classes (No Inline CSS)
   ========================================================================== */

.ec-shell-container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 1.25rem 1rem 5.5rem;
}

.ec-card {
  background-color: var(--ec-bg-surface);
  border: 1px solid var(--ec-border-subtle);
  border-radius: var(--ec-radius-lg);
  box-shadow: var(--ec-shadow-sm);
  padding: 1.25rem;
}

.ec-balance-hero {
  background: var(--ec-gradient-balance);
  color: #ffffff;
  border-radius: var(--ec-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--ec-shadow-md);
}

.ec-badge-demo {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--ec-radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
  background-color: var(--ec-green-100);
  color: var(--ec-green-900);
  border: 1px solid var(--ec-green-500);
}

.ec-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--ec-radius-md);
  border: none;
  background: var(--ec-gradient-primary);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.ec-btn-primary:hover {
  opacity: 0.94;
}

.ec-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--ec-radius-md);
  border: 1px solid var(--ec-blue-700);
  background-color: var(--ec-bg-surface);
  color: var(--ec-blue-800);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  text-decoration: none;
}
"""

    files["styles/responsive.css"] = """/* ==========================================================================
   EcoCampus Responsive Grid & Mobile Fintech Navigation Layout
   ========================================================================== */

.ec-grid-quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.ec-grid-modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

@media (max-width: 640px) {
  .ec-grid-quick-actions {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .ec-shell-container {
    padding: 0.875rem 0.75rem 5.5rem;
  }
}
"""

    files["app/globals.css"] = """@import "../styles/tokens.css";
@import "../styles/typography.css";
@import "../styles/components.css";
@import "../styles/responsive.css";

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  min-height: 100%;
}
"""

    files["public/manifest.json"] = json.dumps(
        {
            "name": "EcoCampus - LEARN. GROW. ACHIEVE.",
            "short_name": "EcoCampus",
            "description": "Nigerian Youth & Tertiary Student Financial Technology Ecosystem Prototype",
            "start_url": "/",
            "display": "standalone",
            "background_color": "#003B73",
            "theme_color": "#003B73",
            "orientation": "portrait-primary",
            "icons": [
                {
                    "src": "/brand/ecocampus-icon.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any maskable"
                }
            ]
        },
        indent=2,
    ) + "\n"

    files["lib/formatting/currency.ts"] = """/**
 * EcoCampus Fixed-Precision Money Formatting Utility
 * All monetary amounts in EcoCampus are stored in integer minor units (kobo / cents)
 * to prevent floating-point rounding errors.
 */

export function formatKoboToNaira(amountKobo: number, hideBalance = false): string {
  if (hideBalance) {
    return "₦ ••••••";
  }
  const naira = amountKobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(naira);
}

export function formatCentsToUsd(amountCents: number, hideBalance = false): string {
  if (hideBalance) {
    return "$ ••••••";
  }
  const usd = amountCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
}
"""

    files["components/branding/BrandLogo.module.css"] = """.logoWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.logoImage {
  max-width: 220px;
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}

.logoCompact {
  max-width: 44px;
  width: 44px;
  height: 44px;
  border-radius: 0.75rem;
  object-fit: contain;
}

.mottoBanner {
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--ec-blue-800);
}

.disclaimerTag {
  font-size: 0.72rem;
  color: var(--ec-text-muted);
  max-width: 460px;
}
"""

    files["components/branding/BrandLogo.tsx"] = """import React from "react";
import styles from "./BrandLogo.module.css";

interface BrandLogoProps {
  variant?: "full" | "icon";
  showMotto?: boolean;
  showPrototypeNotice?: boolean;
}

export function BrandLogo({
  variant = "full",
  showMotto = true,
  showPrototypeNotice = false,
}: BrandLogoProps) {
  return (
    <div className={styles.logoWrapper}>
      {variant === "full" ? (
        <img
          src="/brand/ecocampus-logo.png"
          alt="EcoCampus Logo - LEARN. GROW. ACHIEVE."
          className={styles.logoImage}
        />
      ) : (
        <img
          src="/brand/ecocampus-icon.png"
          alt="EcoCampus Emblem"
          className={styles.logoCompact}
        />
      )}

      {showMotto && (
        <p className={styles.mottoBanner} aria-label="Official EcoCampus Motto">
          LEARN. GROW. ACHIEVE.
        </p>
      )}

      {showPrototypeNotice && (
        <p className={styles.disclaimerTag}>
          Competition Prototype Environment • Simulated Accounts &amp; Verifications
        </p>
      )}
    </div>
  );
}
"""

    files["app/layout.tsx"] = """import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoCampus | LEARN. GROW. ACHIEVE.",
  description:
    "EcoCampus Youth & Student Financial Ecosystem Prototype for Nigerian Tertiary Students (200L+) and NYSC Corp Members.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
"""

    files["app/page.module.css"] = """.headerBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--ec-border-subtle);
}

.headerBrand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brandTitle {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--ec-blue-800);
}

.brandMottoSmall {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--ec-green-700);
}

.heroGrid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.balanceLabelRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  opacity: 0.92;
  margin-bottom: 0.5rem;
}

.balanceValue {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.accountMetaRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.8125rem;
  opacity: 0.95;
  margin-bottom: 1rem;
}

.actionRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.sectionTitle {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ec-blue-900);
  margin-bottom: 0.75rem;
}

.moduleCardTitle {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ec-blue-800);
  margin-bottom: 0.35rem;
}

.moduleCardText {
  font-size: 0.84rem;
  color: var(--ec-text-secondary);
}

@media (max-width: 768px) {
  .heroGrid {
    grid-template-columns: 1fr;
  }
}
"""

    files["app/page.tsx"] = """import React from "react";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import styles from "./page.module.css";

export default function HomePage() {
  const sampleBalanceKobo = 12545000; // ₦125,450.00 demo balance

  return (
    <main className="ec-shell-container">
      <header className={styles.headerBar}>
        <div className={styles.headerBrand}>
          <BrandLogo variant="icon" showMotto={false} />
          <div>
            <h1 className={styles.brandTitle}>EcoCampus</h1>
            <p className={styles.brandMottoSmall}>LEARN. GROW. ACHIEVE.</p>
          </div>
        </div>
        <span className="ec-badge-demo">SIMULATED DEMO ENVIRONMENT</span>
      </header>

      <section className={styles.heroGrid} aria-label="EcoCampus Overview">
        <div className="ec-balance-hero">
          <div className={styles.balanceLabelRow}>
            <span>Available Demo Balance (Student Tier • 200L+)</span>
            <span>Customer ID: EC-STU-2026-001</span>
          </div>
          <p className={`${styles.balanceValue} ec-mono-amount`}>
            {formatKoboToNaira(sampleBalanceKobo)}
          </p>
          <div className={styles.accountMetaRow}>
            <span>Demo Account No: 3094827104</span>
            <span>•</span>
            <span>Academic Status: Verified in Demo</span>
          </div>
          <div className={styles.actionRow}>
            <a href="/login" className="ec-btn-secondary">
              Sign In / Test OTP (123456)
            </a>
            <a href="/register" className="ec-btn-secondary">
              Student &amp; NYSC Onboarding
            </a>
          </div>
        </div>

        <div className="ec-card">
          <BrandLogo variant="full" showMotto={true} showPrototypeNotice={true} />
        </div>
      </section>

      <section aria-label="Core Ecosystem Modules">
        <h2 className={styles.sectionTitle}>
          EcoCampus Ecosystem Modules (Scaffold Verified)
        </h2>
        <div className="ec-grid-modules">
          <article className="ec-card">
            <h3 className={styles.moduleCardTitle}>1. Simulated Banking &amp; Atomic Transfers</h3>
            <p className={styles.moduleCardText}>
              Unique EcoCampus account numbers, recipient lookup, and atomic PostgreSQL ledger transfers between demo accounts.
            </p>
          </article>
          <article className="ec-card">
            <h3 className={styles.moduleCardTitle}>2. 0% Student &amp; Low-Interest NYSC Loans</h3>
            <p className={styles.moduleCardText}>
              200L+ academic verification, Second Class Lower standing check, 0% interest student loans, and NYSC Corp Member credit.
            </p>
          </article>
          <article className="ec-card">
            <h3 className={styles.moduleCardTitle}>3. Campus Marketplace &amp; Protected Orders</h3>
            <p className={styles.moduleCardText}>
              Student listings, startup discovery, buyer-seller chat, simulated protected settlement, and dispute resolution.
            </p>
          </article>
          <article className="ec-card">
            <h3 className={styles.moduleCardTitle}>4. Referrals (₦4,000), Airtime, Cards &amp; AI Hub</h3>
            <p className={styles.moduleCardText}>
              ₦4,000 reward after 3 qualifying referrals, daily check-in streaks, Verve-first virtual cards, NGX equities, and AI tools.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
"""

    files["app/api/health/route.ts"] = """import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    product: "EcoCampus",
    motto: "LEARN. GROW. ACHIEVE.",
    mode: "simulated_fintech_prototype",
    timestamp: new Date().toISOString(),
  });
}
"""

    files["database/schema.sql"] = """-- ============================================================================
-- EcoCampus Core PostgreSQL Schema (Starter Foundation - Expanded in Phase 4)
-- Money is stored strictly in BIGINT minor units (kobo/cents)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id VARCHAR(32) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  account_type VARCHAR(24) NOT NULL CHECK (account_type IN ('STUDENT', 'CORP_MEMBER', 'ADMIN')),
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_number VARCHAR(10) UNIQUE NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'NGN' CHECK (currency IN ('NGN', 'USD')),
  balance_minor BIGINT NOT NULL DEFAULT 0 CHECK (balance_minor >= 0),
  is_demo_account BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FROZEN', 'RESTRICTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, currency)
);
"""

    files["README.md"] = """# EcoCampus — LEARN. GROW. ACHIEVE.

Professional Nigerian Youth & Tertiary Student Financial Technology Prototype for **200 Level+ University Students** and **NYSC Corp Members**.

## Important Prototype Disclaimer
- **Simulated Environment:** All accounts, balances, transfers, loans, cards, identity checks (NIN/BVN/NYSC), and academic verifications are strictly simulated for competition demonstration purposes.
- **Brand Notice:** Uses the supplied EcoCampus competition artwork (*"by Ecobank"* reference artwork). This prototype does not claim a formal commercial banking licence, live interbank settlement, or official NELFUND affiliation.
"""

    return files


def generate_scaffold(target_dir: Path, force: bool = False) -> Tuple[List[str], List[str], List[Tuple[str, str]]]:
    created: List[str] = []
    skipped: List[str] = []
    failed: List[Tuple[str, str]] = []

    target_dir.mkdir(parents=True, exist_ok=True)

    # 1. Create directories
    for rel_dir in DIRECTORIES:
        dir_path = target_dir / rel_dir
        try:
            if not dir_path.exists():
                dir_path.mkdir(parents=True, exist_ok=True)
                created.append(f"[DIR]  {rel_dir}/")
            else:
                skipped.append(f"[DIR]  {rel_dir}/ (already exists)")
        except OSError as exc:
            failed.append((rel_dir, str(exc)))

    # 2. Create starter files
    starter_files = get_starter_files()
    for rel_file, content in starter_files.items():
        file_path = target_dir / rel_file
        try:
            file_path.parent.mkdir(parents=True, exist_ok=True)
            if file_path.exists() and not force:
                skipped.append(f"[FILE] {rel_file} (skipped - already exists)")
                continue
            file_path.write_text(content, encoding="utf-8")
            created.append(f"[FILE] {rel_file}")
        except OSError as exc:
            failed.append((rel_file, str(exc)))

    # 3. Copy self into scripts/create_ecocampus.py if running from outside
    script_dest = target_dir / "scripts" / "create_ecocampus.py"
    try:
        current_script = Path(__file__).resolve()
        if current_script.exists() and current_script != script_dest.resolve():
            if not script_dest.exists() or force:
                script_dest.write_text(current_script.read_text(encoding="utf-8"), encoding="utf-8")
                created.append("[FILE] scripts/create_ecocampus.py")
            else:
                skipped.append("[FILE] scripts/create_ecocampus.py (skipped - already exists)")
    except OSError as exc:
        failed.append(("scripts/create_ecocampus.py", str(exc)))

    # 4. Write File Manifest
    manifest_path = target_dir / "docs" / "scaffold-manifest.json"
    try:
        manifest_data = {
            "product": "EcoCampus",
            "motto": "LEARN. GROW. ACHIEVE.",
            "generated_at_utc": datetime.utcnow().isoformat() + "Z",
            "target_directory": str(target_dir.resolve()),
            "counts": {
                "created": len(created),
                "skipped": len(skipped),
                "failed": len(failed),
            },
            "created_items": created,
            "skipped_items": skipped,
        }
        manifest_path.write_text(json.dumps(manifest_data, indent=2) + "\n", encoding="utf-8")
        created.append("[FILE] docs/scaffold-manifest.json")
    except OSError as exc:
        failed.append(("docs/scaffold-manifest.json", str(exc)))

    return created, skipped, failed


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate the EcoCampus Next.js + TypeScript + PostgreSQL project structure."
    )
    parser.add_argument(
        "--target",
        type=str,
        default="ecocampus",
        help="Target project directory path (default: ./ecocampus)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing starter files if explicitly requested.",
    )
    args = parser.parse_args()

    target_path = Path(args.target)
    print("=" * 72)
    print("ECOCAMPUS PROJECT GENERATOR | LEARN. GROW. ACHIEVE.")
    print(f"Target Directory: {target_path.resolve()}")
    print("=" * 72)

    created, skipped, failed = generate_scaffold(target_path, force=args.force)

    print(f"\n[+] Created operations ({len(created)}):")
    for item in created:
        print(f"    {item}")

    if skipped:
        print(f"\n[~] Skipped operations ({len(skipped)} - safe rerun protection):")
        for item in skipped[:15]:
            print(f"    {item}")
        if len(skipped) > 15:
            print(f"    ... and {len(skipped) - 15} more existing items preserved.")

    if failed:
        print(f"\n[!] Failed operations ({len(failed)}):", file=sys.stderr)
        for path_str, err in failed:
            print(f"    {path_str}: {err}", file=sys.stderr)
        return 1

    print("\n" + "=" * 72)
    print("Scaffold generation completed successfully.")
    print("NOTE: Dependencies (npm install) and database migrations have NOT been")
    print("executed automatically. Follow Phase 3 to place brand assets & run npm install.")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    sys.exit(main())