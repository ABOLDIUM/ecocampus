// ============================================================================
// ECOCAMPUS MASTER PITCH DECK & EXECUTIVE REHEARSAL SUITE — APP/PITCH-DECK/PAGE.TSX
// Clean Light Corporate | 7-Slide Master Deck for Ecobank Hackathon Judges
// Prepared for: ADEBANKE Oladejo, VICTOR Yalokwu, BABAWALE John
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React from "react";
import styles from "./pitch.module.css";

interface SlideData {
  number: number;
  category: string;
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
    category: "Strategic Vision",
    title: "EcoCampus: The Youth Financial Operating System",
    hook: "Transforming Ecobank Blaze from a basic youth debit card into an indispensable daily ecosystem where 2.5 million Nigerian undergraduates and 350,000 corps members live, trade, upskill, and launch their careers.",
    time: "45 Seconds",
    bullets: [
      {
        heading: "Beyond a Loan Platform (An Integrated Financial Ecosystem):",
        text: "EcoCampus is not a single-purpose lending app; it is a full financial and career operating system bridging tertiary liquidity, campus commerce, and post-graduate corporate employment into one unified mobile experience.",
      },
      {
        heading: "Ecobank Blaze 2.0 Integration:",
        text: "While traditional banks treat students as low-yield accounts with zero activity, EcoCampus embeds Ecobank directly into the daily campus workflow—from bursary tuition financing to hostel commerce and corporate job placement.",
      },
      {
        heading: "Early-Adopter Virality & Identity:",
        text: "Featuring individual Pioneer Member credentials (e.g., #000247) and gamified Campus Credit Scores (0–1000) that establish psychological pride and immediate network effects across campuses.",
      },
    ],
    visualSuggestion: "Left: Heavy bold typography, Ecobank Blaze co-branded badge, and executive team credentials; Right: High-resolution mobile mockup showcasing the live Home Dashboard with the #000247 pioneer badge and 720 Campus Score ring.",
    imageSrc: "/pitch/dashboard.png",
    imageCaption: "Live Production Dashboard: Pioneer Badge #000247, 720 Campus Score, and live Ecobank Rails",
    script: "Good day, esteemed judges—Adebanke Oladejo, Victor Yalokwu, and Babawale John. Today, we are proud to introduce EcoCampus: the next-generation youth financial and career operating system built natively on Ecobank. Traditional youth banking in Nigeria has historically been reduced to issuing a plastic debit card with zero engagement. EcoCampus transforms the Ecobank Blaze youth vision into the daily platform where 2.5 million undergraduates and 350,000 corps members manage their financial and academic lives. By integrating 24-48hr zero-interest tuition liquidity, fraud-free campus escrow commerce, and direct corporate recruitment pipelines, we onboard the next generation of lifelong corporate and commercial banking clients today.",
  },
  {
    number: 2,
    category: "Problem Architecture",
    title: "The Macro Crisis: Structural Failure in Tertiary Education Financing",
    hook: "Nigerian students aren't failing because they lack ambition; they are trapped by broken, slow, and predatory institutional frameworks.",
    time: "60 Seconds",
    bullets: [
      {
        heading: "The NELFUND Distribution Bottleneck:",
        text: "Federal student loans suffer from 3-to-6 months of administrative delay, extensive paper verification, and single-purpose limitations that fail students during emergency semester exam deadlines.",
      },
      {
        heading: "Predatory 30% APR Loan Sharks:",
        text: "Desperate students turn to unregulated digital loan sharks charging 25%–35% monthly interest, resulting in vicious debt traps, aggressive contact list harassment, and academic dropout.",
      },
      {
        heading: "Rampant Peer-to-Peer Campus Fraud:",
        text: "Buying and selling textbooks, project laptops, and hostel gear through campus WhatsApp groups carries extreme fraud risk, with fake bank alerts and delivery ghosting.",
      },
      {
        heading: "The Post-Graduation NYSC Cliff:",
        text: "350,000 annual corps members face rising urban living costs on a ₦77,000 monthly allowance, with zero access to equipment financing to transition into knowledge-economy jobs.",
      },
    ],
    visualSuggestion: "Left: High-contrast comparison metrics highlighting NELFUND's 3–6 month delay vs predatory 30% APR apps; Right: Live production screenshot of the Underwriting and Risk Evaluation dashboard showing instant qualification vs federal backlog.",
    imageSrc: "/pitch/loans.png",
    imageCaption: "Live Underwriting & Risk Evaluation: Real-Time Eligibility vs 3-6 Month Federal Backlog",
    script: "To grasp why EcoCampus is essential, look at the reality confronting a 200-level student in Nigeria today. When tuition deadlines hit, NELFUND takes three to six months to process applications—far too late to sit for exams. Their desperate alternative? Predatory digital loan apps charging 30% monthly interest with ruthless public shaming. Meanwhile, campus commerce on WhatsApp carries constant risk of fake bank alerts, and 350,000 annual graduates entering NYSC face urban living costs with an allowance that cannot purchase a work laptop. This is not simply a student dilemma; it is a structural barrier to African human capital development.",
  },
  {
    number: 3,
    category: "Core Product",
    title: "The Core Engine: Zero-Interest Financing & Safe Campus Escrow",
    hook: "Moving beyond single-purpose lending into daily banking utility, verified academic standing, and zero-default risk infrastructure.",
    time: "75 Seconds",
    bullets: [
      {
        heading: "Zero-Interest Undergrad (200L+) & NYSC Advances:",
        text: "Undergrads access ₦20,000 to ₦250,000 at 0.0% APR disbursed in 24 to 48 hours straight to university bursaries, eliminating fund diversion. NYSC corps members access up to ₦500,000 equipment advances automated via allowance splits.",
      },
      {
        heading: "CBN Global Standing Instruction (GSI) via NIBSS:",
        text: "Digital mandate executed under CBN Circular BSD/DIR/GEN/LAB/13/053. Borrowers authorize automated multi-account recourse across all 30+ commercial banks via BVN, bringing institutional default risk near zero without traditional collateral.",
      },
      {
        heading: "EcoMarketplace with Ecobank Smart Escrow:",
        text: "Peer-to-peer campus commerce protected by a 4-digit cryptographic OTP handover code. Buyer funds remain securely locked in the Ecobank Escrow Vault until physical inspection on campus.",
      },
      {
        heading: "Proprietary Campus Score (0–1000):",
        text: "Transparent multi-factor algorithmic underwriting: 35% Academic Standing (CGPA), 25% Savings discipline, 25% Institutional KYC biometrics, and 15% Campus Marketplace reputation.",
      },
    ],
    visualSuggestion: "Left: Three-pillar architectural diagram showing how Loans, Marketplace, and Opportunities feed the central Campus Score; Right: Production screenshot of the EcoMarket with Ecobank Escrow Protected badge and inspection handover codes.",
    imageSrc: "/pitch/marketplace.png",
    imageCaption: "EcoMarket with Ecobank Escrow Protection: Verified Students, Inspection Codes & Safe P2P Trade",
    script: "For Chief Information Officer Adebanke Oladejo and CTO Babawale John, let us examine the operational engine. EcoCampus is not a loan platform—it is an ecosystem. Pillar One: Zero-interest financing disbursed directly to school bursaries in 24 to 48 hours. Pillar Two: Risk management without collateral. We implement the Central Bank of Nigeria's Global Standing Instruction mandate via NIBSS. If a borrower defaults post-graduation, Ecobank holds legally enforceable automated recourse across any bank account linked to their BVN. Pillar Three: EcoMarketplace with Ecobank Smart Escrow. When students trade laptops or textbooks, funds remain locked in Ecobank's vault until an in-person 4-digit OTP exchange, completely eliminating fake-transfer fraud while mobilizing sticky non-interest-bearing deposit float.",
  },
  {
    number: 4,
    category: "Talent Retention",
    title: "The Talent Bridge: Mitigating African Brain Drain Through Opportunity Hub",
    hook: "Capital without career placement accelerates emigration; EcoCampus pairs educational financing with local corporate placement across Ecobank's Pan-African network.",
    time: "60 Seconds",
    bullets: [
      {
        heading: "Direct Corporate Recruitment FastTracks:",
        text: "Pre-screened academic high-achievers (CGPA 3.5+) matched directly with graduate trainee programs at Ecobank Nigeria, Paystack MFB, and multinational corporate partners.",
      },
      {
        heading: "Subsidized Digital Skills ('Learn & Earn'):",
        text: "Sponsored industry certifications (Next.js, Python for Financial Engineering, SQL, AWS) subsidized through corporate CSR that directly boost the student's Campus Credit Score and loan limits.",
      },
      {
        heading: "NYSC High-Allowance PPA Matcher:",
        text: "Connecting corps members to technology-driven places of primary assignment offering monthly agency top-up stipends (₦160,000 - ₦180,000/mo) to guarantee loan liquidation and high savings accumulation.",
      },
      {
        heading: "Stemming the Brain-Drain Wave:",
        text: "Retaining top African technical and financial talent within the domestic and Pan-African economy by providing clear, funded domestic career trajectories.",
      },
    ],
    visualSuggestion: "Left: Talent retention pipeline showing Undergrad Upskilling -> Corporate Internship Matching -> Retained African Workforce; Right: Production screenshot of the Opportunity Hub showing Ecobank and Paystack FastTrack applications.",
    imageSrc: "/pitch/opportunities.png",
    imageCaption: "Opportunity Hub: Ecobank FastTrack, Paystack MFB, and Subsidized Digital Skills Tracks",
    script: "Financing tuition is meaningless if graduating scholars face 40% youth underemployment and are forced into the 'Japa' brain-drain wave. Pillar Three of EcoCampus is the Opportunity Hub. We bridge students directly into high-paying graduate careers. Ecobank Nigeria and corporate partners like Paystack MFB access pre-screened, high-CGPA candidates through our verified FastTrack pipeline. We subsidize practical digital certifications—from Next.js to financial engineering—that immediately boost the student's Campus Score. By guaranteeing that financing is paired with career placement, we ensure loans are repaid while retaining Africa's brightest minds inside the continent.",
  },
  {
    number: 5,
    category: "Commercial Viability",
    title: "Why Ecobank Wins: Compounding SROI & Commercial Balance Sheet Offsets",
    hook: "While zero-interest student lending operates at zero direct profit, the Social Return on Investment and commercial balance sheet offsets create an unbeatable institutional moat.",
    time: "75 Seconds",
    bullets: [
      {
        heading: "Generational Lifetime Value (LTV) at Near-Zero CAC:",
        text: "Retail banking CAC in Nigeria exceeds ₦12,000 per user. EcoCampus acquires students at near-zero organic CAC through campus word-of-mouth. Beneficiaries enter deep generational brand loyalty with 30+ year customer retention as they graduate into corporate salary earners, mortgage holders, and SME commercial banking clients.",
      },
      {
        heading: "Sticky Escrow Vault Deposit Float:",
        text: "Tens of thousands of active campus marketplace transactions generate a massive, non-interest-bearing operational liquidity pool residing directly inside Ecobank's escrow vault.",
      },
      {
        heading: "100% Post-Graduate Salary Domiciliation:",
        text: "Graduates who obtained tuition liquidity and corporate internships naturally maintain their primary professional salary accounts with Ecobank, yielding long-term retail deposit stickiness.",
      },
      {
        heading: "Sustainable NYSC Facility Margin:",
        text: "Corper equipment advances carry a modest 3.5% facility fee, automated via NIBSS Direct Debit with zero recovery cost and zero debt collection friction.",
      },
    ],
    visualSuggestion: "Left: Flywheel infographic showing Student Acquisition -> Campus Escrow Float -> NYSC Advance -> Corporate Salary Domiciliation; Right: High-contrast unit economics card showing CAC reduction, deposit mobilization, and 30-year retention horizon.",
    imageSrc: "/pitch/dashboard.png",
    imageCaption: "Lifetime Retention Model: From 200L Student to Ecobank Corporate Salary Account Domiciliation",
    script: "Head of Products Victor Yalokwu will appreciate our unit economics. While student loans operate at zero direct profit, the commercial offsets are compounding. First: Customer Acquisition Cost arbitrage. Retail banks spend over ₦12,000 to acquire a customer who may churn within months. EcoCampus acquires 200-level undergraduates at near-zero CAC because the product is viral. When these students graduate into corporate employment, their primary salary accounts are domiciled with Ecobank for the next 30 years. Second: Deposit Float. Hundreds of thousands of daily campus trades lock liquidity in Ecobank's Escrow Vault, generating interest-free operational float. Third: NYSC advances yield a sustainable 3.5% facility fee collected automatically via NIBSS. This is the ultimate lifetime customer acquisition engine.",
  },
  {
    number: 6,
    category: "Continental Scale",
    title: "The Pan-African Blueprint: The Premier PPP Execution Partner for NELFUND & AU",
    hook: "Positioning Ecobank not merely as a commercial lender, but as the premier institutional execution engine for sovereign and continental educational funds.",
    time: "60 Seconds",
    bullets: [
      {
        heading: "Turnkey Implementation Partner for NELFUND:",
        text: "Solves the federal student loan fund's 3-to-6 month distribution lag by providing the vetted digital disbursement, student KYC, and GSI loan monitoring interface.",
      },
      {
        heading: "African Union Educational Initiative Alignment:",
        text: "Scalable across Ecobank's unmatched footprint of 33 African nations, enabling cross-border tuition settlement, regional scholarship disbursement, and multi-country academic mobility via Ecobank RapidTransfer.",
      },
      {
        heading: "ESG & Concessional Development Capital:",
        text: "Positions Ecobank at the forefront of UN Sustainable Development Goals (SDG 4: Quality Education, SDG 8: Decent Work & Economic Growth), unlocking international concessional funding and development finance institution (DFI) partnerships.",
      },
      {
        heading: "Pan-African Financial Integration:",
        text: "Seamless cross-border student remittances across West and Central African scholar corridors, eliminating currency friction.",
      },
    ],
    visualSuggestion: "Left: Pan-African expansion blueprint highlighting 33 Ecobank countries and RapidTransfer cross-border tuition rails; Right: Screenshot of the GSI-authorized institutional credit framework.",
    imageSrc: "/pitch/loans.png",
    imageCaption: "Federal GSI Integration & Institutional Verification Architecture",
    script: "Beyond retail banking, EcoCampus positions Ecobank as the premier Public-Private Partnership execution partner for sovereign and Pan-African entities. NELFUND possesses statutory funding but lacks agile digital delivery rails. EcoCampus is the ready-made execution engine that automates student verification, bursary disbursement, and GSI loan tracking. Furthermore, across Ecobank's 33 African markets, EcoCampus provides the blueprint for the African Union's Educational Initiative—enabling cross-border student remittances and regional tuition settlements through Ecobank RapidTransfer. By backing EcoCampus, Ecobank leads continental financial integration and youth economic empowerment.",
  },
  {
    number: 7,
    category: "Execution & The Ask",
    title: "Execution Roadmap & The Ask: Reimagining Possibilities for African Youth",
    hook: "EcoCampus is fully engineered, tested, and operational today. We present a clear, 3-phase execution roadmap and a concrete partnership ask.",
    time: "45 Seconds",
    bullets: [
      {
        heading: "Phase 1 (Months 1–6) — 5-University Flagship Pilot:",
        text: "Deploy at University of Abuja, UNILAG, UI, OAU, and ABU Zaria. Target: 100,000 verified student accounts, ₦500M in escrow GMV, and direct school bursary integration.",
      },
      {
        heading: "Phase 2 (Months 7–12) — National NYSC Camp Rollout:",
        text: "Nationwide deployment across 37 NYSC orientation camps, issuing co-branded Ecobank Blaze cards with pre-approved equipment advances.",
      },
      {
        heading: "Phase 3 (Year 2+) — Pan-African Continental Scale:",
        text: "Replicate the model in Ghana, Kenya, Côte d'Ivoire, and Senegal via Ecobank's unified banking rails and RapidTransfer student remittance.",
      },
      {
        heading: "The Ask to Ecobank Leadership:",
        text: "(1) Core Banking Sandbox API access for Ecobank OmniCore & NIBSS GSI Switch; (2) Greenlight for the 5-university campus pilot under Ecobank Blaze sponsorship; (3) Official onboarding of Opportunity Hub into Ecobank Group HR graduate recruitment.",
      },
    ],
    visualSuggestion: "Left: 3-phase horizontal roadmap with clear user acquisition and escrow targets; Right: The 3-part partnership ask for Ecobank executive leadership.",
    imageSrc: "/pitch/opportunities.png",
    imageCaption: "Fully Functional Production Platform: Ready for Immediate Pilot Deployment",
    script: "To conclude: EcoCampus is not a concept or theoretical presentation. Every feature—from GSI mandate execution to escrow OTP validation and FastTrack career matching—is fully functional in our codebase right now. Our ask to Ecobank executive leadership today is three-fold: First, grant sandbox API credentials to connect with Ecobank OmniCore and the NIBSS GSI Switch. Second, greenlight our Phase 1 pilot across 5 flagship universities under Ecobank Blaze sponsorship. And third, partner with our Opportunity Hub to hire Nigeria's brightest student talent. Together, let us empower the next generation of African leaders to Learn, Grow, and Achieve. Thank you!",
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
          <span className={styles.ecobankBadge}>ECOBANK HACKATHON 2026</span>
          <h1 className={styles.deckMainTitle}>EcoCampus Master Pitch Deck & Speaker Rehearsal Suite</h1>
        </div>

        <div className={styles.controlsRow}>
          <a
            href="/EcoCampus_Master_Pitch_Deck.pptx"
            download="EcoCampus_Master_Pitch_Deck.pptx"
            className={styles.downloadPptxBtn}
            id="download-pptx-btn"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PowerPoint (.pptx)
          </a>

          <button className={styles.printBtn} onClick={handlePrint} id="print-pdf-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Save as PDF (Print)
          </button>
        </div>
      </nav>

      {/* ── 7-Slide Deck Presentation ────────────────────────────────────── */}
      <main className={styles.deckWrapper}>
        {SLIDES.map((slide) => (
          <article key={slide.number} className={styles.slideCard} id={`slide-${slide.number}`}>
            {/* Slide Header Bar */}
            <div className={styles.slideHeaderBar}>
              <span className={styles.slideNumberPill}>Slide {slide.number} of 7</span>
              <div className={styles.speakingTimePill}>
                <span>Presentation Time:</span>
                <strong>{slide.time}</strong>
              </div>
            </div>

            {/* Slide Body */}
            <div className={styles.slideBody}>
              <div className={styles.categoryTag}>{slide.category}</div>
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
                      <span className={styles.bulletDot} />
                      <div>
                        <strong className={styles.bulletHeading}>{b.heading}</strong>
                        <span className={styles.bulletText}>{b.text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Preview Column */}
                <div className={styles.visualPreviewCol}>
                  <div className={styles.visualHeader}>
                    <span>On-Screen Visual Layout</span>
                    <span className={styles.visualVerified}>Production Screen</span>
                  </div>

                  <div className={styles.imageFrame}>
                    <img
                      src={slide.imageSrc}
                      alt={slide.title}
                      className={styles.previewImg}
                    />
                  </div>

                  <div className={styles.imageCaption}>
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
                  Speaker Rehearsal Script ({slide.time})
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
