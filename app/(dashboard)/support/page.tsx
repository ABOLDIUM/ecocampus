"use client";

import React, { useState } from "react";
import styles from "../transfers/transfer.module.css";

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: "How do I qualify for the 0% student loan?", a: "Must be a verified 200 level or above undergraduate with Second Class Lower standing." },
    { q: "When do I get my ₦4,000 referral reward?", a: "Automatically credited to your balance once 3 invited friends successfully verify their student or NYSC accounts." },
    { q: "Are my transactions secure?", a: "All internal transfers use atomic double-entry database transactions with encrypted session controls." },
  ];

  return (
    <main className={styles.transferContainer}>
      <header className={styles.headerRow}>
        <a href="/" className={styles.backLink}>
          &lt; Home
        </a>
        <h1 className={styles.title}>Customer Support &amp; AI</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className={styles.card} style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.6rem" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#003b73", marginBottom: "0.2rem" }}>{faq.q}</p>
              <p style={{ fontSize: "0.78rem", color: "#475569" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
          Submit Support Ticket
        </h2>
        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className={styles.formGroup}>
              <label className={styles.label}>Subject</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="e.g. Verification status inquiry"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Message</label>
              <textarea
                rows={3}
                required
                className={styles.textarea}
                placeholder="Describe your issue..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitBtn}>
              Send to Support Desk
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#16a34a", marginBottom: "0.4rem" }}>✓ Ticket Submitted Successfully</p>
            <p style={{ fontSize: "0.78rem", color: "#64748b" }}>Our support team will respond via email shortly.</p>
          </div>
        )}
      </div>
    </main>
  );
}