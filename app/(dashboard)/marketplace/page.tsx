// ============================================================================
// ECOCAMPUS ECOMARKETPLACE & ECOBANK ESCROW — APP/(DASHBOARD)/MARKETPLACE/PAGE.TSX
// Flagship Sprint 3 Overhaul | Verified Student P2P Commerce + Smart Escrow
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
  createEscrowOrder,
  releaseEscrowOrder,
  EcoUser,
  EscrowOrder,
} from "@/lib/database/user-store";
import { BottomNav } from "@/components/navigation/BottomNav";
import styles from "./marketplace.module.css";

interface MarketplaceItem {
  id: string;
  title: string;
  priceNaira: number;
  category: "textbooks" | "electronics" | "nysc" | "medical" | "hostel";
  categoryLabel: string;
  condition: "Brand New" | "Like New" | "Clean Copy" | "Good Condition";
  sellerName: string;
  sellerAccount: string;
  sellerInstitution: string;
  verifiedType: string;
  sellerRating: string;
  pickupLocation: string;
  imageUrl: string;
}

const DEFAULT_LISTINGS: MarketplaceItem[] = [
  {
    id: "mkt-1",
    title: "Gray's Anatomy 42nd Edition (Clean Copy, No Markings)",
    priceNaira: 4500,
    category: "medical",
    categoryLabel: "Medical Textbooks",
    condition: "Clean Copy",
    sellerName: "Dr. Aliyu M.",
    sellerAccount: "3091827491",
    sellerInstitution: "University of Abuja (MBBS 400L)",
    verifiedType: "Verified Student",
    sellerRating: "4.9 (18 trades)",
    pickupLocation: "Medical College Foyer",
    imageUrl: "/marketplace/grays-anatomy.jpg",
  },
  {
    id: "mkt-2",
    title: "HP ProBook 650 G4 Core i5 (8GB RAM, 256GB SSD)",
    priceNaira: 165000,
    category: "electronics",
    categoryLabel: "Electronics",
    condition: "Like New",
    sellerName: "Aboldium Tech Gadgets",
    sellerAccount: "2420918392",
    sellerInstitution: "Faculty of Engineering",
    verifiedType: "Verified Vendor",
    sellerRating: "5.0 (42 trades)",
    pickupLocation: "Senate Building Quad",
    imageUrl: "/marketplace/hp-probook.jpg",
  },
  {
    id: "mkt-3",
    title: "NYSC Khaki Uniform Complete Set (Size 38 + Jungle Boots)",
    priceNaira: 8500,
    category: "nysc",
    categoryLabel: "NYSC Gear",
    condition: "Good Condition",
    sellerName: "Amina K.",
    sellerAccount: "3092716382",
    sellerInstitution: "NYSC FCT Abuja (FC/26A/1982)",
    verifiedType: "Verified Corper",
    sellerRating: "4.8 (9 trades)",
    pickupLocation: "NYSC FCT Secretariat",
    imageUrl: "/marketplace/nysc-uniform.jpg",
  },
  {
    id: "mkt-4",
    title: "Littmann Classic III Stethoscope (Black Edition)",
    priceNaira: 38000,
    category: "medical",
    categoryLabel: "Medical Equipment",
    condition: "Like New",
    sellerName: "Chukwudi E.",
    sellerAccount: "3081928471",
    sellerInstitution: "Teaching Hospital Intern",
    verifiedType: "Verified Student",
    sellerRating: "5.0 (14 trades)",
    pickupLocation: "Clinical Ward Entrance",
    imageUrl: "/marketplace/stethoscope.jpg",
  },
  {
    id: "mkt-5",
    title: "Rechargeable Campus Desk Fan + Solar Mini Panel",
    priceNaira: 18500,
    category: "hostel",
    categoryLabel: "Hostel Essentials",
    condition: "Brand New",
    sellerName: "Boluwatife O.",
    sellerAccount: "3094829104",
    sellerInstitution: "Hostel Block C (300L Engr)",
    verifiedType: "Verified Student",
    sellerRating: "4.9 (22 trades)",
    pickupLocation: "Hostel Block C Common Room",
    imageUrl: "/marketplace/desk-fan.jpg",
  },
  {
    id: "mkt-6",
    title: "Casio fx-991EX ClassWiz Advanced Scientific Calculator",
    priceNaira: 12000,
    category: "textbooks",
    categoryLabel: "Study Gear",
    condition: "Like New",
    sellerName: "Fatima S.",
    sellerAccount: "3095819283",
    sellerInstitution: "Faculty of Management Sciences",
    verifiedType: "Verified Student",
    sellerRating: "4.7 (7 trades)",
    pickupLocation: "Main Library Steps",
    imageUrl: "/marketplace/casio-calculator.jpg",
  },
];

export default function EcoMarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [listings, setListings] = useState<MarketplaceItem[]>(DEFAULT_LISTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [buyItemTarget, setBuyItemTarget] = useState<MarketplaceItem | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [releaseModalTarget, setReleaseModalTarget] = useState<EscrowOrder | null>(null);
  const [enteredInspectionCode, setEnteredInspectionCode] = useState<string>("");

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // New Item Form state
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState<MarketplaceItem["category"]>("textbooks");
  const [newCondition, setNewCondition] = useState<MarketplaceItem["condition"]>("Like New");
  const [newLocation, setNewLocation] = useState("University Library Steps");

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);

    // Load persisted user listings if any
    try {
      const stored = localStorage.getItem("ecocampus_custom_listings_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        setListings([...parsed, ...DEFAULT_LISTINGS]);
      }
    } catch {}
  }, [router]);

  if (!user) return null;

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Active Escrow Order for user
  const activeEscrowOrders = user.escrowOrders?.filter((o) => o.status === "FUNDS_IN_ESCROW") || [];

  // Initiate Escrow Purchase
  function handleConfirmEscrowBuy() {
    if (!buyItemTarget) return;
    const res = createEscrowOrder(user!.id, {
      itemId: buyItemTarget.id,
      itemTitle: buyItemTarget.title,
      category: buyItemTarget.category,
      priceNaira: buyItemTarget.priceNaira,
      sellerName: buyItemTarget.sellerName,
      sellerAccount: buyItemTarget.sellerAccount,
      sellerInstitution: buyItemTarget.sellerInstitution,
      pickupLocation: buyItemTarget.pickupLocation,
    });

    if (res.ok && res.order) {
      setIsBuyModalOpen(false);
      setBuyItemTarget(null);
      const updated = getActiveUser();
      setUser(updated);
      setFeedback({
        type: "success",
        message: `₦${res.order.priceNaira.toLocaleString()} secured in Ecobank Escrow! Give code ${res.order.inspectionCode} to the seller only after inspecting item.`,
      });
      setTimeout(() => setFeedback(null), 6000);
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Could not complete escrow lock",
      });
    }
  }

  // Release Escrow Order
  function handleReleaseEscrow() {
    if (!releaseModalTarget) return;
    const res = releaseEscrowOrder(user!.id, releaseModalTarget.id, enteredInspectionCode);
    if (res.ok) {
      setReleaseModalTarget(null);
      setEnteredInspectionCode("");
      const updated = getActiveUser();
      setUser(updated);
      setFeedback({
        type: "success",
        message: `🎉 Escrow funds released to ${releaseModalTarget.sellerName}! You gained +${res.scoreBonus} Campus Score!`,
      });
      setTimeout(() => setFeedback(null), 6000);
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Failed to release escrow",
      });
    }
  }

  // Post New Listing
  function handlePostListing(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newItem: MarketplaceItem = {
      id: `mkt-custom-${Date.now()}`,
      title: newTitle,
      priceNaira: Number(newPrice),
      category: newCategory,
      categoryLabel:
        newCategory === "textbooks"
          ? "Textbooks"
          : newCategory === "electronics"
          ? "Electronics"
          : newCategory === "nysc"
          ? "NYSC Gear"
          : newCategory === "medical"
          ? "Medical"
          : "Hostel",
      condition: newCondition,
      sellerName: user!.fullName,
      sellerAccount: user!.accountNumber,
      sellerInstitution: user!.institutionName || "University of Abuja",
      verifiedType: user!.accountType === "student" ? "Verified Student" : "Verified Corper",
      sellerRating: "5.0 (New Seller)",
      pickupLocation: newLocation,
      imageUrl: "/marketplace/hp-probook.jpg",
    };

    const updated = [newItem, ...listings];
    setListings(updated);
    try {
      localStorage.setItem("ecocampus_custom_listings_v1", JSON.stringify([newItem]));
    } catch {}

    setIsSellModalOpen(false);
    setNewTitle("");
    setNewPrice("");
    setFeedback({
      type: "success",
      message: `Your listing "${newItem.title}" is now live across campus with Ecobank Escrow protection!`,
    });
    setTimeout(() => setFeedback(null), 5000);
  }

  return (
    <main className={styles.container}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <a href="/" className={styles.backBtn}>
            <span>&larr;</span> Dashboard
          </a>
          <h1 className={styles.headerTitle}>EcoMarket</h1>
        </div>
        <div className={styles.escrowBadge}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Ecobank Escrow Protected</span>
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

      {/* ── Active Escrow Drawer (if any active order) ───────────────────── */}
      {activeEscrowOrders.length > 0 && (
        <section className={styles.activeEscrowDrawer}>
          <div className={styles.activeEscrowHeader}>
            <span className={styles.activeEscrowBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Funds Held in Ecobank Escrow
            </span>
            <span className={styles.activeEscrowRef}>{activeEscrowOrders[0].reference}</span>
          </div>

          <div className={styles.activeEscrowDetails}>
            ₦{activeEscrowOrders[0].priceNaira.toLocaleString()} · {activeEscrowOrders[0].itemTitle}
          </div>

          <div className={styles.activeEscrowLocation}>
            <span>Meeting Point:</span>
            <strong>{activeEscrowOrders[0].pickupLocation}</strong>
          </div>

          <div className={styles.activeEscrowOtpBox}>
            <div>
              <div style={{ fontSize: "0.68rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
                Inspection Handover Code
              </div>
              <div className={styles.otpCodeText}>{activeEscrowOrders[0].inspectionCode}</div>
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748B", maxWidth: "160px", textAlign: "right" }}>
              Give this code to <strong>{activeEscrowOrders[0].sellerName}</strong> only after inspecting item.
            </div>
          </div>

          <button
            className={styles.releaseEscrowBtn}
            onClick={() => {
              setReleaseModalTarget(activeEscrowOrders[0]);
              setEnteredInspectionCode(activeEscrowOrders[0].inspectionCode);
            }}
          >
            I Have Inspected Item • Release Payment to Seller &rarr;
          </button>
        </section>
      )}

      {/* ── Search & Sell Actions ───────────────────────────────────────── */}
      <div className={styles.actionsRow}>
        <div className={styles.searchBarWrapper}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={styles.searchIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search verified items, sellers, departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button
          className={styles.listItemBtn}
          onClick={() => setIsSellModalOpen(true)}
        >
          <span>+</span> List Item
        </button>
      </div>

      {/* ── Category Filter Pills ────────────────────────────────────────── */}
      <div className={styles.categoryPills}>
        {[
          { id: "all", label: "All Items" },
          { id: "textbooks", label: "Textbooks" },
          { id: "electronics", label: "Electronics" },
          { id: "nysc", label: "NYSC Gear" },
          { id: "medical", label: "Lab & Med Kits" },
          { id: "hostel", label: "Hostel Essentials" },
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

      {/* ── Listings Grid (Standard Product Listings) ─────────────────────── */}
      <div className={styles.listingsGrid}>
        {filteredListings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748B" }}>
            <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#001F3F" }}>No matching items found</p>
            <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Try searching another keyword or choose another category.</p>
          </div>
        ) : (
          filteredListings.map((item) => (
            <article key={item.id} className={styles.itemCard}>
              <div className={styles.itemImageWrapper}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.itemImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlayBadges}>
                  <span className={styles.sellerBadge}>{item.verifiedType}</span>
                  <span className={styles.conditionTag}>{item.condition}</span>
                </div>
              </div>

              <div className={styles.itemBody}>
                <div className={styles.itemCategory}>{item.categoryLabel}</div>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <div className={styles.itemPrice}>₦{item.priceNaira.toLocaleString()}</div>

                <div className={styles.itemSellerRow}>
                  <div className={styles.sellerDetails}>
                    <span>{item.sellerName}</span>
                    <span className={styles.sellerRating}>• {item.sellerRating}</span>
                  </div>
                  <div className={styles.pickupLocation}>
                    {item.pickupLocation}
                  </div>
                </div>

                <button
                  className={styles.buyBtn}
                  onClick={() => {
                    setBuyItemTarget(item);
                    setIsBuyModalOpen(true);
                  }}
                >
                  Buy
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* ── Buy with Escrow Confirmation Modal ────────────────────────────── */}
      {isBuyModalOpen && buyItemTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Ecobank Escrow Checkout</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsBuyModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#001F3F", marginBottom: "0.25rem" }}>
                {buyItemTarget.title}
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#00C853", fontFamily: "Space Grotesk, sans-serif", marginBottom: "0.5rem" }}>
                ₦{buyItemTarget.priceNaira.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                Seller: <strong>{buyItemTarget.sellerName}</strong> ({buyItemTarget.sellerInstitution})
              </div>
              <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "0.2rem" }}>
                Safe Campus Pickup: <strong>{buyItemTarget.pickupLocation}</strong>
              </div>
            </div>

            <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "12px", padding: "0.85rem", marginBottom: "1.25rem", fontSize: "0.74rem", color: "#065F46", lineHeight: 1.45 }}>
              <strong>Ecobank Escrow Protection:</strong> ₦{buyItemTarget.priceNaira.toLocaleString()} will be debited from your Ecobank account ({user.accountNumber}) and held safely in Ecobank Escrow. It will NOT be sent to the seller until you meet in person and provide your 4-digit code.
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "1.25rem", padding: "0 0.2rem" }}>
              <span style={{ color: "#64748B" }}>Your Balance</span>
              <span style={{ fontWeight: 800, color: "#001F3F" }}>{formatKoboToNaira(user.balanceKobo)}</span>
            </div>

            <button
              className={styles.primaryModalBtn}
              onClick={handleConfirmEscrowBuy}
            >
              Confirm Buy • Secure in Escrow &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ── Release Escrow Modal ─────────────────────────────────────────── */}
      {releaseModalTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Confirm Item Handover</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setReleaseModalTarget(null)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.78rem", color: "#64748B", marginBottom: "1rem" }}>
              Are you physically with <strong>{releaseModalTarget.sellerName}</strong> at <strong>{releaseModalTarget.pickupLocation}</strong> and satisfied with the condition of <em>{releaseModalTarget.itemTitle}</em>?
            </p>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Enter 4-Digit Handover Code</label>
              <input
                type="text"
                maxLength={4}
                value={enteredInspectionCode}
                onChange={(e) => setEnteredInspectionCode(e.target.value)}
                placeholder="e.g. 4821"
                className={styles.formInput}
                style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: 900, letterSpacing: "0.2em", fontFamily: "Space Grotesk, sans-serif" }}
              />
            </div>

            <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", padding: "0.75rem", borderRadius: "12px", marginBottom: "1.25rem", fontSize: "0.74rem", color: "#065F46" }}>
              Releasing this escrow instantly settles ₦{releaseModalTarget.priceNaira.toLocaleString()} to {releaseModalTarget.sellerName} and boosts your Campus Score by <strong>+25 pts</strong>.
            </div>

            <button
              className={styles.primaryModalBtn}
              onClick={handleReleaseEscrow}
            >
              Confirm & Release Funds to Seller
            </button>
          </div>
        </div>
      )}

      {/* ── Sell an Item Modal ───────────────────────────────────────────── */}
      {isSellModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>List an Item on EcoMarket</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsSellModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostListing}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry 8th Edition, Dell XPS 13..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className={styles.formSelect}
                >
                  <option value="textbooks">Textbooks & Study Materials</option>
                  <option value="electronics">Laptops & Electronics</option>
                  <option value="nysc">NYSC Uniform & Gear</option>
                  <option value="medical">Medical & Lab Equipment</option>
                  <option value="hostel">Hostel Essentials</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Condition</label>
                <select
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value as any)}
                  className={styles.formSelect}
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Clean Copy">Clean Copy</option>
                  <option value="Good Condition">Good Condition</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Campus Safe Pickup Point</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University Library Steps, Medical College Foyer"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div style={{ background: "#F1F5F9", padding: "0.75rem", borderRadius: "12px", marginBottom: "1.25rem", fontSize: "0.72rem", color: "#475569" }}>
                All listings are backed by <strong>Ecobank Smart Escrow</strong>. Buyer funds are collected upfront before you meet.
              </div>

              <button type="submit" className={styles.primaryModalBtn}>
                Publish Verified Listing &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <BottomNav activeTab="market" />
    </main>
  );
}