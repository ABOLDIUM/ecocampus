"use client";

import React, { useState } from "react";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import styles from "./marketplace.module.css";

const MARKETPLACE_ITEMS = [
  {
    id: "item-1",
    title: "HP EliteBook 840 G5 (Core i5, 16GB RAM)",
    priceKobo: 21500000, // ₦215,000
    category: "Computers",
    condition: "Foreign Used",
    seller: "TechHub UniAbuja",
    location: "Permanent Site Campus",
    icon: "💻",
  },
  {
    id: "item-2",
    title: "iPhone 11 (64GB - Factory Unlocked)",
    priceKobo: 18500000, // ₦185,000
    category: "Phones",
    condition: "Clean UK Used",
    seller: "Aisha Gadgets",
    location: "Hostel Block C",
    icon: "📱",
  },
  {
    id: "item-3",
    title: "EcoCampus 200L Gross Anatomy & Physiology Atlas",
    priceKobo: 650000, // ₦6,500
    category: "Books",
    condition: "Brand New",
    seller: "Medical Students Assoc",
    location: "College of Health Sciences",
    icon: "📚",
  },
  {
    id: "item-4",
    title: "Rechargeable Campus Fan + LED Study Lamp",
    priceKobo: 2200000, // ₦22,000
    category: "Hostel Essentials",
    condition: "Brand New",
    seller: "EcoCampus Ventures",
    location: "Shopping Complex",
    icon: "🔌",
  },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = ["All", "Computers", "Phones", "Books", "Hostel Essentials"];

  const filteredItems = MARKETPLACE_ITEMS.filter((item) => {
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (orderSuccess) {
    return (
      <main className={styles.marketContainer}>
        <div className={styles.detailModal} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", color: "#16a34a", marginBottom: "0.5rem" }}>✓</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
            Protected Order Confirmed
          </h2>
          <p style={{ fontSize: "0.84rem", color: "#64748b", marginBottom: "1.25rem" }}>
            Funds held securely in escrow. Seller has been notified for pickup/dispatch at {activeItem?.location}.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#003b73",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Return to Dashboard
          </a>
        </div>
      </main>
    );
  }

  if (activeItem) {
    return (
      <main className={styles.marketContainer}>
        <header className={styles.headerRow}>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => setActiveItem(null)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            &lt; Back to Marketplace
          </button>
          <h1 className={styles.title}>Item Details</h1>
          <div style={{ width: 40 }} />
        </header>

        <div className={styles.detailModal}>
          <div style={{ fontSize: "4rem", textAlign: "center", marginBottom: "1rem" }}>{activeItem.icon}</div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>
            {activeItem.title}
          </h2>
          <p className={`${styles.listingPrice} ec-mono-amount`} style={{ fontSize: "1.35rem" }}>
            {formatKoboToNaira(activeItem.priceKobo)}
          </p>
          <div style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "1rem", lineHeight: 1.5 }}>
            <p><strong>Condition:</strong> {activeItem.condition}</p>
            <p><strong>Seller:</strong> {activeItem.seller}</p>
            <p><strong>Location:</strong> {activeItem.location}</p>
          </div>

          <button
            type="button"
            className={styles.buyBtn}
            onClick={() => setOrderSuccess(true)}
          >
            Pay Securely ({formatKoboToNaira(activeItem.priceKobo)})
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.marketContainer}>
      <header className={styles.headerRow}>
        <a href="/" className={styles.backLink}>
          &lt; Home
        </a>
        <h1 className={styles.title}>Campus Marketplace</h1>
        <div style={{ width: 40 }} />
      </header>

      <input
        type="search"
        className={styles.searchBar}
        placeholder="Search phones, computers, books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className={styles.categoryScroll}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.catPill} ${selectedCategory === cat ? styles.catPillActive : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.listingGrid}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={styles.listingCard}
            onClick={() => setActiveItem(item)}
          >
            <div>
              <div className={styles.listingImgBox}>{item.icon}</div>
              <h3 className={styles.listingTitle}>{item.title}</h3>
            </div>
            <div>
              <p className={`${styles.listingPrice} ec-mono-amount`}>
                {formatKoboToNaira(item.priceKobo)}
              </p>
              <span className={styles.sellerBadge}>{item.seller}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}