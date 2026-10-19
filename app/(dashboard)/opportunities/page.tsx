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
import { BottomNav } from "@/components/navigation/BottomNav";
import { CompanyLogo } from "@/components/brand/CompanyLogo";
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
    typeBadge: "Ecobank FastTrack",
    stipend: "₦180,000/mo",
    location: "Abuja / Lagos (Hybrid)",
    deadline: "Nov 30, 2026",
    description: "Enterprise fintech and omnichannel core banking systems engineering.",
  },
  {
    id: "opp-2",
    company: "Paystack MFB",
    logoText: "PS",
    logoBg: "#00C3F8",
    title: "Core Backend & Payment Systems Intern",
    category: "tech",
    typeBadge: "Tech Internship",
    stipend: "₦160,000/mo",
    location: "Lagos (Remote Friendly)",
    deadline: "Dec 15, 2026",
    description: "High-performance payment switches, webhooks, and direct debit integrations.",
  },
  {
    id: "opp-3",
    company: "Federal Ministry of Innovation",
    logoText: "FM",
    logoBg: "#059669",
    title: "NYSC Digital Economy Research Fellow",
    category: "nysc",
    typeBadge: "NYSC PPA",
    isNysc: true,
    stipend: "₦77k Fed + ₦65k Allowance",
    location: "Abuja (FCT)",
    deadline: "Batch A 2026",
    description: "Place of Primary Assignment (PPA) with monthly agency allowance and quarters.",
  },
  {
    id: "opp-4",
    company: "Flutterwave",
    logoText: "FL",
    logoBg: "#FF6600",
    title: "Product Design & FinTech UX Apprentice",
    category: "tech",
    typeBadge: "Product Internship",
    stipend: "₦150,000/mo",
    location: "Remote (Nigeria)",
    deadline: "Nov 28, 2026",
    description: "Digital checkout design, user experience flows, and mobile banking interfaces.",
  },
  {
    id: "opp-5",
    company: "Andela",
    logoText: "AN",
    logoBg: "#335EEA",
    title: "Cloud Infrastructure & DevOps Engineer Apprentice",
    category: "tech",
    typeBadge: "Cloud Apprentice",
    stipend: "₦175,000/mo",
    location: "Remote",
    deadline: "Dec 05, 2026",
    description: "Container orchestration, CI/CD pipelines, and cloud systems engineering.",
  },
];

const SKILL_COURSES: SkillCourse[] = [
  {
    id: "crs-1",
    title: "AWS Cloud Solutions Architecture & DevOps",
    provider: "AWS × Ecobank Tech Academy",
    duration: "6 Weeks",
    subsidizedPriceNaira: 4500,
    retailPriceNaira: 65000,
    scoreBoost: 50,
    badge: "93% Subsidized",
    description: "Cloud security, serverless compute, and microservices architecture.",
    skills: ["☁️ AWS Lambda", "🐳 Docker", "⚡ CloudFront", "🏗️ Terraform"],
  },
  {
    id: "crs-2",
    title: "FinTech Product Analytics & SQL",
    provider: "Ecobank Analytics Desk",
    duration: "4 Weeks",
    subsidizedPriceNaira: 0,
    retailPriceNaira: 40000,
    scoreBoost: 40,
    badge: "Free for 200L+",
    description: "Cohort analysis, customer lifetime value, and automated risk scoring models.",
    skills: ["📊 SQL", "📈 Cohort Analytics", "📉 PowerBI", "💳 Credit Scoring"],
  },
  {
    id: "crs-3",
    title: "Full-Stack Next.js 15 & Banking Systems",
    provider: "Modern Web Labs",
    duration: "8 Weeks",
    subsidizedPriceNaira: 3500,
    retailPriceNaira: 45000,
    scoreBoost: 50,
    badge: "Subsidized",
    description: "Financial application architecture with TypeScript, React, and NIBSS standards.",
    skills: ["⚡ Next.js 15", "🔷 TypeScript", "🎨 CSS Modules", "🏦 NIBSS Rails"],
  },
];

function playSuccessSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  } catch {
    // Audio unsupported or blocked by browser policy
  }
}

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

  // In-viewport Floating Feedback Toast
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

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

      playSuccessSound();
      setFeedback({
        type: "success",
        title: "FastTrack Application Submitted!",
        message: `Your verified institutional credentials for ${selectedJob.title} were delivered to ${selectedJob.company} (+${boost} Campus Score)!`,
      });
      setTimeout(() => setFeedback(null), 6000);
    }, 1000);
  }

  // Handle Course Enrollment & Score Boost
  function handleConfirmEnrollment() {
    if (!selectedCourse) return;
    const costKobo = Math.round(selectedCourse.subsidizedPriceNaira * 100);

    if (user!.balanceKobo < costKobo) {
      setFeedback({
        type: "error",
        title: "Insufficient Balance",
        message: "Insufficient account balance to enroll in this subsidized course.",
      });
      setTimeout(() => setFeedback(null), 5000);
      return;
    }

    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user!.id);
    if (idx !== -1) {
      all[idx].balanceKobo -= costKobo;
      all[idx].campusScore = Math.min(1000, (all[idx].campusScore || 700) + selectedCourse.scoreBoost);
      all[idx].loanLimitKobo = (all[idx].loanLimitKobo || 15000000) + 5000000;

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
    playSuccessSound();
    setFeedback({
      type: "success",
      title: "Enrollment Confirmed!",
      message: `Enrolled in ${selectedCourse.title}! You gained +${selectedCourse.scoreBoost} Campus Score points and unlocked extra loan capacity!`,
    });
    setTimeout(() => setFeedback(null), 6000);
  }

  return (
    <main className={styles.container}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <a href="/" className={styles.backBtn}>
            <span>&larr;</span> Dashboard
          </a>
          <h1 className={styles.headerTitle}>Opportunities</h1>
        </div>
      </header>

      {/* ── Track Switcher ──────────────────────────────────────────────── */}
      <div className={styles.tabRow}>
        <button
          className={`${styles.tabBtn} ${activeTrack === "jobs" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTrack("jobs")}
        >
          Internships & NYSC PPAs
        </button>
        <button
          className={`${styles.tabBtn} ${activeTrack === "skills" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTrack("skills")}
        >
          Subsidized Digital Skills
        </button>
      </div>

      {/* ── Track 1: Internships & PPAs ─────────────────────────────────── */}
      {activeTrack === "jobs" && (
        <>
          {/* Category Filter Pills */}
          <div className={styles.categoryPills}>
            {[
              { id: "all", label: "All" },
              { id: "fasttrack", label: "FastTrack" },
              { id: "tech", label: "Tech" },
              { id: "nysc", label: "NYSC" },
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
                    <CompanyLogo company={job.company} size={36} />
                    <div>
                      <div className={styles.companyName}>{job.company}</div>
                      <div style={{ fontSize: "0.68rem", color: "#64748B" }}>{job.location}</div>
                    </div>
                  </div>
                </div>

                <h3 className={styles.oppTitle}>{job.title}</h3>
                <p className={styles.oppDesc}>{job.description}</p>

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
                    Apply
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
          {SKILL_COURSES.map((course) => (
            <article key={course.id} className={styles.courseCard}>
              <h3 className={styles.oppTitle}>{course.title}</h3>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginBottom: "0.5rem" }}>
                {course.provider} · {course.duration}
              </div>
              <p className={styles.oppDesc}>{course.description}</p>

              {/* Minimalist Tags with Skills Emojis */}
              <div className={styles.tagsRow}>
                {course.skills.map((s, idx) => (
                  <span key={idx} className={styles.skillTagPill}>
                    {s}
                  </span>
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
                  Apply
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
                Institutional Credentials
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
              {isSubmittingApp ? "Submitting Application..." : "Submit Application"}
            </button>
          </div>
        </div>
      )}

      {/* ── Enroll Course Modal ─────────────────────────────────────────── */}
      {isEnrollModalOpen && selectedCourse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Course Application</h3>
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
                  {selectedCourse.subsidizedPriceNaira === 0 ? "FREE (Ecobank Sponsored)" : `₦${selectedCourse.subsidizedPriceNaira.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "12px", padding: "0.75rem", marginBottom: "1.25rem", fontSize: "0.74rem", color: "#065F46" }}>
              Enrolling awards <strong>+{selectedCourse.scoreBoost} Campus Score</strong> points to your account and unlocks +₦50,000 extra loan capacity.
            </div>

            <button
              className={styles.primaryModalBtn}
              onClick={handleConfirmEnrollment}
            >
              Confirm Application
            </button>
          </div>
        </div>
      )}

      {/* ── Fixed Floating In-Viewport Success Notification ─────────────── */}
      {feedback && (
        <div className={styles.fixedSuccessToast} role="status">
          <div className={styles.toastLeft}>
            <div className={styles.toastIconBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <div className={styles.toastTitle}>{feedback.title}</div>
              <div className={styles.toastSub}>{feedback.message}</div>
            </div>
          </div>
          <button
            className={styles.toastCloseBtn}
            onClick={() => setFeedback(null)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <BottomNav activeTab="opportunities" />
    </main>
  );
}
