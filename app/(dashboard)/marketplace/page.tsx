// ============================================================================
// ECOCAMPUS ECOMARKET VERIFIED DIRECTORY — APP/(DASHBOARD)/MARKETPLACE/PAGE.TSX
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveUser, EcoUser } from "@/lib/database/user-store";
import styles from "../transfers/transfer.module.css";

interface ListingItem {
  id: string;
  title: string;
  priceNaira: number;
  category: string;
  sellerName: string;
  institution: string;
  verifiedType: string;
}

const INITIAL_LISTINGS: ListingItem[] = [
  {
    id: "lst-1",
    title: "Gray's Anatomy 42nd Edition (Clean Copy)",
    priceNaira: 4500,
    category: "Medical Textbooks",
    sellerName: "Dr. Aliyu M.",
    institution: "University of Abuja",
    verifiedType: "Student",
  },
  {
    id: "lst-2",
    title: "HP ProBook 650 G4 Core i5 (8GB RAM)",
    priceNaira: 165000,
    category: "Electronics & Laptops",
    sellerName: "Aboldium Tech Gadgets",
    institution: "University of Abuja",
    verifiedType: "Verified Vendor",
  },
  {
    id: "lst-3",
    title: "NYSC Khaki Uniform Complete Set (Size 38)",
    priceNaira: 8500,
    category: "Corps Member Gear",
    sellerName: "Amina K. (PPA FCT)",
    institution: "NYSC FCT Abuja",
    verifiedType: "Corps Member",
  },
];

export default function EcoMarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [listings, setListings] = useState<ListingItem[]>(INITIAL_LISTINGS);
  const [searchFilter, setSearchFilter] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
  }, [router]);

  if (!user) return null;

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <a
          href="/"
          style={{
            textDecoration: "none",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#007749",
            fontWeight: 700,
            fontSize: "0.8rem",
            padding: "0.4rem 0.85rem",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          &larr; Dashboard
        </a>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          EcoMarketplace
        </h1>
        <div style={{ width: 40 }} />
      </header>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search verified student & corper listings..."
          className={styles.formInput}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>

      {feedback && (
        <div style={{ padding: "0.7rem", borderRadius: "0.75rem", background: "#ecfdf5", color: "#065f46", fontSize: "0.78rem", fontWeight: 700, marginBottom: "1rem" }}>
          {feedback}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#ffffff",
              borderRadius: "1rem",
              padding: "1rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#007749", background: "#ecfdf5", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                {item.verifiedType}
              </span>
              <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "#0f172a", fontFamily: "monospace" }}>
                ₦{item.priceNaira.toLocaleString()}
              </span>
            </div>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", margin: "0.2rem 0 0.4rem 0" }}>
              {item.title}
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: "#64748b" }}>
              <span>Seller: {item.sellerName} ({item.institution})</span>
              <button
                type="button"
                onClick={() => setFeedback(`Contact initiated with ${item.sellerName} for ${item.title}.`)}
                style={{
                  background: "#007749",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.3rem 0.65rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Contact Seller
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}