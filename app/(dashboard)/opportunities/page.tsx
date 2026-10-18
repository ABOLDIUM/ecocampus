// ============================================================================
// ECOCAMPUS OPPORTUNITY HUB & CAREER ACCELERATOR — APP/(DASHBOARD)/OPPORTUNITIES/PAGE.TSX
// Flagship Sprint 4 Overhaul | Internships, NYSC PPA Matcher & Subsidized Digital Skills
// Executive Presentation for ADEBANKE Oladejo, VICTOR Yalokwu, BABAWALE John
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import {
  getActiveUser,
  getUsers,
  saveUsers,
  EcoUser,
} from "@/lib/database/user-store";
import styles from "./opportunities.module.css";

interface JobOpportunity {
  id: string;
  company: string;
  logoText: string;
  logoBg: string;
  title: string;
  category: "all" | "fasttrack" | "tech" | "nysc" | "finance";
  typeBadge: string;
  isNysc?: boolean;
  stipend: string;
  location: string;
  deadline: string;
  perks: string[];
  description: string;
}

interface SkillCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  subsidizedPriceNaira: number;
  retailPriceNaira: number;
  scoreBoost: number;
  badge: string;
  description: string;
  skills: string[];
}

const OPPORTUNITIES_LIST: JobOpportunity[] = [
  {
    id: "opp-1",
    company: "Ecobank Nigeria",
    logoText: "EB",
    logoBg: "#007749",
    title: "Graduate FinTech Trainee & Systems Analyst",
    category: "fasttrack",
    typeBadge: "⭐ Ecobank FastTrack",
    stipend: "₦180,000/mo",
    location: "Abuja / Lagos (Hybrid)",
    deadline: "Nov 30, 2026",
    perks: ["Direct Full-Time Conversion", "Official Work Laptop", "Ecobank Healthcare"],
    description: "Join ADEBANKE Oladejo's enterprise technology team building the next-generation omni-channel core banking services for Africa.",
  },
  {
    id: "opp-2",
    company: "Paystack MFB",
    logoText: "PS",
    logoBg: "#00C3F8",
    title: "Core Backend & Payment Systems Intern",
    category: "tech",
    typeBadge: "🚀 Tech Internship",
    stipend: "₦160,000/mo",
    location: "Lagos (Remote Friendly)",
    deadline: "Dec 15, 2026",
    perks: ["Babawale John's Team Mentorship", "Learning Stipend", "Flexible Hours"],
    description: "Design high-concurrency payment switches, webhooks, and direct debit integrations for Nigeria's leading merchant ecosystem.",
  },
  {
    id: "opp-3",
    company: "Federal Ministry of Innovation",
    logoText: "FM",
    logoBg: "#059669",
    title: "NYSC Digital Economy Research Fellow",
    category: "nysc",
    typeBadge: "🇳🇬 NYSC High-Allowance PPA",
    isNysc: true,
    stipend: "₦33k Fed + ₦65k Allowance",
    location: "Abuja (FCT)",
    deadline: "Batch A 2026",
    perks: ["🏠 Free Corper Housing Included", "Research Grant", "Certificate of Commendation"],
    description: "Place of Primary Assignment (PPA) with free furnished quarters, monthly agency top-up allowance, and equipment financing.",
  },
  {
    id: "opp-4",
    company: "Flutterwave",
    logoText: "FL",
    logoBg: "#FF6600",
    title: "Product Design & FinTech UX Apprentice",
    category: "tech",
    typeBadge: "🎨 Product Internship",
    stipend: "₦150,000/mo",
    location: "Remote (Nigeria)",
    deadline: "Nov 28, 2026",
    perks: ["Direct Ecobank Deposit", "Global Design Network", "Design Tool Licenses"],
    description: "Craft friction-free digital checkout experiences, micro-animations, and accessible mobile banking interfaces for millions.",
  },
  {
    id: "opp-5",
    company: "Andela",
    logoText: "AN",
    logoBg: "#335EEA",
    title: "Cloud Infrastructure & DevOps Engineer Apprentice",
    category: "tech",
    typeBadge: "☁️ Cloud Apprentice",
    stipend: "₦175,000/mo",
    location: "Remote",
    deadline: "Dec 05, 2026",
    perks: ["M3 MacBook Pro Provided", "AWS Certification Voucher", "Global Placement"],
    description: "Hands-on container orchestration, Kubernetes, CI/CD pipelines, and multi-cloud resilience with world-class tech leads.",
  },
];

const SKILL_COURSES: SkillCourse[] = [
  {
    id: "crs-1",
    title: "AWS Cloud Solutions Architecture & DevOps",
    provider: "AWS × Ecobank Tech Academy",
    duration: "6 Weeks (Self-paced)",
    subsidizedPriceNaira: 4500,
    retailPriceNaira: 65000,
    scoreBoost: 50,
    badge: "☁️ 93% Subsidized",
    description: "Master cloud security, serverless compute, and microservices architecture. Fully accredited by Amazon Web Services.",
    skills: ["AWS Lambda", "Docker", "CloudFront", "Terraform"],
  },
  {
    id: "crs-2",
    title: "FinTech Product Analytics & SQL",
    provider: "Ecobank Analytics Desk",
    duration: "4 Weeks",
    subsidizedPriceNaira: 0,
    retailPriceNaira: 40000,
    scoreBoost: 40,
    badge: "🎁 100% Free for 200L+",
    description: "Direct curriculum by Victor Yalokwu's data analytics group. Learn cohort analysis, LTV prediction, and automated risk scoring.",
    skills: ["SQL", "Cohort Analysis", "PowerBI", "Credit Scoring"],
  },
  {
    id: "crs-3",
    title: "Full-Stack Next.js 15 & Banking Systems",
    provider: "Modern Web Labs",
    duration: "8 Weeks",
    subsidizedPriceNaira: 3500,
    retailPriceNaira: 45000,
    scoreBoost: 50,
    badge: "⚡ Subsidized",
    description: "Build robust, SSR-powered financial applications with React 19, TypeScript, secure webhooks, and NIBSS API standards.",
    skills: ["Next.js 15", "TypeScript", "Tailwind/CSS Modules", "NIBSS Rails"],
  },
];

export default function OpportunitiesHubPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);

  // Active track: "jobs" | "skills"
  const [activeTrack, setActiveTrack] = useState<"jobs" | "skills">("jobs");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // FastTrack Application modal
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState<boolean>(false);

  // Course Enrollment modal
  const [selectedCourse, setSelectedCourse] = useState<SkillCourse | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);

  // Feedback toast
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
  }, [router]);

  if (!user) return null;

  // Filter jobs
  const filteredJobs = OPPORTUNITIES_LIST.filter((job) => {
    if (selectedCategory === "all") return true;
    return job.category === selectedCategory;
  });

  // Handle FastTrack One-Click Apply
  function handleConfirmFastTrack() {
    if (!selectedJob) return;
    setIsSubmittingApp(true);

    setTimeout(() => {
      setIsSubmittingApp(false);
      setIsApplyModalOpen(false);

      const boost = 15;
      const all = getUsers();
      const idx = all.findIndex((u) => u.id === user!.id);
      if (idx !== -1) {
        all[idx].campusScore = Math.min(1000, (all[idx].campusScore || 700) + boost);
        saveUsers(all);
        setUser(all[idx]);
      }

      setFeedback({
        type: "success",
        message: `🎉 Application for ${selectedJob.title} at ${selectedJob.company} submitted! FastTrack verified credentials delivered (+${boost} Campus Score)!`,
      });
      setTimeout(() => setFeedback(null), 6000);
    }, 1200);
  }

  // Handle Course Enrollment & Score Boost
  function handleConfirmEnrollment() {
    if (!selectedCourse) return;
    const costKobo = Math.round(selectedCourse.subsidizedPriceNaira * 100);

    if (user!.balanceKobo < costKobo) {
      setFeedback({
        type: "error",
        message: "Insufficient account balance to enroll in this subsidized course.",
      });
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx !== -1) {
      all[idx].balanceKobo -= costKobo;
      all[idx].campusScore = Math.min(1000, (all[idx].campusScore || 700) + selectedCourse.scoreBoost);
      all[idx].loanLimitKobo = (all[idx].loanLimitKobo || 15000000) + 5000000; // unlocks +₦50,000 credit limit!

      const ref = `ECO-CRS-${Math.floor(100000 + Math.random() * 900000)}`;
      all[idx].transactions.unshift({
        id: `tx-crs-${Date.now()}`,
        reference: ref,
        type: "DEBIT",
        category: "BILL",
        title: `EcoSkills: ${selectedCourse.title}`,
        counterpartyName: selectedCourse.provider,
        counterpartyAccount: "ECO-SKILLS-DESK",
        amountKobo: costKobo,
        status: "SUCCESSFUL",
        narration: `Subsidized enrollment · +${selectedCourse.scoreBoost} Campus Score`,
        createdAt: "Just now",
      });

      saveUsers(all);
      setUser(all[idx]);
    }

    setIsEnrollModalOpen(false);
    setFeedback({
      type: "success",
      message: `✨ Enrolled in ${selectedCourse.title}! You gained +${selectedCourse.scoreBoost} Campus Score and your credit limit unlocked to ₦200,000!`,
    });
    setTimeout(() => setFeedback(null), 6000);
  }

  return (
    <main className={styles.container}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <a href="/" className={styles.backBtn}>
          <span>&larr;</span> Dashboard
        </a>
        <h1 className={styles.headerTitle}>Opportunity Hub</h1>
        <div className={styles.talentBadge}>
          <span>🚀</span> Ecobank FastTrack
        </div>
      </header>

      {/* ── Feedback Toast ──────────────────────────────────────────────── */}
      {feedback && (
        <div
          style={{
            background: feedback.type === "success" ? "#ECFDF5" : "#FEF2F2",
            border: `1.5px solid ${feedback.type === "success" ? "#00E676" : "#EF4444"}`,
            color: feedback.type === "success" ? "#065F46" : "#991B1B",
            borderRadius: "14px",
            padding: "0.85rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            marginBottom: "1.25rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* ── Hero Strategic Banner ───────────────────────────────────────── */}
      <section className={styles.heroBanner}>
        <div className={styles.heroTagRow}>
          <span className={styles.heroTag}>Ecobank Talent Engine</span>
          <span className={styles.heroStipendAvg}>
            Avg Stipend: <strong>₦165,000/mo</strong>
          </span>
        </div>
        <h2 className={styles.heroTitle}>Launch Your Career While in School & NYSC</h2>
        <p className={styles.heroSub}>
          Land verified fintech internships, secure top-paying NYSC PPAs with free accommodation, and master high-demand digital skills subsidized by Ecobank.
        </p>

        <div className={styles.heroPerksRow}>
          <div className={styles.perkItem}>
            <span className={styles.perkVal}>420+</span>
            <span className={styles.perkLabel}>Open Roles</span>
          </div>
          <div className={styles.perkItem}>
            <span className={styles.perkVal}>Direct Pay</span>
            <span className={styles.perkLabel}>In-App Stipends</span>
          </div>
          <div className={styles.perkItem}>
            <span className={styles.perkVal}>+50 pts</span>
            <span className={styles.perkLabel}>Campus Score Boost</span>
          </div>
        </div>
      </section>

      {/* ── Track Switcher ──────────────────────────────────────────────── */}
      <div className={styles.tabRow}>
        <button
          className={`${styles.tabBtn} ${activeTrack === "jobs" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTrack("jobs")}
        >
          <span>💼</span> Internships & NYSC PPAs
        </button>
        <button
          className={`${styles.tabBtn} ${activeTrack === "skills" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTrack("skills")}
        >
          <span>⚡</span> Subsidized Digital Skills
        </button>
      </div>

      {/* ── Track 1: Internships & PPAs ─────────────────────────────────── */}
      {activeTrack === "jobs" && (
        <>
          {/* Category Filter Pills */}
          <div className={styles.categoryPills}>
            {[
              { id: "all", label: "🌟 All Roles" },
              { id: "fasttrack", label: "⭐ Ecobank FastTrack" },
              { id: "tech", label: "💻 Tech & Product" },
              { id: "nysc", label: "🇳🇬 NYSC PPAs" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.categoryPill} ${selectedCategory === cat.id ? styles.categoryPillActive : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.cardsList}>
            {filteredJobs.map((job) => (
              <article key={job.id} className={styles.oppCard}>
                <div className={styles.oppCardHeader}>
                  <div className={styles.companyBadge}>
                    <div className={styles.companyLogoBox} style={{ background: job.logoBg }}>
                      {job.logoText}
                    </div>
                    <div>
                      <div className={styles.companyName}>{job.company}</div>
                      <div style={{ fontSize: "0.68rem", color: "#64748B" }}>{job.location}</div>
                    </div>
                  </div>
                  <span className={`${styles.oppTypeBadge} ${job.isNysc ? styles.oppTypeNysc : ""}`}>
                    {job.typeBadge}
                  </span>
                </div>

                <h3 className={styles.oppTitle}>{job.title}</h3>
                <p className={styles.oppDesc}>{job.description}</p>

                <div className={styles.oppDetailsStrip}>
                  {job.perks.map((p, idx) => (
                    <div key={idx} className={styles.detailChip}>
                      <span>✓</span> {p}
                    </div>
                  ))}
                </div>

                <div className={styles.oppActionRow}>
                  <div>
                    <div style={{ fontSize: "0.66rem", color: "#64748B", textTransform: "uppercase" }}>Monthly Stipend</div>
                    <div className={styles.stipendHighlight}>{job.stipend}</div>
                  </div>

                  <button
                    className={styles.applyBtn}
                    onClick={() => {
                      setSelectedJob(job);
                      setIsApplyModalOpen(true);
                    }}
                  >
                    <span>⚡</span> One-Click FastTrack
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* ── Track 2: Subsidized Digital Skills ("Learn & Earn") ─────────── */}
      {activeTrack === "skills" && (
        <div className={styles.cardsList}>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "14px", padding: "0.85rem 1rem", fontSize: "0.74rem", color: "#065F46", lineHeight: 1.45, marginBottom: "0.5rem" }}>
            🎓 <strong>Ecobank "Learn & Earn" Incentive:</strong> Complete any accredited certification below to boost your Campus Score by up to <strong>+50 pts</strong> and immediately unlock higher zero-interest loan eligibility!
          </div>

          {SKILL_COURSES.map((course) => (
            <article key={course.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <span className={styles.courseScoreBoostTag}>
                  ⭐ +{course.scoreBoost} Campus Score
                </span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#007749" }}>
                  {course.badge}
                </span>
              </div>

              <h3 className={styles.oppTitle}>{course.title}</h3>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginBottom: "0.5rem" }}>
                Provider: <strong>{course.provider}</strong> · {course.duration}
              </div>
              <p className={styles.oppDesc}>{course.description}</p>

              <div className={styles.oppDetailsStrip}>
                {course.skills.map((s, idx) => (
                  <div key={idx} className={styles.detailChip}>
                    <span>🔹</span> {s}
                  </div>
                ))}
              </div>

              <div className={styles.oppActionRow}>
                <div>
                  <div style={{ fontSize: "0.66rem", color: "#64748B", textTransform: "uppercase" }}>Subsidized Fee</div>
                  <div className={styles.coursePricingRow}>
                    <span className={styles.subsidizedPrice}>
                      {course.subsidizedPriceNaira === 0 ? "FREE" : `₦${course.subsidizedPriceNaira.toLocaleString()}`}
                    </span>
                    <span className={styles.retailPriceCrossed}>
                      ₦{course.retailPriceNaira.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  className={styles.applyBtn}
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsEnrollModalOpen(true);
                  }}
                >
                  <span>⚡</span> Enroll Now
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── One-Click FastTrack Modal ────────────────────────────────────── */}
      {isApplyModalOpen && selectedJob && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>FastTrack Application</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsApplyModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.76rem", color: "#64748B", marginBottom: "1rem" }}>
              Your verified academic standing and KYC records will be packaged and delivered directly to the recruitment team at <strong>{selectedJob.company}</strong>.
            </p>

            <div className={styles.fastTrackCredentialsBox}>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#007749", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                ✓ Verified Institutional Credentials
              </div>

              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Candidate</span>
                <span className={styles.credValue}>{user.fullName}</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Institution</span>
                <span className={styles.credValue}>{user.institutionName}</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Course & Level</span>
                <span className={styles.credValue}>{user.academicLevel} ({user.courseOfStudy})</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Verified CGPA</span>
                <span className={styles.credValue}>{user.cgpa || "4.25"} / 5.00</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Campus Score</span>
                <span className={styles.credValue} style={{ color: "#00C853" }}>{user.campusScore || 720} (Tier 1 Prime)</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Stipend Destination</span>
                <span className={styles.credValue}>Ecobank {user.accountNumber}</span>
              </div>
            </div>

            <button
              className={styles.primaryModalBtn}
              disabled={isSubmittingApp}
              onClick={handleConfirmFastTrack}
            >
              {isSubmittingApp ? "Submitting Verified Credentials..." : "Submit FastTrack Application &rarr;"}
            </button>
          </div>
        </div>
      )}

      {/* ── Enroll Course Modal ─────────────────────────────────────────── */}
      {isEnrollModalOpen && selectedCourse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Subsidized Course Enrollment</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsEnrollModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#001F3F", marginBottom: "0.25rem" }}>
                {selectedCourse.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: "0.75rem" }}>
                Accredited by: {selectedCourse.provider}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 800 }}>
                <span>Subsidized Amount:</span>
                <span style={{ color: "#007749" }}>
                  {selectedCourse.subsidizedPriceNaira === 0 ? "FREE (100% Ecobank Sponsored)" : `₦${selectedCourse.subsidizedPriceNaira.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "12px", padding: "0.75rem", marginBottom: "1.25rem", fontSize: "0.74rem", color: "#065F46" }}>
              🚀 Enrolling awards <strong>+{selectedCourse.scoreBoost} Campus Score</strong> points to your account and unlocks +₦50,000 extra loan capacity!
            </div>

            <button
              className={styles.primaryModalBtn}
              onClick={handleConfirmEnrollment}
            >
              Confirm Enrollment &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <nav className={styles.bottomNav} aria-label="Main navigation">
        <a href="/" className={styles.bottomNavItem}>
          <span style={{ fontSize: "1.1rem" }}>🏠</span>
          <span>Home</span>
        </a>
        <a href="/marketplace" className={styles.bottomNavItem}>
          <span style={{ fontSize: "1.1rem" }}>🛍️</span>
          <span>Market</span>
        </a>
        <a href="/opportunities" className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
          <span style={{ fontSize: "1.1rem" }}>💼</span>
          <span>Opportunities</span>
        </a>
        <a href="/loans" className={styles.bottomNavItem}>
          <span style={{ fontSize: "1.1rem" }}>🎓</span>
          <span>Loans</span>
        </a>
        <button
          type="button"
          className={styles.bottomNavItem}
          onClick={() => {
            localStorage.removeItem("ecocampus_active_user_id_v5");
            router.push("/login");
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </main>
  );
}
