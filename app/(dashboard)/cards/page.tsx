// ============================================================================
// ECOCAMPUS LOCAL NGN VIRTUAL CARD MODULE — APP/(DASHBOARD)/CARDS/PAGE.TSX
// Exclusively displays Local Ecobank Naira Virtual Card & 180-Degree CVV Flip
// Official Motto: LEARN. GROW. ACHIEVE.
// ============================================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatKoboToNaira } from "@/lib/formatting/currency";
import { getActiveUser, EcoUser } from "@/lib/database/user-store";
import {
  CardNetwork,
  UserBankingProducts,
  getUserBankingProducts,
  createLocalVirtualCard,
} from "@/lib/api/banking-services";
import styles from "../transfers/transfer.module.css";

export default function LocalNairaCardPage() {
  const router = useRouter();
  const [user, setUser] = useState<EcoUser | null>(null);
  const [products, setProducts] = useState<UserBankingProducts | null>(null);
  const [localNetworkChoice, setLocalNetworkChoice] = useState<CardNetwork>("VERVE");
  const [isFlipped, setIsFlipped] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [maskCardPan, setMaskCardPan] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveUser();
    if (!active) {
      router.push("/login");
      return;
    }
    setUser(active);
    const loaded = getUserBankingProducts(active);
    setProducts(loaded);
    setLocalNetworkChoice(loaded.localCard.network);
  }, [router]);

  if (!user || !products) return null;

  function handleGetLocalCard() {
    const updated = createLocalVirtualCard(user!, localNetworkChoice);
    setProducts({ ...updated });
    setFeedback(`Ecobank ${localNetworkChoice} Naira Virtual Card activated and linked to your wallet.`);
  }

  function handleSwitchNetwork(net: CardNetwork) {
    setLocalNetworkChoice(net);
    if (products?.localCard.isProvisioned) {
      const updated = createLocalVirtualCard(user!, net);
      setProducts({ ...updated });
      setFeedback(`Switched local Naira card network to ${net}.`);
    }
  }

  function handleCopyPan() {
    navigator.clipboard.writeText(products!.localCard.cardNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getCardGradient(network: CardNetwork) {
    switch (network) {
      case "VISA":
        return "linear-gradient(135deg, #9a6f1a 0%, #c28e26 55%, #7c5813 100%)";
      case "MASTERCARD":
        return "linear-gradient(135deg, #334155 0%, #475569 55%, #1e293b 100%)";
      case "VERVE":
      default:
        return "linear-gradient(135deg, #006891 0%, #0082b4 55%, #005073 100%)";
    }
  }

  const displayedPan = maskCardPan
    ? `•••• •••• •••• ${products.localCard.cardNumber.slice(-4)}`
    : products.localCard.cardNumber;

  return (
    <main className={styles.transferContainer} style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem", minHeight: "100dvh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#007749",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          &larr; Dashboard
        </a>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Ecobank NGN Virtual Card
        </h1>
        <div style={{ width: 48 }} />
      </header>

      {feedback && (
        <div
          style={{
            padding: "0.7rem 0.9rem",
            borderRadius: "0.75rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            marginBottom: "1rem",
            background: "#ecfdf5",
            color: "#065f46",
            border: "1px solid #10b981",
          }}
        >
          {feedback}
        </div>
      )}

      {!products.localCard.isProvisioned ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "1.35rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "#007749",
                background: "#ecfdf5",
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
              }}
            >
              LOCAL NGN DEBIT CARD
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Ecobank Nigeria</span>
          </div>

          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.4rem 0" }}>
            Activate Your Naira Virtual Card
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#475569", margin: "0 0 1.15rem 0", lineHeight: 1.5 }}>
            Select your preferred card network below to issue your Ecobank Naira debit card linked directly to your EcoCampus wallet ({user.accountNumber}).
          </p>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: "0.76rem", fontWeight: 800, color: "#334155", display: "block", marginBottom: "0.5rem" }}>
              Select Card Network (Verve Default)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {(["VERVE", "VISA", "MASTERCARD"] as CardNetwork[]).map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setLocalNetworkChoice(net)}
                  style={{
                    padding: "0.65rem 0.4rem",
                    borderRadius: "0.75rem",
                    fontWeight: 800,
                    fontSize: "0.74rem",
                    border: localNetworkChoice === net ? "2px solid #007749" : "1px solid #cbd5e1",
                    background: localNetworkChoice === net ? "#ecfdf5" : "#ffffff",
                    color: localNetworkChoice === net ? "#007749" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "0.85rem",
              borderRadius: "0.85rem",
              fontSize: "0.78rem",
              color: "#334155",
              marginBottom: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Linked NGN Account:</span>
              <strong>{user.accountNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Available NGN Balance:</span>
              <strong>{formatKoboToNaira(user.balanceKobo)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Issuance Fee:</span>
              <strong style={{ color: "#059669" }}>₦0.00 (Student Waiver)</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGetLocalCard}
            style={{
              width: "100%",
              backgroundColor: "#007749",
              color: "#ffffff",
              padding: "0.85rem",
              borderRadius: "0.85rem",
              fontWeight: 800,
              fontSize: "0.85rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(0, 119, 73, 0.25)",
            }}
          >
            Get {localNetworkChoice} Virtual Card
          </button>
        </div>
      ) : (
        <>
          {/* 180-Degree Flip Card (Front & Back CVV) */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              onClick={() => setIsFlipped((p) => !p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setIsFlipped((p) => !p);
              }}
              style={{
                perspective: "1200px",
                width: "100%",
                height: "232px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    background: getCardGradient(products.localCard.network),
                    borderRadius: "1.25rem",
                    padding: "1.35rem 1.5rem",
                    color: "#ffffff",
                    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.22)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "rgba(255, 255, 255, 0.16)",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "999px",
                      }}
                    >
                      <Image src="/brand/ecocampus-logo.png" alt="EcoCampus" width={20} height={20} style={{ objectFit: "contain" }} />
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#ffffff" }}>EcoCampus NGN</span>
                    </div>

                    <div>
                      {!imgError ? (
                        <Image
                          src="/brand/ecobank.png"
                          alt="Ecobank"
                          width={132}
                          height={40}
                          style={{
                            width: "auto",
                            height: "36px",
                            objectFit: "contain",
                            filter: "brightness(1.2) drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
                          }}
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <span style={{ fontSize: "1.25rem", fontWeight: 900, fontStyle: "italic" }}>Ecobank</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "32px",
                          background: "linear-gradient(135deg, #fde047 0%, #eab308 55%, #ca8a04 100%)",
                          borderRadius: "6px",
                          border: "1px solid rgba(113, 63, 18, 0.45)",
                        }}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2">
                        <path strokeLinecap="round" d="M8.5 14.5A4 4 0 0 1 8.5 9.5" />
                        <path strokeLinecap="round" d="M11.5 17A7.5 7.5 0 0 1 11.5 7" />
                        <path strokeLinecap="round" d="M14.5 19.5A11 11 0 0 1 14.5 4.5" />
                      </svg>
                    </div>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setHideBalance((p) => !p);
                      }}
                      style={{ textAlign: "right", cursor: "pointer" }}
                    >
                      <p style={{ margin: 0, fontSize: "0.58rem", textTransform: "uppercase", opacity: 0.85 }}>
                        NGN Wallet {hideBalance ? "(Hidden)" : "(Tap to Hide)"}
                      </p>
                      <p style={{ margin: 0, fontSize: "1.18rem", fontWeight: 900, fontFamily: "monospace", color: "#a7f3d0" }}>
                        {hideBalance ? "••••••••" : formatKoboToNaira(user.balanceKobo)}
                      </p>
                    </div>
                  </div>

                  <div style={{ fontSize: "1.18rem", fontFamily: "monospace", letterSpacing: "2.8px", fontWeight: 700, zIndex: 2 }}>
                    {displayedPan}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 2 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.2rem" }}>
                        <span style={{ fontSize: "0.55rem", opacity: 0.8, fontFamily: "monospace" }}>
                          VALID THRU {products.localCard.expiryDate}
                        </span>
                        <span style={{ fontSize: "0.55rem", background: "rgba(0,0,0,0.28)", padding: "0.12rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>
                          TAP FOR CVV &rarr;
                        </span>
                      </div>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: "0.82rem" }}>{user.fullName.toUpperCase()}</p>
                    </div>

                    <div>
                      {products.localCard.network === "VERVE" && (
                        <div style={{ background: "#0f172a", padding: "0.28rem 0.7rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "3px" }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                          <span style={{ fontSize: "0.86rem", fontWeight: 900, color: "#ffffff", fontStyle: "italic" }}>Verve</span>
                        </div>
                      )}
                      {products.localCard.network === "VISA" && (
                        <div style={{ background: "#ffffff", padding: "0.26rem 0.7rem", borderRadius: "6px" }}>
                          <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "#1d4ed8", fontStyle: "italic" }}>VISA</span>
                        </div>
                      )}
                      {products.localCard.network === "MASTERCARD" && (
                        <div style={{ display: "flex", alignItems: "center", background: "#ffffff", padding: "0.28rem 0.55rem", borderRadius: "6px" }}>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#ef4444" }} />
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f59e0b", marginLeft: "-8px", opacity: 0.9 }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* BACK (MAGNETIC STRIP & CVV) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: getCardGradient(products.localCard.network),
                    borderRadius: "1.25rem",
                    color: "#ffffff",
                    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.22)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    paddingBottom: "1.1rem",
                  }}
                >
                  <div style={{ width: "100%", height: "46px", background: "#0f172a", marginTop: "1.25rem" }} />

                  <div style={{ padding: "0 1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.58rem", opacity: 0.85, marginBottom: "0.25rem" }}>
                      <span>AUTHORIZED SIGNATURE</span>
                      <span>CVV (Card Verification Value)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          flex: 1,
                          height: "38px",
                          background: "repeating-linear-gradient(45deg, #f8fafc, #f8fafc 6px, #e2e8f0 6px, #e2e8f0 12px)",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          padding: "0 0.75rem",
                        }}
                      >
                        <span
                          style={{
                            background: "#ffffff",
                            color: "#0f172a",
                            fontFamily: "monospace",
                            fontWeight: 900,
                            fontSize: "1rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "3px",
                            letterSpacing: "2px",
                          }}
                        >
                          {products.localCard.cvv}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.65rem", lineHeight: 1.3, opacity: 0.9 }}>
                        <strong>Ecobank NGN</strong>
                        <br />
                        ecobank.com
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.6rem" }}>
                    <span>Issued by Ecobank Nigeria PLC.</span>
                    <span style={{ background: "rgba(0,0,0,0.3)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                      &larr; TAP FOR FRONT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <button
              type="button"
              onClick={() => setIsFlipped((p) => !p)}
              style={{
                padding: "0.65rem 0.4rem",
                borderRadius: "0.75rem",
                background: "#0f172a",
                border: "none",
                fontWeight: 700,
                fontSize: "0.74rem",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              {isFlipped ? "Show Front" : "Flip for CVV"}
            </button>
            <button
              type="button"
              onClick={() => setHideBalance((p) => !p)}
              style={{
                padding: "0.65rem 0.4rem",
                borderRadius: "0.75rem",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                fontWeight: 700,
                fontSize: "0.74rem",
                color: "#334155",
                cursor: "pointer",
              }}
            >
              {hideBalance ? "Show Amount" : "Hide Amount"}
            </button>
            <button
              type="button"
              onClick={handleCopyPan}
              style={{
                padding: "0.65rem 0.4rem",
                borderRadius: "0.75rem",
                background: "#007749",
                border: "none",
                fontWeight: 700,
                fontSize: "0.74rem",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              {copied ? "Copied!" : "Copy PAN"}
            </button>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              border: "1px solid #f1f5f9",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Switch Naira Card Scheme
              </h3>
              <button
                type="button"
                onClick={() => setMaskCardPan((p) => !p)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007749",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {maskCardPan ? "Unmask Digits" : "Mask Digits"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {(["VERVE", "VISA", "MASTERCARD"] as CardNetwork[]).map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => handleSwitchNetwork(net)}
                  style={{
                    padding: "0.55rem",
                    borderRadius: "0.65rem",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    border: products.localCard.network === net ? "2px solid #007749" : "1px solid #cbd5e1",
                    background: products.localCard.network === net ? "#ecfdf5" : "#ffffff",
                    color: products.localCard.network === net ? "#007749" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}