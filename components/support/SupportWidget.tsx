// ============================================================================
// ECOCAMPUS CUSTOMER CARE & SUPPORT DESK — COMPONENTS/SUPPORT/SUPPORTWIDGET.TSX
// ============================================================================

"use client";

import React, { useState } from "react";

interface ChatMessage {
  id: string;
  sender: "AGENT" | "USER";
  text: string;
  ticketRef?: string;
}

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "AGENT",
      text: "Hello! Welcome to EcoCampus Customer Care. How can we assist you with your banking, cards, or investments today?",
    },
  ]);

  function handleQuickIssue(topic: string) {
    submitMessage(topic);
  }

  function submitMessage(rawText: string) {
    const clean = rawText.trim();
    if (!clean) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "USER",
      text: clean,
    };

    const ticketId = `ECO-CS-${Math.floor(100000 + Math.random() * 900000)}`;
    const lower = clean.toLowerCase();
    let reply = `Thank you for reaching out. Your inquiry has been logged with reference ticket ${ticketId}. A customer service representative will attend to you shortly.`;

    if (lower.includes("transfer") || lower.includes("debit") || lower.includes("sent")) {
      reply = `We have received your transfer inquiry (${ticketId}). Interbank transfers typically settle within minutes. If there's any delay, our settlement team will automatically reconcile it.`;
    } else if (lower.includes("card") || lower.includes("cvv") || lower.includes("pin")) {
      reply = `Card Support (${ticketId}): You can view your card details or tap your virtual card anytime to reveal your secure CVV on the back.`;
    } else if (lower.includes("usd") || lower.includes("domiciliary") || lower.includes("rate")) {
      reply = `FX Desk (${ticketId}): USD Domiciliary funding is processed instantly at official CBN/Ecobank benchmark rates.`;
    }

    const agentMsg: ChatMessage = {
      id: `ag-${Date.now() + 1}`,
      sender: "AGENT",
      text: reply,
      ticketRef: ticketId,
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open Customer Care Support"
        style={{
          position: "fixed",
          bottom: "5.25rem",
          right: "1rem",
          zIndex: 9990,
          background: "linear-gradient(135deg, #007749 0%, #059669 100%)",
          color: "#ffffff",
          border: "2px solid #ffffff",
          borderRadius: "999px",
          padding: "0.6rem 0.95rem",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          boxShadow: "0 10px 25px rgba(0, 119, 73, 0.38)",
          cursor: "pointer",
          fontWeight: 800,
          fontSize: "0.76rem",
        }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
          />
        </svg>
        <span>Support</span>
      </button>

      {isOpen && (
        <aside
          aria-label="Customer Care Support"
          style={{
            position: "fixed",
            bottom: "8.5rem",
            right: "1rem",
            left: "1rem",
            maxWidth: "410px",
            marginLeft: "auto",
            background: "#ffffff",
            borderRadius: "1.25rem",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.32)",
            border: "1px solid #cbd5e1",
            zIndex: 9995,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "72dvh",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              color: "#ffffff",
              padding: "0.9rem 1.1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800 }}>EcoCampus Customer Support</h3>
              <p style={{ margin: 0, fontSize: "0.68rem", color: "#34d399" }}>● We are online to assist you</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "#ffffff",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              padding: "0.6rem 0.9rem",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              gap: "0.4rem",
              overflowX: "auto",
            }}
          >
            {["Transfer Inquiry", "Card Activation", "USD Domiciliary", "Investment Help"].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleQuickIssue(topic)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "999px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  cursor: "pointer",
                }}
              >
                {topic}
              </button>
            ))}
          </div>

          <div
            style={{
              padding: "0.9rem",
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === "USER" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: m.sender === "USER" ? "#007749" : "#f1f5f9",
                  color: m.sender === "USER" ? "#ffffff" : "#0f172a",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.85rem",
                  fontSize: "0.76rem",
                  lineHeight: 1.45,
                }}
              >
                <div>{m.text}</div>
                {m.ticketRef && (
                  <div
                    style={{
                      marginTop: "0.35rem",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      color: "#059669",
                      fontFamily: "monospace",
                    }}
                  >
                    Ticket Ref: {m.ticketRef}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitMessage(input);
            }}
            style={{
              display: "flex",
              gap: "0.45rem",
              padding: "0.75rem",
              borderTop: "1px solid #e2e8f0",
              background: "#ffffff",
            }}
          >
            <input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: "0.55rem 0.75rem",
                borderRadius: "0.65rem",
                border: "1px solid #cbd5e1",
                fontSize: "0.78rem",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#007749",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.65rem",
                padding: "0 0.9rem",
                fontWeight: 800,
                fontSize: "0.76rem",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </aside>
      )}
    </>
  );
}