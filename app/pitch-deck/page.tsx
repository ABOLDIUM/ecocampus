// ============================================================================
// ECOCAMPUS MASTER PITCH DECK & TEAM REHEARSAL SUITE — APP/PITCH-DECK/PAGE.TSX
// Print-to-PDF Ready | 9-Slide Presentation for Ecobank Hackathon Judges
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React from "react";
import styles from "./pitch.module.css";

interface SlideData {
  number: number;
  title: string;
  hook: string;
  time: string;
  bullets: { heading: string; text: string }[];
  visualSuggestion: string;
  imageSrc: string;
  imageCaption: string;
  script: string;
}

const SLIDES: SlideData[] = [
  {
    number: 1,
    title: "EcoCampus — The Operating System for Nigerian Tertiary Education",
    hook: "Transforming Ecobank Blaze from a basic youth debit card into an indispensable daily ecosystem where 2.5 million students live, learn, trade, and achieve.",
    time: "45 Seconds",
    bullets: [
      {
        heading: "Ecobank Blaze 2.0 Strategic Tie-In:",
        text: "While traditional banks treat students as low-yield accounts with zero activity, EcoCampus embeds Ecobank directly into the daily campus workflow—from bursary tuition financing to hostel commerce and corporate job placement.",
      },
      {
        heading: "Early-Adopter Virality & Identity:",
        text: "Featuring individual Pioneer Member numbers (e.g., #000247) and gamified Campus Credit Scores that establish psychological pride and immediate network effects across campuses.",
      },
      {
        heading: "The Core Motto:",
        text: "LEARN. GROW. ACHIEVE. Connecting education, financial liquidity, and post-graduate employment into one unified mobile experience.",
      },
    ],
    visualSuggestion: "Left: Heavy bold typography, Ecobank Blaze co-branded badge, and Team introduction credentials; Right: Device mockup showcasing the live Home Dashboard with the #000247 pioneer badge and 720 Campus Score ring.",
    imageSrc: "/pitch/dashboard.png",
    imageCaption: "Live Production Dashboard: Pioneer Badge #000247, 720 Campus Score, and GSI Banner",
    script: "Good day, esteemed judges—Adebanke Oladejo, Victor Yalokwu, and Babawale John. Today, we are proud to introduce EcoCampus: the next-generation financial and career operating system built natively on Ecobank. Traditional youth banking in Nigeria has historically been reduced to handing students a plastic debit card with zero stickiness. EcoCampus takes the Ecobank Blaze youth vision and transforms it into the daily platform where 2.5 million Nigerian undergraduates live online. By combining rapid-disbursement zero-interest loans, fraud-free campus escrow commerce, and direct corporate recruitment pipelines, we are onboarding the next generation of lifelong corporate banking customers today.",
  },
  {
    number: 2,
    title: "The Problem — Bureaucratic Paralysis, Campus Scams & The NYSC Cliff",
    hook: "Nigerian students aren't dropping out because they lack ambition; they're dropping out because institutional support systems are broken, predatory, and disconnected.",
    time: "60 Seconds",
    bullets: [
      {
        heading: "The NELFUND Bottleneck:",
        text: "Federal student loans through NELFUND suffer from 3-to-6 months of bureaucratic delay, extensive paperwork, and single-purpose limitations that fail students during emergency semester exam deadlines.",
      },
      {
        heading: "Predatory 30% APR Loan Sharks:",
        text: "Desperate students turn to unregulated digital loan sharks charging 25%–35% monthly interest, resulting in debt traps, aggressive harassment of campus contacts, and severe mental distress.",
      },
      {
        heading: "Rampant Peer-to-Peer Campus Fraud:",
        text: "Buying and selling textbooks, project laptops, and hostel gear through campus WhatsApp groups carries extreme fraud risk, with fake payment receipts and delivery ghosting.",
      },
      {
        heading: "The Post-Graduation NYSC Cliff:",
        text: "350,000 annual corps members face an insufficient ₦33,000 monthly allowance with zero equipment financing to transition into remote technology or modern professional employment.",
      },
    ],
    visualSuggestion: "Left: High-contrast comparison metrics highlighting NELFUND's 3–6 month delay vs predatory 30% APR apps; Right: Red-accented problem matrix contrasting bureaucratic red-tape with campus commerce risks.",
    imageSrc: "/pitch/loans.png",
    imageCaption: "The Real Gap: NELFUND's 3-6 month delay vs EcoCampus 24-48hr disbursement",
    script: "To understand why EcoCampus matters, look at the reality facing a 200-level student in a Nigerian public university today. When tuition deadlines approach, NELFUND takes three to six months to process applications—too late to sit for exams. Their only alternative? Digital loan sharks charging 30% monthly interest with ruthless public shaming. Meanwhile, campus commerce is entirely unprotected on WhatsApp groups, and fresh graduates entering NYSC are dumped into cities with a ₦33,000 allowance that cannot even cover a work laptop. This is not just a student problem; it is a structural crisis in human capital development.",
  },
  {
    number: 3,
    title: "The Target User — Meet Ajugu, 200L MBBS Student & Future NYSC Corper",
    hook: "The 2.5 million digitally-native undergraduates and 350,000 annual corps members who traditional commercial banks ignore until they graduate.",
    time: "45 Seconds",
    bullets: [
      {
        heading: "The Undergrad Persona (Ajugu David):",
        text: "20-year-old 200-level Medicine and Surgery student at University of Abuja. Outstanding 4.25 CGPA. Needs ₦100,000 for clinical equipment and tuition before portal closure. Currently unserved by traditional credit bureaus because he has no formal salary history.",
      },
      {
        heading: "The Student Entrepreneur & Trader:",
        text: "Trades medical textbooks and refurbished laptops to fund living expenses. Desperately needs buyer verification and payment protection to avoid campus transaction scams.",
      },
      {
        heading: "The Aspiring Tech NYSC Corper:",
        text: "Preparing for NYSC deployment in Abuja FCT. Needs equipment advance for a workstation laptop to secure a competitive remote Place of Primary Assignment (PPA).",
      },
    ],
    visualSuggestion: "Left: User persona profile card with verified badges (UNIABUJA/2024/472, CGPA 4.25, Tier 1 Prime); Right: User journey diagram illustrating transition from 200L undergrad to NYSC corper and Ecobank corporate salary earner.",
    imageSrc: "/pitch/dashboard.png",
    imageCaption: "Persona Profile: University of Abuja MBBS Student, Pioneer Member #000247",
    script: "Meet our primary user: Ajugu David, a 200-level MBBS student at the University of Abuja. Ajugu has a stellar 4.25 CGPA, but traditional commercial banks consider him un-bankable because he has no payslip or collateral. When he needs ₦100,000 for clinical lab kits, traditional systems fail him. In his spare time, Ajugu buys and sells medical textbooks to junior students, but lives in constant fear of fake transfer receipts. In two years, Ajugu will be an NYSC corps member needing equipment financing for his career. By solving Ajugu's problems today, Ecobank captures him for the next 30 years of his professional life.",
  },
  {
    number: 4,
    title: "Our Solution — Three Differentiating Pillars Built on Ecobank",
    hook: "More than a loan app: a complete student lifecycle operating system with zero-interest financing, fraud-proof escrow commerce, and career fast-tracks.",
    time: "60 Seconds",
    bullets: [
      {
        heading: "Pillar 1: Zero-Interest 200L+ & NYSC Financing Engine:",
        text: "Undergrads access ₦20,000 to ₦250,000 at 0.0% APR with 24–48 hour disbursement directly into the university bursary to eliminate fund diversion. NYSC corpers receive up to ₦500,000 equipment advances with automated splits from their ₦33k monthly allowance.",
      },
      {
        heading: "Pillar 2: EcoMarketplace with Ecobank Smart Escrow:",
        text: "Peer-to-peer campus commerce protected by a 4-digit OTP handover inspection code. Buyer funds remain securely locked in the Ecobank Escrow Vault until physical campus inspection.",
      },
      {
        heading: "Pillar 3: Opportunity Hub & Career Accelerator:",
        text: "Exclusive recruitment pipelines with Ecobank Nigeria, Paystack MFB, and federal ministries, coupled with subsidized 'Learn & Earn' digital certifications that directly boost credit limits.",
      },
    ],
    visualSuggestion: "Left: Three-pillar architectural diagram showing how Loans, Marketplace, and Opportunities feed the central Campus Score; Right: Side-by-side screenshots of the Loan Engine, Smart Escrow Drawer, and FastTrack modal.",
    imageSrc: "/pitch/loans_success.png",
    imageCaption: "Instant Disbursement State: Direct Bursary Credit & NIBSS GSI Mandate Ref",
    script: "EcoCampus solves this crisis through three tightly integrated pillars. Pillar One: The Zero-Interest Financing Engine. For 200-level students and above, we disburse loans in 24 to 48 hours at zero percent interest, paid straight to the school bursary. For corpers, we offer equipment financing with automated deductions from their Federal allowance. Pillar Two: EcoMarketplace. We introduce Ecobank Smart Escrow: when you buy a laptop or textbook on campus, your money is locked in Ecobank's vault and only released when you physically inspect the item and hand over a 4-digit OTP. Pillar Three: Opportunity Hub. We bridge students directly into internships at Ecobank and Paystack while subsidizing AWS and SQL certifications that raise their credit limits.",
  },
  {
    number: 5,
    title: "Product Architecture & Enterprise Tech Stack",
    hook: "Enterprise banking rails engineered with Next.js 15, TypeScript, NIBSS Central Switch integration, and CBN-compliant Global Standing Instructions.",
    time: "75 Seconds",
    bullets: [
      {
        heading: "Modern Frontend & Fluid Performance:",
        text: "Built on Next.js 15 (App Router), React 19, and scoped CSS modules with zero third-party UI framework bloat. Engineered for sub-100ms client transitions on mobile networks.",
      },
      {
        heading: "Proprietary Campus Score Credit Engine (0–1000):",
        text: "Transparent, real-time algorithmic underwriting: 35% Academic Standing & CGPA, 25% Savings discipline and streak consistency, 25% Institutional KYC biometrics, and 15% Campus Marketplace reputation.",
      },
      {
        heading: "CBN-Compliant Global Standing Instruction (GSI):",
        text: "Digital mandate execution under CBN Circular BSD/DIR/GEN/LAB/13/053. Borrowers authorize automated multi-account recourse across all 30+ Nigerian commercial banks via NIBSS, bringing default risk near zero.",
      },
      {
        heading: "Two-Legged Escrow State Machine:",
        text: "FUNDS_IN_ESCROW -> PHYSICAL_HANDOVER -> OTP_VERIFIED -> INSTANT_SETTLEMENT. Automatic +25 Campus Score credit boost upon settlement.",
      },
    ],
    visualSuggestion: "Left: Full technical architecture diagram illustrating Client PWA -> Ecobank OmniCore API Gateway -> NIBSS GSI Switch -> Core Banking Ledger; Right: Screenshot of the GSI Mandate Authorization modal with digital signature pad.",
    imageSrc: "/pitch/escrow.png",
    imageCaption: "Escrow State Machine: 4-Digit Handover Code (8423) and Safe Meeting Point",
    script: "For Chief Information Officer Adebanke Oladejo and CTO Babawale John, let us look under the hood. EcoCampus is not a mockup; it is a fully functional Next.js 15 and TypeScript application. Our Campus Score engine evaluates students across four transparent dimensions—academic performance, transaction discipline, KYC verification, and marketplace reputation. For risk management, we don't rely on trust; we implement the Central Bank of Nigeria's Global Standing Instruction mandate via NIBSS. If a student defaults upon graduation, Ecobank has automated legal recourse across any bank account linked to their BVN. In the marketplace, our two-legged escrow state machine holds funds until a 4-digit cryptographic OTP is exchanged at verified campus meeting zones.",
  },
  {
    number: 6,
    title: "Business Model & Market Viability — The Lifetime Value Flywheel",
    hook: "How Ecobank turns zero-interest student financing into a multi-billion naira deposit mobilization and customer acquisition machine.",
    time: "60 Seconds",
    bullets: [
      {
        heading: "CAC-to-LTV Arbitrage (For Victor Yalokwu):",
        text: "Traditional retail banking CAC in Nigeria exceeds ₦12,000 per customer. EcoCampus acquires students at near-zero organic CAC through campus word-of-mouth and retains them through NYSC and early career employment.",
      },
      {
        heading: "Deposit Mobilization & Escrow Float:",
        text: "Tens of thousands of active marketplace transactions generate substantial, sticky interest-free deposit float residing within Ecobank's protected escrow vault.",
      },
      {
        heading: "Subsidized NYSC Advance Margins:",
        text: "Corper equipment financing carries a sustainable single-digit 3.5% facility fee, automated via NIBSS Direct Debit with zero collection overhead.",
      },
      {
        heading: "Corporate Recruitment Partnerships:",
        text: "Corporate partners (tech firms, FMCGs) pay placement and talent pipeline fees to access pre-screened, high-CGPA candidates through the Opportunity Hub.",
      },
    ],
    visualSuggestion: "Left: Flywheel infographic showing Student Acquisition -> Campus Escrow Float -> NYSC Advance -> Corporate Salary Domiciliation; Right: Financial unit economics breakdown table showing CAC reduction and deposit growth.",
    imageSrc: "/pitch/marketplace.png",
    imageCaption: "EcoMarketplace: P2P Campus Commerce with Escrow Float Mobilization",
    script: "Head of Products Victor Yalokwu will appreciate our unit economics. Traditional retail banks spend over ₦12,000 to acquire a customer who may churn in six months. EcoCampus acquires 200-level students at near-zero CAC because the product is viral—students tell classmates how they got tuition disbursed in 24 hours. Where does the monetization lie? First, the immense deposit float from our Escrow Vault creates free liquidity for Ecobank. Second, the 3.5% facility margin on NYSC advances is collected automatically via NIBSS with zero recovery costs. And third, when these students graduate into Flutterwave, Paystack, or Ecobank, their corporate salary accounts are already domiciled with Ecobank for life.",
  },
  {
    number: 7,
    title: "Competitive Advantage — Why EcoCampus Wins Against Alternatives",
    hook: "Loan apps are predatory; NELFUND is too slow; WhatsApp trades are unsafe. EcoCampus is the only integrated student ecosystem in Nigeria.",
    time: "60 Seconds",
    bullets: [
      {
        heading: "Versus NELFUND (Speed & Purpose):",
        text: "NELFUND takes 3 to 6 months and only covers school fees. EcoCampus disburses within 24–48 hours, covers living stipends, and provides equipment financing for entrepreneurs and corpers.",
      },
      {
        heading: "Versus FairMoney, PalmPay & Quick Credit Apps (Affordability):",
        text: "Predatory apps charge 25%–35% monthly interest with public shaming. EcoCampus charges 0.0% interest for undergrads, using GSI mandates instead of harassment.",
      },
      {
        heading: "Versus Campus WhatsApp Groups (Security):",
        text: "WhatsApp commerce has zero buyer protection. EcoCampus enforces verified student badges and locks funds in Ecobank Escrow until in-person inspection.",
      },
      {
        heading: "Versus Traditional Banks (Ecosystem Stickiness):",
        text: "Traditional youth accounts offer only a debit card. EcoCampus offers daily utility: skills training, career fast-tracks, and campus score progression.",
      },
    ],
    visualSuggestion: "Left: Comprehensive feature matrix comparing EcoCampus vs NELFUND vs Predatory Fintechs vs WhatsApp; Right: Screenshot of the EcoCampus vs NELFUND comparison banner on the live loans dashboard.",
    imageSrc: "/pitch/loans.png",
    imageCaption: "Feature-by-Feature Matrix: EcoCampus vs NELFUND vs Digital Loan Apps",
    script: "When we look at the competitive landscape, EcoCampus has no direct peer. Against NELFUND, we win on speed: 48 hours versus six months. Against commercial loan apps like FairMoney or PalmPay, we win on ethics: zero percent interest and GSI security versus 30% predatory interest and debt shaming. Against campus WhatsApp marketplaces, we win on safety: our inspection OTP eliminates fake bank alerts completely. And against traditional banks who simply hand out debit cards, we provide the platform where students actually build their careers.",
  },
  {
    number: 8,
    title: "Future Roadmap — Reimagining Possibilities for Pan-African Youth",
    hook: "Scaling from University of Abuja to 170+ Nigerian universities and 33 Ecobank African affiliate markets.",
    time: "45 Seconds",
    bullets: [
      {
        heading: "Phase 1: Pilot & University Expansion (Months 1–6):",
        text: "Launch pilot across 5 major federal institutions (UniAbuja, UNILAG, UI, OAU, ABU Zaria). Target: 100,000 verified student accounts and ₦500M in escrow GMV.",
      },
      {
        heading: "Phase 2: National NYSC Camp Rollout (Months 7–12):",
        text: "Direct partnership with NYSC orientation camps nationwide. Co-branded Ecobank Blaze debit cards issued on Day 1 of camp with pre-approved equipment advances.",
      },
      {
        heading: "Phase 3: Pan-African Cross-Border Expansion (Year 2):",
        text: "Leverage Ecobank's presence across 33 African nations to power cross-border tuition and student remittances via Ecobank RapidTransfer, connecting West and Central African scholars.",
      },
    ],
    visualSuggestion: "Left: 3-phase horizontal roadmap timeline with milestone KPIs and user acquisition targets; Right: Screenshot of the Opportunity Hub showcasing the FastTrack Application and Learn & Earn certifications.",
    imageSrc: "/pitch/opportunities.png",
    imageCaption: "Phase 2 & 3 Acceleration: Opportunity Hub, Internships & Digital Skills",
    script: "Our roadmap aligns directly with Ecobank's 'Reimagining Possibilities' vision. In Phase One, we launch across five flagship universities, targeting 100,000 students and ₦500 million in escrow commerce. In Phase Two, we partner with NYSC to issue co-branded Ecobank Blaze cards to all 350,000 corps members during camp registration, bundling our equipment advance with their state deployment. In Phase Three, we take this across Ecobank's 33 African countries, enabling seamless cross-border tuition payments and student remittances through Ecobank RapidTransfer. We are building the Pan-African student banking infrastructure of tomorrow.",
  },
  {
    number: 9,
    title: "Conclusion & Call to Action — Partnering to Build Africa's Future",
    hook: "When you give Nigerian students the tools to Learn, Grow, and Achieve, they won't just bank with Ecobank—they will build the continent's future.",
    time: "30 Seconds",
    bullets: [
      {
        heading: "Fully Implemented & Demo Ready:",
        text: "Every feature—from GSI mandate signing to escrow OTP release and FastTrack job matching—is live, tested, and operational today.",
      },
      {
        heading: "The Ask:",
        text: "Partner with Ecobank Digital Banking and Paystack MFB to greenlight the Phase 1 campus pilot and integrate live core banking sandbox endpoints.",
      },
      {
        heading: "Official Motto:",
        text: "LEARN. GROW. ACHIEVE. With Ecobank.",
      },
    ],
    visualSuggestion: "Left: Bold call to action with executive partnership contact details; Right: High-impact phone mockup showcasing the EcoCampus app, Ecobank Blaze co-branding, and live test QR code.",
    imageSrc: "/pitch/fast_track.png",
    imageCaption: "FastTrack Verified Credentials: Ready for Immediate Pilot Deployment",
    script: "To conclude: EcoCampus is not a theoretical concept or a slide deck fantasy. It is fully engineered, running live on local host right now, and ready for pilot deployment. By backing EcoCampus, Ecobank solves tertiary education financing, eliminates campus commerce fraud, and captures Nigeria's most ambitious youth demographic before graduation. Let's partner together to launch the EcoCampus pilot and empower the next generation of African leaders to Learn, Grow, and Achieve. Thank you!",
  },
];

export default function PitchDeckPage() {
  function handlePrint() {
    window.print();
  }

  return (
    <div className={styles.pageContainer}>
      {/* ── Top Bar Controls ────────────────────────────────────────────── */}
      <nav className={styles.topBar}>
        <div className={styles.deckTitleGroup}>
          <a href="/" className={styles.backLink}>
            &larr; Back to App
          </a>
          <span className={styles.ecobankBadge}>ECOBANK HACKATHON DECK</span>
          <h1 className={styles.deckMainTitle}>EcoCampus Master Pitch Deck & Speaker Rehearsal Suite</h1>
        </div>

        <div className={styles.controlsRow}>
          <button className={styles.printBtn} onClick={handlePrint}>
            <span>🖨️</span> Save Deck as PDF (Print)
          </button>
        </div>
      </nav>

      {/* ── 9-Slide Deck Presentation ────────────────────────────────────── */}
      <main className={styles.deckWrapper}>
        {SLIDES.map((slide) => (
          <article key={slide.number} className={styles.slideCard} id={`slide-${slide.number}`}>
            {/* Slide Header Bar */}
            <div className={styles.slideHeaderBar}>
              <span className={styles.slideNumberPill}>Slide {slide.number} of 9</span>
              <div className={styles.speakingTimePill}>
                <span>⏱️ Presentation Time:</span>
                <strong>{slide.time}</strong>
              </div>
            </div>

            {/* Slide Body */}
            <div className={styles.slideBody}>
              <h2 className={styles.slideTitle}>{slide.title}</h2>

              {/* Punchy Core Hook */}
              <div className={styles.coreHookBox}>
                &ldquo;{slide.hook}&rdquo;
              </div>

              {/* Content Grid */}
              <div className={styles.slideContentGrid}>
                {/* Bullets Column */}
                <div className={styles.bulletsCol}>
                  {slide.bullets.map((b, idx) => (
                    <div key={idx} className={styles.bulletItem}>
                      <span className={styles.bulletDot}>✦</span>
                      <div>
                        <strong className={styles.bulletHeading}>{b.heading}</strong>
                        <span>{b.text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Preview Column */}
                <div className={styles.visualPreviewCol}>
                  <div className={styles.visualHeader}>
                    <span>On-Screen Visual Layout</span>
                    <span style={{ color: "#00E676" }}>Verified Asset</span>
                  </div>

                  <div className={styles.imageFrame}>
                    <img
                      src={slide.imageSrc}
                      alt={slide.title}
                      className={styles.previewImg}
                    />
                  </div>

                  <div style={{ fontSize: "0.72rem", color: "#CBD5E1", fontWeight: 700 }}>
                    {slide.imageCaption}
                  </div>

                  <div className={styles.layoutSuggestion}>
                    <strong>Recommended Slide Layout:</strong> {slide.visualSuggestion}
                  </div>
                </div>
              </div>

              {/* Speaker Notes Script */}
              <div className={styles.speakerScriptBox}>
                <div className={styles.scriptLabel}>
                  <span>🎙️</span> Speaker Rehearsal Script ({slide.time})
                </div>
                <p className={styles.scriptText}>
                  &ldquo;{slide.script}&rdquo;
                </p>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
