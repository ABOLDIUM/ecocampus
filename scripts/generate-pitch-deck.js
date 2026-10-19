const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

async function generateDeck() {
  console.log("Initializing PPTX Generator...");
  const pres = new pptxgen();

  pres.layout = "LAYOUT_16x9";
  pres.author = "EcoCampus Engineering Team";
  pres.company = "Ecobank Nigeria";
  pres.subject = "EcoCampus Master Pitch Deck - Ecobank Hackathon 2026";
  pres.title = "EcoCampus: The Youth Financial Operating System";

  // Palette Tokens
  const C_NAVY = "001F3F";
  const C_EMERALD = "007749";
  const C_GREEN_ACCENT = "00C853";
  const C_CHARCOAL = "0F172A";
  const C_MUTED = "475569";
  const C_BG_CARD = "F8FAFC";
  const C_BORDER = "E2E8F0";
  const C_WHITE = "FFFFFF";

  const rootDir = path.resolve(__dirname, "..");
  const imgDashboard = path.join(rootDir, "public", "pitch", "dashboard.png");
  const imgLoans = path.join(rootDir, "public", "pitch", "loans.png");
  const imgMarketplace = path.join(rootDir, "public", "pitch", "marketplace.png");
  const imgOpportunities = path.join(rootDir, "public", "pitch", "opportunities.png");
  const logoEcobank = path.join(rootDir, "public", "brand", "ecobank.png");
  const logoEcoCampus = path.join(rootDir, "public", "brand", "ecocampus-logo.png");

  // Helper: Standard Slide Header
  function addSlideHeader(slide, slideNum, category, title, subtitle) {
    // Top Track Bar
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 0.45,
      w: 2.2,
      h: 0.3,
      fill: { color: C_BG_CARD },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.05,
    });
    slide.addText(`SLIDE ${slideNum} OF 7  |  ${category.toUpperCase()}`, {
      x: 0.85,
      y: 0.47,
      w: 2.1,
      h: 0.25,
      fontSize: 8.5,
      bold: true,
      color: C_EMERALD,
      fontFace: "Calibri",
    });

    // Ecobank Co-brand text
    slide.addText("ECOBANK HACKATHON 2026  ·  REIMAGINING POSSIBILITIES", {
      x: 8.5,
      y: 0.47,
      w: 4.0,
      h: 0.25,
      fontSize: 8.5,
      bold: true,
      color: C_MUTED,
      align: "right",
      fontFace: "Calibri",
    });

    // Title & Subtitle
    slide.addText(title, {
      x: 0.8,
      y: 0.82,
      w: 11.7,
      h: 0.55,
      fontSize: 22,
      bold: true,
      color: C_NAVY,
      fontFace: "Segoe UI",
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8,
        y: 1.35,
        w: 11.7,
        h: 0.35,
        fontSize: 12,
        color: C_MUTED,
        fontFace: "Calibri",
      });
    }

    // Thin accent divider
    slide.addShape(pres.ShapeType.line, {
      x: 0.8,
      y: 1.75,
      w: 11.7,
      h: 0,
      line: { color: C_BORDER, width: 1 },
    });
  }

  // ==========================================================================
  // SLIDE 1: Title & Strategic Vision
  // ==========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_WHITE };

    // Header pill
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 0.8,
      w: 3.2,
      h: 0.35,
      fill: { color: C_BG_CARD },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.05,
    });
    slide.addText("FLAGSHIP ECOBANK HACKATHON INITIATIVE", {
      x: 0.9,
      y: 0.85,
      w: 3.0,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: C_EMERALD,
      fontFace: "Calibri",
    });

    slide.addText("EcoCampus: The Youth Financial Operating System", {
      x: 0.8,
      y: 1.3,
      w: 6.8,
      h: 1.3,
      fontSize: 30,
      bold: true,
      color: C_NAVY,
      fontFace: "Segoe UI",
      lineSpacingMultiple: 1.1,
    });

    slide.addText(
      "Transforming Ecobank Blaze from a basic youth debit card into an indispensable daily ecosystem where 2.5 million Nigerian undergraduates and 350,000 corps members live, trade, upskill, and launch their careers.",
      {
        x: 0.8,
        y: 2.7,
        w: 6.5,
        h: 1.0,
        fontSize: 13,
        color: C_MUTED,
        fontFace: "Calibri",
        lineSpacingMultiple: 1.2,
      }
    );

    // Three Core Pillars Badge Box
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 3.85,
      w: 6.5,
      h: 2.1,
      fill: { color: C_BG_CARD },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.08,
    });

    const pillars = [
      {
        head: "Zero-Interest Tuition & NYSC Financing:",
        desc: "24-48hr bursary disbursement via CBN GSI multi-account recourse.",
      },
      {
        head: "EcoMarketplace with Smart Escrow:",
        desc: "Ecobank vault locks funds until 4-digit physical inspection OTP release.",
      },
      {
        head: "Opportunity Hub & Talent Retention:",
        desc: "Direct corporate hiring pipeline with Ecobank, Paystack, and top fintechs.",
      },
    ];

    let pY = 4.0;
    pillars.forEach((p) => {
      slide.addText(
        [
          { text: p.head + " ", options: { bold: true, color: C_NAVY, fontSize: 10.5 } },
          { text: p.desc, options: { color: C_MUTED, fontSize: 10.5 } },
        ],
        { x: 1.0, y: pY, w: 6.1, h: 0.55, fontFace: "Calibri" }
      );
      pY += 0.6;
    });

    // Executive Footer Credentials
    slide.addText(
      "Official Motto: LEARN. GROW. ACHIEVE.  |  Prepared for: Adebanke Oladejo, Victor Yalokwu & Babawale John",
      {
        x: 0.8,
        y: 6.35,
        w: 6.5,
        h: 0.4,
        fontSize: 9.5,
        bold: true,
        color: C_EMERALD,
        fontFace: "Calibri",
      }
    );

    // Right Side: Dashboard Mockup Image
    if (fs.existsSync(imgDashboard)) {
      slide.addImage({
        path: imgDashboard,
        x: 7.6,
        y: 1.1,
        w: 4.9,
        h: 5.6,
        sizing: { type: "contain" },
      });
    }
  }

  // ==========================================================================
  // SLIDE 2: The Macro Crisis
  // ==========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_WHITE };

    addSlideHeader(
      slide,
      2,
      "The Macro Crisis",
      "Structural Failure in Tertiary Education Financing & Youth Banking",
      "Nigerian undergraduates face systemic friction: bureaucratic delays, predatory loan apps, and career drop-off."
    );

    // Left Column: 4 Friction Pillars
    const problems = [
      {
        tag: "BUREAUCRATIC DELAYS",
        head: "NELFUND 3 to 6 Month Bottleneck",
        text: "Federal student loans suffer from prolonged administrative processing, single-purpose tuition restrictions, and paper verification that arrives months after university portal registration has closed.",
      },
      {
        tag: "PREDATORY CAPITAL",
        head: "Loan Sharks Charging 25% - 35% Monthly Interest",
        text: "Desperate students turn to unregulated digital loan apps. Unmanageable debt traps lead to aggressive contact list shaming, institutional stigma, and academic abandonment.",
      },
      {
        tag: "UNPROTECTED COMMERCE",
        head: "Campus P2P Fraud on WhatsApp & Social Feeds",
        text: "Textbook exchanges, refurbished laptop sales, and hostel essentials carry severe transaction risk: fake bank alerts, delivery ghosting, and zero buyer or seller recourse.",
      },
      {
        tag: "THE NYSC CLIFF",
        head: "Post-Graduation Drop-off on ₦77,000 Allowance",
        text: "350,000 annual corps members face high urban relocation costs with zero equipment financing to acquire laptops or tools needed for remote technology employment.",
      },
    ];

    let yPos = 2.0;
    problems.forEach((item) => {
      slide.addShape(pres.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 7.2,
        h: 1.1,
        fill: { color: C_BG_CARD },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.05,
      });

      slide.addText(item.tag, {
        x: 1.0,
        y: yPos + 0.1,
        w: 6.8,
        h: 0.2,
        fontSize: 8,
        bold: true,
        color: "DC2626",
        fontFace: "Calibri",
      });

      slide.addText(item.head, {
        x: 1.0,
        y: yPos + 0.3,
        w: 6.8,
        h: 0.28,
        fontSize: 12,
        bold: true,
        color: C_NAVY,
        fontFace: "Segoe UI",
      });

      slide.addText(item.text, {
        x: 1.0,
        y: yPos + 0.58,
        w: 6.8,
        h: 0.45,
        fontSize: 9.5,
        color: C_MUTED,
        fontFace: "Calibri",
        lineSpacingMultiple: 1.15,
      });

      yPos += 1.22;
    });

    // Right Column: Key Contrasts & Impact Box
    slide.addShape(pres.ShapeType.rect, {
      x: 8.3,
      y: 2.0,
      w: 4.2,
      h: 4.75,
      fill: { color: C_NAVY },
      rectRadius: 0.08,
    });

    slide.addText("THE COMMERCIAL BANKING GAP", {
      x: 8.6,
      y: 2.3,
      w: 3.6,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: C_GREEN_ACCENT,
      fontFace: "Calibri",
    });

    slide.addText("Why Traditional Retail Banks Fail Nigerian Students:", {
      x: 8.6,
      y: 2.7,
      w: 3.6,
      h: 0.6,
      fontSize: 15,
      bold: true,
      color: C_WHITE,
      fontFace: "Segoe UI",
    });

    const bankGaps = [
      { num: "01", text: "Banks treat students as zero-revenue account holders, issuing inert plastic cards with no utility." },
      { num: "02", text: "No salary slip or fixed collateral means traditional credit scoring marks students as un-bankable." },
      { num: "03", text: "Customer Acquisition Cost (CAC) exceeds ₦12,000 per user when trying to recruit graduates post-NYSC." },
      { num: "04", text: "Zero integration with campus bursaries leaves tuition liquidity completely unserved." },
    ];

    let gapY = 3.5;
    bankGaps.forEach((g) => {
      slide.addText(g.num, {
        x: 8.6,
        y: gapY,
        w: 0.5,
        h: 0.4,
        fontSize: 13,
        bold: true,
        color: C_GREEN_ACCENT,
        fontFace: "Segoe UI",
      });
      slide.addText(g.text, {
        x: 9.1,
        y: gapY,
        w: 3.1,
        h: 0.65,
        fontSize: 9.5,
        color: C_WHITE,
        fontFace: "Calibri",
        lineSpacingMultiple: 1.15,
      });
      gapY += 0.75;
    });
  }

  // ==========================================================================
  // SLIDE 3: The Solution & Core Product
  // ==========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_WHITE };

    addSlideHeader(
      slide,
      3,
      "The Solution & Core Product",
      "Not Just a Loan Platform: An Integrated Campus Financial Ecosystem",
      "Combining zero-interest underwriting with CBN-compliant GSI multi-account recourse and escrow protection."
    );

    // Left Column: 3 Architectural Capabilities
    const solutionBlocks = [
      {
        badge: "0% INTEREST FINANCING ENGINE",
        title: "Undergrad (200L+) & NYSC Advances",
        bullets: [
          "Disbursements from ₦20,000 to ₦250,000 in 24 to 48 hours at 0.0% APR.",
          "Tuition paid straight to school bursary, eliminating fund diversion.",
          "NYSC equipment loans up to ₦500,000 automated via monthly stipend deduction.",
        ],
      },
      {
        badge: "LEGAL RISK MITIGATION",
        title: "CBN Global Standing Instruction (GSI) via NIBSS",
        bullets: [
          "Mandate executed under CBN Circular BSD/DIR/GEN/LAB/13/053.",
          "Legally enforceable automated recourse across all 30+ Nigerian banks via BVN.",
          "Brings institutional default risk near zero without requiring traditional collateral.",
        ],
      },
      {
        badge: "ECOBANK SMART ESCROW",
        title: "Zero-Fraud Peer-to-Peer Campus Commerce",
        bullets: [
          "Funds held safely in Ecobank Escrow Vault during P2P marketplace trades.",
          "Payment released only upon in-person inspection and 4-digit OTP validation.",
          "Each completed trade builds student's proprietary Campus Score (0-1000).",
        ],
      },
    ];

    let sY = 2.0;
    solutionBlocks.forEach((b) => {
      slide.addShape(pres.ShapeType.rect, {
        x: 0.8,
        y: sY,
        w: 6.4,
        h: 1.45,
        fill: { color: C_BG_CARD },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.06,
      });

      slide.addText(b.badge, {
        x: 1.0,
        y: sY + 0.1,
        w: 6.0,
        h: 0.2,
        fontSize: 8,
        bold: true,
        color: C_EMERALD,
        fontFace: "Calibri",
      });

      slide.addText(b.title, {
        x: 1.0,
        y: sY + 0.32,
        w: 6.0,
        h: 0.28,
        fontSize: 12.5,
        bold: true,
        color: C_NAVY,
        fontFace: "Segoe UI",
      });

      const bulletItems = b.bullets.map((txt) => ({
        text: txt + "\n",
        options: { fontSize: 9.5, color: C_MUTED, fontFace: "Calibri", bullet: true },
      }));

      slide.addText(bulletItems, {
        x: 1.0,
        y: sY + 0.65,
        w: 6.0,
        h: 0.7,
        lineSpacingMultiple: 1.15,
      });

      sY += 1.6;
    });

    // Right Column: Actual Production Screenshot of Loans Section
    if (fs.existsSync(imgLoans)) {
      slide.addImage({
        path: imgLoans,
        x: 7.5,
        y: 2.0,
        w: 5.0,
        h: 4.65,
        sizing: { type: "contain" },
      });
    }
  }

  // ==========================================================================
  // SLIDE 4: The Talent Bridge & Brain Drain Mitigation
  // ==========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_WHITE };

    addSlideHeader(
      slide,
      4,
      "The Talent Bridge",
      "Mitigating African 'Brain Drain' Through Corporate Network Matching",
      "Pairing educational financing with structured post-graduate career pipelines across Ecobank's Pan-African network."
    );

    // Left Column: The Strategic Thesis
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 2.0,
      w: 6.4,
      h: 4.75,
      fill: { color: C_BG_CARD },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText("THE PROBLEM: FINANCING WITHOUT CAREER PLACEMENT", {
      x: 1.1,
      y: 2.25,
      w: 5.8,
      h: 0.22,
      fontSize: 8.5,
      bold: true,
      color: "DC2626",
      fontFace: "Calibri",
    });

    slide.addText(
      "Tuition loans alone do not solve the youth crisis if graduating scholars face 40% youth underemployment and are forced into the 'Japa' brain-drain wave.",
      {
        x: 1.1,
        y: 2.55,
        w: 5.8,
        h: 0.65,
        fontSize: 11,
        color: C_CHARCOAL,
        fontFace: "Calibri",
        lineSpacingMultiple: 1.15,
      }
    );

    slide.addShape(pres.ShapeType.line, {
      x: 1.1,
      y: 3.3,
      w: 5.8,
      h: 0,
      line: { color: C_BORDER, width: 1 },
    });

    slide.addText("THE ECOSYSTEM BRIDGE: OPPORTUNITY HUB", {
      x: 1.1,
      y: 3.45,
      w: 5.8,
      h: 0.22,
      fontSize: 8.5,
      bold: true,
      color: C_EMERALD,
      fontFace: "Calibri",
    });

    const bridgePoints = [
      {
        head: "Direct Ecobank FastTrack & Tech Internships:",
        body: "Top academic performers (CGPA 3.5+) matched directly with graduate trainee programs at Ecobank Nigeria, Paystack MFB, and multinational corporate partners.",
      },
      {
        head: "Subsidized Digital Skills ('Learn & Earn'):",
        body: "Sponsored industry certifications (Next.js, Python for Finance, SQL) subsidized through Ecobank CSR that boost loan limits while building practical workforce capacity.",
      },
      {
        head: "NYSC High-Allowance PPA Matcher:",
        body: "Corpers connected to technology PPAs offering monthly agency top-up stipends (₦160,000 - ₦180,000/mo) to guarantee loan liquidation and high savings accumulation.",
      },
    ];

    let bY = 3.75;
    bridgePoints.forEach((pt) => {
      slide.addText(
        [
          { text: pt.head + "\n", options: { bold: true, color: C_NAVY, fontSize: 10.5 } },
          { text: pt.body, options: { color: C_MUTED, fontSize: 9.5 } },
        ],
        { x: 1.1, y: bY, w: 5.8, h: 0.8, fontFace: "Calibri", lineSpacingMultiple: 1.15 }
      );
      bY += 0.9;
    });

    // Right Column: Opportunities Screen
    if (fs.existsSync(imgOpportunities)) {
      slide.addImage({
        path: imgOpportunities,
        x: 7.5,
        y: 2.0,
        w: 5.0,
        h: 4.75,
        sizing: { type: "contain" },
      });
    }
  }

  // ==========================================================================
  // SLIDE 5: Why Ecobank Wins: SROI & Compounding Commercial Offsets
  // ==========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_WHITE };

    addSlideHeader(
      slide,
      5,
      "Commercial Architecture",
      "Why Ecobank Wins: Compounding SROI & Commercial Balance Sheet Offsets",
      "While zero-interest student lending operates at zero direct profit, the commercial offsets create an unbeatable institutional moat."
    );

    // 4 Commercial Offset Metric Cards
    const offsets = [
      {
        metric: "₦0 CAC",
        sub: "ORGANIC VIRALITY",
        title: "Lifetime Customer Acquisition (LTV)",
        text: "Retail banking CAC in Nigeria exceeds ₦12,000 per user. EcoCampus acquires students at near-zero organic CAC through campus word-of-mouth. Beneficiaries enter deep generational loyalty with 30+ year customer retention.",
      },
      {
        metric: "100%",
        sub: "REVENUE RETENTION",
        title: "Post-Graduate Salary Domiciliation",
        text: "Graduates who received tuition liquidity and corporate internships naturally maintain their primary professional salary accounts with Ecobank, yielding mortgage, credit card, and auto-loan cross-sell opportunities.",
      },
      {
        metric: "₦500M+",
        sub: "NON-INTEREST DEPOSIT",
        title: "Campus Escrow Float Mobilization",
        text: "Tens of thousands of active marketplace trades generate substantial, non-interest-bearing operational liquidity. Buyer funds locked in Ecobank Escrow Vault provide zero-cost deposit float.",
      },
      {
        metric: "3.5%",
        sub: "SUSTAINABLE MARGIN",
        title: "NYSC Equipment Advance Facility Margin",
        text: "Corper equipment financing carries a single-digit 3.5% facility fee. Automated monthly allowance split via NIBSS ensures zero collection overhead and zero recovery friction.",
      },
    ];

    const positions = [
      { x: 0.8, y: 2.0 },
      { x: 6.8, y: 2.0 },
      { x: 0.8, y: 4.4 },
      { x: 6.8, y: 4.4 },
    ];

    offsets.forEach((item, idx) => {
      const pos = positions[idx];
      slide.addShape(pres.ShapeType.rect, {
        x: pos.x,
        y: pos.y,
        w: 5.7,
        h: 2.25,
        fill: { color: C_BG_CARD },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.08,
      });

      // Metric Callout Left
      slide.addText(item.metric, {
        x: pos.x + 0.25,
        y: pos.y + 0.2,
        w: 1.8,
        h: 0.45,
        fontSize: 22,
        bold: true,
        color: C_EMERALD,
        fontFace: "Segoe UI",
      });

      slide.addText(item.sub, {
        x: pos.x + 0.25,
        y: pos.y + 0.65,
        w: 1.8,
        h: 0.2,
        fontSize: 7.5,
        bold: true,
        color: C_MUTED,
        fontFace: "Calibri",
      });

      // Title & Text Right
      slide.addText(item.title, {
        x: pos.x + 2.1,
        y: pos.y + 0.2,
        w: 3.35,
        h: 0.45,
        fontSize: 12,
        bold: true,
        color: C_NAVY,
        fontFace: "Segoe UI",
      });

      slide.addText(item.text, {
        x: pos.x + 2.1,
        y: pos.y + 0.68,
        w: 3.35,
        h: 1.45,
        fontSize: 9,
        color: C_MUTED,
        fontFace: "Calibri",
        lineSpacingMultiple: 1.15,
      });
    });
  }

  // ==========================================================================
  // SLIDE 6: The Pan-African Blueprint & Public-Private Partnership (PPP)
  // ==========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_WHITE };

    addSlideHeader(
      slide,
      6,
      "Strategic Positioning",
      "The Pan-African Blueprint: Public-Private Partnership (PPP) Engine",
      "Positioning Ecobank as the premier financial execution partner for NELFUND and the African Union's Educational Initiatives."
    );

    // Left Column: PPP Positioning
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 2.0,
      w: 5.7,
      h: 4.8,
      fill: { color: C_BG_CARD },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText("PUBLIC-PRIVATE PARTNERSHIP (PPP) ALIGNMENT", {
      x: 1.1,
      y: 2.25,
      w: 5.1,
      h: 0.22,
      fontSize: 8.5,
      bold: true,
      color: C_EMERALD,
      fontFace: "Calibri",
    });

    slide.addText("The Ideal Implementation Partner for NELFUND:", {
      x: 1.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: C_NAVY,
      fontFace: "Segoe UI",
    });

    const nelfundPoints = [
      {
        h: "Overcoming Federal Distribution Lag:",
        t: "NELFUND holds sovereign capital but lacks low-latency digital rails. EcoCampus provides the turnkey student KYC, academic authentication, and instant bursary disbursement engine.",
      },
      {
        h: "GSI Default Safeguard Infrastructure:",
        t: "Protects public loan capital through automated NIBSS Global Standing Instruction mandates across all commercial banking assets, ensuring federal repayment compliance.",
      },
      {
        h: "Pan-African Scalability across 33 Nations:",
        t: "EcoCampus leverages Ecobank's unmatched footprint across 33 African countries to support the African Union Educational Initiative with cross-border tuition settlement.",
      },
    ];

    let nY = 3.0;
    nelfundPoints.forEach((np) => {
      slide.addText(
        [
          { text: np.h + " ", options: { bold: true, color: C_NAVY, fontSize: 10 } },
          { text: np.t, options: { color: C_MUTED, fontSize: 9.5 } },
        ],
        { x: 1.1, y: nY, w: 5.1, h: 0.95, fontFace: "Calibri", lineSpacingMultiple: 1.15 }
      );
      nY += 1.05;
    });

    // Right Column: Pan-African Footprint & ESG Matrix
    slide.addShape(pres.ShapeType.rect, {
      x: 6.8,
      y: 2.0,
      w: 5.7,
      h: 4.8,
      fill: { color: C_NAVY },
      rectRadius: 0.08,
    });

    slide.addText("CONTINENTAL SCALE & ESG IMPACT", {
      x: 7.1,
      y: 2.25,
      w: 5.1,
      h: 0.22,
      fontSize: 8.5,
      bold: true,
      color: C_GREEN_ACCENT,
      fontFace: "Calibri",
    });

    slide.addText("Ecobank: Reimagining Possibilities Across Africa", {
      x: 7.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: C_WHITE,
      fontFace: "Segoe UI",
    });

    const esgMetrics = [
      {
        kpi: "33 AFRICAN MARKETS",
        label: "Ecobank RapidTransfer Integration",
        desc: "Enables seamless cross-border tuition settlement, regional scholarship distribution, and intra-African academic mobility without foreign currency friction.",
      },
      {
        kpi: "UN SDG 4 & 8 COMPLIANT",
        label: "Quality Education & Decent Work",
        desc: "Provides verified ESG reporting metrics, positioning Ecobank for international green/social concessional funding and development finance institution (DFI) partnerships.",
      },
      {
        kpi: "2.5M NIGERIAN UNDERGRADS",
        label: "TAM Onboarding Potential",
        desc: "Capturing 10% market share yields 250,000 active retail accounts, ₦12.5B in loan underwriting, and a foundational pipeline of future African business leaders.",
      },
    ];

    let esgY = 3.0;
    esgMetrics.forEach((em) => {
      slide.addText(em.kpi, {
        x: 7.1,
        y: esgY,
        w: 5.1,
        h: 0.25,
        fontSize: 11,
        bold: true,
        color: C_GREEN_ACCENT,
        fontFace: "Segoe UI",
      });
      slide.addText(em.label, {
        x: 7.1,
        y: esgY + 0.25,
        w: 5.1,
        h: 0.2,
        fontSize: 9,
        bold: true,
        color: C_WHITE,
        fontFace: "Calibri",
      });
      slide.addText(em.desc, {
        x: 7.1,
        y: esgY + 0.48,
        w: 5.1,
        h: 0.55,
        fontSize: 8.5,
        color: "CBD5E1",
        fontFace: "Calibri",
        lineSpacingMultiple: 1.15,
      });
      esgY += 1.15;
    });
  }

  // ==========================================================================
  // SLIDE 7: Roadmap & Hackathon Ask
  // ==========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_WHITE };

    addSlideHeader(
      slide,
      7,
      "Execution & The Ask",
      "Implementation Roadmap: From Hackathon Demo to National Pilot",
      "EcoCampus is fully functional and tested today. We present a clear, 3-phase execution roadmap."
    );

    // 3 Horizontal Roadmap Blocks
    const phases = [
      {
        phase: "PHASE 1 (MONTHS 1 - 6)",
        title: "5-University Flagship Pilot",
        bullets: [
          "Deploy at UniAbuja, UNILAG, UI, OAU, and ABU Zaria.",
          "Target: 100,000 verified accounts, ₦500M escrow GMV.",
          "Direct integration with university bursary accounts.",
        ],
      },
      {
        phase: "PHASE 2 (MONTHS 7 - 12)",
        title: "National NYSC Camp Rollout",
        bullets: [
          "Partnership with 37 NYSC orientation camps nationwide.",
          "Issue co-branded Ecobank Blaze cards with equipment advances.",
          "Automated monthly allowance splits via NIBSS Direct Debit.",
        ],
      },
      {
        phase: "PHASE 3 (YEAR 2+)",
        title: "Pan-African Continental Scale",
        bullets: [
          "Replicate model in Ghana, Kenya, Côte d'Ivoire & Senegal.",
          "Launch Ecobank RapidTransfer student remittance rails.",
          "Formalize continental execution partnership with African Union.",
        ],
      },
    ];

    let pX = 0.8;
    phases.forEach((p) => {
      slide.addShape(pres.ShapeType.rect, {
        x: pX,
        y: 2.0,
        w: 3.7,
        h: 2.4,
        fill: { color: C_BG_CARD },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.08,
      });

      slide.addText(p.phase, {
        x: pX + 0.2,
        y: 2.15,
        w: 3.3,
        h: 0.2,
        fontSize: 8,
        bold: true,
        color: C_EMERALD,
        fontFace: "Calibri",
      });

      slide.addText(p.title, {
        x: pX + 0.2,
        y: 2.38,
        w: 3.3,
        h: 0.35,
        fontSize: 12,
        bold: true,
        color: C_NAVY,
        fontFace: "Segoe UI",
      });

      const bullets = p.bullets.map((b) => ({
        text: b + "\n",
        options: { fontSize: 9, color: C_MUTED, fontFace: "Calibri", bullet: true },
      }));

      slide.addText(bullets, {
        x: pX + 0.2,
        y: 2.78,
        w: 3.3,
        h: 1.5,
        lineSpacingMultiple: 1.15,
      });

      pX += 4.0;
    });

    // Bottom Box: The Hackathon Ask
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 4.65,
      w: 11.7,
      h: 2.1,
      fill: { color: C_NAVY },
      rectRadius: 0.08,
    });

    slide.addText("THE ASK TO ECOBANK EXECUTIVE LEADERSHIP", {
      x: 1.1,
      y: 4.85,
      w: 11.1,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: C_GREEN_ACCENT,
      fontFace: "Calibri",
    });

    slide.addText("Partnering with Adebanke Oladejo, Victor Yalokwu & Babawale John to Power Africa's Youth:", {
      x: 1.1,
      y: 5.15,
      w: 11.1,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: C_WHITE,
      fontFace: "Segoe UI",
    });

    const asks = [
      {
        num: "1",
        label: "Core Banking Sandbox",
        desc: "API credentials for live testing with Ecobank OmniCore & NIBSS GSI Switch.",
      },
      {
        num: "2",
        label: "Campus Pilot Approval",
        desc: "Authorization to pilot with 5,000 University of Abuja students under Ecobank Blaze sponsorship.",
      },
      {
        num: "3",
        label: "Talent Pipeline Matching",
        desc: "Official onboarding of Opportunity Hub into Ecobank Group's HR graduate recruitment network.",
      },
    ];

    let askX = 1.1;
    asks.forEach((a) => {
      slide.addText(a.num, {
        x: askX,
        y: 5.55,
        w: 0.3,
        h: 0.3,
        fontSize: 14,
        bold: true,
        color: C_GREEN_ACCENT,
        fontFace: "Segoe UI",
      });
      slide.addText(a.label, {
        x: askX + 0.35,
        y: 5.55,
        w: 3.2,
        h: 0.25,
        fontSize: 10.5,
        bold: true,
        color: C_WHITE,
        fontFace: "Segoe UI",
      });
      slide.addText(a.desc, {
        x: askX + 0.35,
        y: 5.82,
        w: 3.2,
        h: 0.8,
        fontSize: 8.5,
        color: "CBD5E1",
        fontFace: "Calibri",
        lineSpacingMultiple: 1.15,
      });
      askX += 3.8;
    });
  }

  // Save PPTX to public folder
  const outputPath = path.join(rootDir, "public", "EcoCampus_Master_Pitch_Deck.pptx");
  console.log(`Writing presentation to: ${outputPath}`);
  await pres.writeFile({ fileName: outputPath });
  console.log("Successfully generated EcoCampus_Master_Pitch_Deck.pptx!");
}

generateDeck().catch((err) => {
  console.error("Error generating pitch deck PPTX:", err);
  process.exit(1);
});
