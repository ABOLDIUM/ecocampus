// ============================================================================
// ECOCAMPUS PUBLIC LANDING PAGE — APP/LANDING/PAGE.TSX
// MVP Conversion Landing | Light Theme | Learn. Grow. Achieve.
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

const FEATURES = [
  {
    id: "loans",
    badge: "Zero Interest",
    badgeColor: "#00C853",
    title: "Student & NYSC Financing",
    description: "Get N20,000-N500,000 at 0.0% APR directly into your school bursary or account within 24-48 hours. No collateral. No harassment. Just verified academic standing.",
    stats: [
      { label: "Interest Rate", value: "0.0% APR" },
      { label: "Disbursement", value: "24-48 hrs" },
      { label: "Max Limit", value: "N500,000" },
    ],
    image: "/public/loan.png",
  },
  {
    id: "marketplace",
    badge: "Escrow Protected",
    badgeColor: "#001F3F",
    title: "EcoMarketplace",
    description: "Buy and sell laptops, textbooks, and campus gear with Ecobank Smart Escrow. Funds are locked in a secure vault and only released when you physically inspect the item and enter a 4-digit OTP.",
    stats: [
      { label: "Fraud Rate", value: "0%" },
      { label: "Release", value: "OTP Verified" },
      { label: "Protection", value: "End-to-End" },
    ],
    image: "/public/market-place.png",
  },
  {
    id: "opportunities",
    badge: "Career Fast-Track",
    badgeColor: "#FF6600",
    title: "Opportunity Hub",
    description: "Access exclusive internships at Ecobank, Paystack, and Flutterwave. Earn subsidised digital certifications that directly boost your Campus Credit Score and loan limit.",
    stats: [
      { label: "Open Roles", value: "420+" },
      { label: "Avg Stipend", value: "N165k/mo" },
      { label: "Score Boost", value: "+50 pts" },
    ],
    image: "/public/opportunities.png",
  },
];

const FAQS = [
  { q: "Who can open an EcoCampus account?", a: "Any Nigerian student enrolled in a tertiary institution (university, polytechnic, or college of education) from 200 level and above, or any NYSC corps member with a valid state code." },
  { q: "Do I need a BVN to register?", a: "BVN is optional during registration but required when applying for a loan or NYSC equipment advance. Your NIN (National Identification Number) is mandatory for KYC compliance." },
  { q: "How does the 0% interest loan work?", a: "EcoCampus uses the CBN Global Standing Instruction (GSI) framework as collateral instead of traditional loan collateral. Your loan is secured against your BVN across all Nigerian bank accounts, enabling us to offer zero-interest financing." },
  { q: "How is escrow money protected?", a: "Buyer funds are locked in Ecobank Smart Escrow Vault upon payment. The seller cannot access them until the buyer physically inspects the item and enters a unique 4-digit OTP, ensuring zero fake-payment fraud." },
  { q: "What is a Campus Score?", a: "Campus Score (0-1000) is your financial health and academic reputation index. It is calculated from CGPA (35%), savings discipline (25%), KYC verification (25%), and marketplace reputation (15%). A higher score unlocks higher loan limits." },
  { q: "Is EcoCampus only available on mobile?", a: "EcoCampus is a mobile-first Progressive Web App (PWA) accessible from any browser. Full native Android and iOS apps are planned for Phase 2 rollout." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen(p => !p)} aria-expanded={open}>
        <span>{q}</span>
        <span className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ""}`}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      {open && <div className={styles.faqAnswer}>{a}</div>}
    </div>
  );
}


export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [count, setCount] = useState(47291);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3)), 3500);
    return () => clearInterval(id);
  }, []);

  const feature = FEATURES[activeFeature];

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link href="/landing" className={styles.navLogo}>
            <Image src="/brand/2.png" alt="EcoCampus" width={140} height={48} priority className={styles.logoImg} />
          </Link>
          <nav className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
          </nav>
          <div className={styles.navCtas}>
            <Link href="/login" className={styles.navBtnOutline} id="nav-login-btn">Sign In</Link>
            <Link href="/register" className={styles.navBtnPrimary} id="nav-register-btn">Open Account</Link>
          </div>
          <button className={styles.hamburger} onClick={() => setMobileMenuOpen(p => !p)} aria-label="Toggle menu">
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineOpen1 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineOpen2 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineOpen3 : ""}`} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#features" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#faq" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className={styles.mobileCtas}>
              <Link href="/login" className={styles.navBtnOutline} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/register" className={styles.navBtnPrimary} onClick={() => setMobileMenuOpen(false)}>Open Account</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroHeadline}>
              The Financial<span className={styles.heroHeadlineAccent}> Operating System</span><br />for Nigerian Students
            </h1>
            <p className={styles.heroSubtext}>
              Zero-interest loans in 24-48 hours. Fraud-proof campus marketplace. Career fast-tracks with top employers. Built for students and NYSC corps members.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>{count.toLocaleString()}+</span>
                <span className={styles.heroStatLabel}>Students</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>0%</span>
                <span className={styles.heroStatLabel}>Interest Rate</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>48hrs</span>
                <span className={styles.heroStatLabel}>Disbursement</span>
              </div>
            </div>
            <div className={styles.heroCtas}>
              <Link href="/register" className={styles.heroBtnPrimary} id="hero-cta-register">
                Open Free Account
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="/login" className={styles.heroBtnSecondary} id="hero-cta-login">Sign In</Link>
            </div>
    
          </div>

          <div className={styles.heroImageWrap}>
            <div className={styles.heroImageGlow} />
            <div className={styles.heroImageCard}>
              <Image src="/landing/hero-students-hd.jpg" alt="Nigerian students using EcoCampus" fill className={styles.heroImage} priority sizes="(max-width: 768px) 100vw, 50vw" />
              <div className={styles.floatCard1}>
                <div className={styles.floatCardIcon} style={{ background: "rgba(0,200,83,0.12)" }}>
                  <svg width="16" height="16" fill="none" stroke="#00C853" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <div className={styles.floatCardTitle}>Loan Approved</div>
                  <div className={styles.floatCardSub}>&#8358;150,000 &middot; 0% APR</div>
                </div>
              </div>
              <div className={styles.floatCard2}>
                <div className={styles.floatCardIcon} style={{ background: "rgba(0,31,63,0.08)" }}>
                  <svg width="16" height="16" fill="none" stroke="#001F3F" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <div>
                  <div className={styles.floatCardTitle}>Campus Score</div>
                  <div className={styles.floatCardSub}>720 &middot; Tier 1 Prime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className={styles.partnersSection} id="partners">
        <div className={styles.sectionInner}>
          <p className={styles.partnersLabel}>Backed by &amp; integrated with</p>
          <div className={styles.partnersRow}>
            <div className={styles.partnerItem}>
              <Image src="/brand/ecobank.png" alt="Ecobank" width={100} height={36} className={styles.partnerLogo} />
            </div>
            <div className={styles.partnerDivider} />
            <div className={styles.partnerItem}>
              <Image src="/brand/nysc.png" alt="NYSC" width={48} height={48} className={styles.partnerLogo} />
              <span className={styles.partnerName}>NYSC</span>
            </div>
            <div className={styles.partnerDivider} />
            <div className={styles.partnerItem}>
              <div className={styles.partnerBadge} style={{ background: "#FF6600" }}>FL</div>
              <span className={styles.partnerName}>Flutterwave</span>
            </div>
            <div className={styles.partnerDivider} />
            <div className={styles.partnerItem}>
              <div className={styles.partnerBadge} style={{ background: "#011B33" }}>PS</div>
              <span className={styles.partnerName}>Paystack MFB</span>
            </div>
            <div className={styles.partnerDivider} />
            <div className={styles.partnerItem}>
              <div className={styles.partnerBadge} style={{ background: "#1A56DB" }}>AN</div>
              <span className={styles.partnerName}>Andela</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Everything a Nigerian student needs. In one platform.</h2>
            <p className={styles.sectionSubtext}>Connecting education, financial liquidity, and post-graduate employment into one unified experience.</p>
          </div>
          <div className={styles.featureTabs}>
            {FEATURES.map((f, idx) => (
              <button key={f.id} className={`${styles.featureTab} ${activeFeature === idx ? styles.featureTabActive : ""}`} onClick={() => setActiveFeature(idx)} id={`feature-tab-${f.id}`}>
                {f.title}
              </button>
            ))}
          </div>
          <div className={styles.featureDisplay} key={feature.id}>
            <div className={styles.featureDisplayContent}>
              <h3 className={styles.featureDisplayTitle}>{feature.title}</h3>
              <p className={styles.featureDisplayDesc}>{feature.description}</p>
              <div className={styles.featureStats}>
                {feature.stats.map(s => (
                  <div key={s.label} className={styles.featureStat}>
                    <span className={styles.featureStatValue}>{s.value}</span>
                    <span className={styles.featureStatLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" className={styles.featureCta} id={`feature-cta-${feature.id}`}>
                Get Started &mdash; It&apos;s Free
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
            <div className={styles.featureDisplayImageWrap}>
              <div className={styles.featureDisplayFrame}>
                <div className={styles.browserTopBar}>
                  <span className={styles.browserDot} style={{ background: "#FF5F56" }} />
                  <span className={styles.browserDot} style={{ background: "#FFBD2E" }} />
                  <span className={styles.browserDot} style={{ background: "#27C93F" }} />
                  <span className={styles.browserAddress}>ecocampus.ng/{feature.id}</span>
                </div>
                <div className={styles.featureDisplayInner}>
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className={styles.featureDisplayImage}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* How It Works */}
      <section className={styles.howSection} id="how-it-works">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Up and running in minutes</h2>
            <p className={styles.sectionSubtext}>No branch visits. No paperwork. Just your phone and student ID.</p>
          </div>
          <div className={styles.howSteps}>
            {[
              { num: "01", title: "Create Your Account", desc: "Enter your name, email, phone number, and NIN. Takes less than 3 minutes." },
              { num: "02", title: "Verify Your Identity", desc: "Confirm your phone with a one-time OTP. Add your BVN to unlock loans and higher limits." },
              { num: "03", title: "Fund & Manage", desc: "Add money, send transfers, apply for loans, or list an item on the marketplace." },
              { num: "04", title: "Grow Your Campus Score", desc: "Complete certifications, maintain savings streaks, and build a stellar marketplace reputation." },
            ].map((step, idx) => (
              <div key={step.num} className={styles.howStep}>
                <div className={styles.howStepNum}>{step.num}</div>
                <div className={styles.howStepIcon}>
                  {idx === 0 && <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  {idx === 1 && <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  {idx === 2 && <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {idx === 3 && <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                </div>
                <h4 className={styles.howStepTitle}>{step.title}</h4>
                <p className={styles.howStepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Common Questions</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqGrid}>
            {FAQS.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner} id="cta-banner">
        <div className={styles.ctaBannerInner}>
          <div className={styles.ctaBannerGlow} />
          <div className={styles.ctaBrandWrap}>
            <Image
              src="/brand/ecocampus-logo.png"
              alt="EcoCampus"
              width={44}
              height={44}
              className={styles.ctaLogoCrest}
            />
            <span className={styles.ctaBrandText}>
              Eco<span className={styles.ctaBrandTextAccent}>Campus</span>
            </span>
          </div>
          <h2 className={styles.ctaBannerTitle}>Ready to take control of your campus finances?</h2>
          <p className={styles.ctaBannerSubtext}>Join {count.toLocaleString()}+ students already on EcoCampus. Free to get started.</p>
          <Link href="/register" className={styles.ctaBannerBtn} id="footer-cta-btn">
            Open Your Free Account
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <p className={styles.ctaBannerNote}>No collateral &middot; No hidden fees &middot; Regulated by CBN</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <Image src="/brand/2.png" alt="EcoCampus" width={120} height={42} />
              <p className={styles.footerTagline}>The financial operating system for Nigerian students and NYSC corps members. Built on Ecobank. Secured by CBN.</p>
              <div className={styles.footerEcobank}>
                <span className={styles.footerEcobankLabel}>Powered by</span>
                <Image src="/brand/ecobank.png" alt="Ecobank" width={80} height={28} />
              </div>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerLinksCol}>
                <h5 className={styles.footerLinksTitle}>Product</h5>
                <a href="#features" className={styles.footerLink}>Student Loans</a>
                <a href="#features" className={styles.footerLink}>EcoMarketplace</a>
                <a href="#features" className={styles.footerLink}>Opportunity Hub</a>
                <a href="#how-it-works" className={styles.footerLink}>How It Works</a>
              </div>
              <div className={styles.footerLinksCol}>
                <h5 className={styles.footerLinksTitle}>Account</h5>
                <Link href="/register" className={styles.footerLink}>Open Account</Link>
                <Link href="/login" className={styles.footerLink}>Sign In</Link>
                <a href="#faq" className={styles.footerLink}>FAQ</a>
              </div>
              <div className={styles.footerLinksCol}>
                <h5 className={styles.footerLinksTitle}>Legal</h5>
                <a href="#" className={styles.footerLink}>Privacy Policy</a>
                <a href="#" className={styles.footerLink}>Terms &amp; Conditions</a>
                <a href="#" className={styles.footerLink}>CBN Compliance</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>&copy; {new Date().getFullYear()} EcoCampus. A product of Ecobank Nigeria. All rights reserved.</p>
            <p className={styles.footerDisclaimer}>EcoCampus is a financial technology platform operating under Ecobank Nigeria&apos;s banking licence. Loans are subject to eligibility and credit assessment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
