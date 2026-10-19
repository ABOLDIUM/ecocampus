"use client";

import React from "react";

interface CompanyLogoProps {
  company: string;
  size?: number;
  className?: string;
}

export function CompanyLogo({ company, size = 32, className = "" }: CompanyLogoProps) {
  const norm = company.toLowerCase();

  // Ecobank
  if (norm.includes("ecobank")) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.25),
          background: "#002844",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: Math.max(2, Math.round(size * 0.08)),
          flexShrink: 0,
        }}
        title="Ecobank Nigeria"
      >
        <img
          src="/brand/q.png"
          alt="Ecobank"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  // NYSC / Federal Ministry
  if (norm.includes("nysc") || norm.includes("ministry") || norm.includes("federal")) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.25),
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: Math.max(2, Math.round(size * 0.06)),
          flexShrink: 0,
        }}
        title={company}
      >
        <img
          src="/brand/nysc.png"
          alt="NYSC / Federal Ministry"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  // Flutterwave
  if (norm.includes("flutterwave")) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.25),
          background: "#0A0E27",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: Math.max(2, Math.round(size * 0.1)),
          flexShrink: 0,
        }}
        title="Flutterwave"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <g transform="translate(4, 6)">
            <path
              d="M0 6C0 2.686 2.686 0 6 0h16c3.314 0 6 2.686 6 6s-2.686 6-6 6H9"
              stroke="#FF5A5F"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M28 17c0 3.314-2.686 6-6 6H6c-3.314 0-6-2.686-6-6s2.686-6 6-6h16"
              stroke="#3EC6FF"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M22 6c0 3.314-2.686 6-6 6H4"
              stroke="#FFB020"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Paystack
  if (norm.includes("paystack")) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.25),
          background: "#011B33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: Math.max(3, Math.round(size * 0.12)),
          flexShrink: 0,
        }}
        title="Paystack MFB"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <path d="M4 8h24a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4z" fill="#00C3F8" />
          <path d="M4 14h18a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4z" fill="#00C3F8" />
          <path d="M4 20h12a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4z" fill="#00C3F8" />
        </svg>
      </div>
    );
  }

  // Andela
  if (norm.includes("andela")) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.25),
          background: "#171C26",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: Math.max(2, Math.round(size * 0.1)),
          flexShrink: 0,
        }}
        title="Andela"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <path d="M18 5L30 18L25 23L18 16L11 23L6 18L18 5Z" fill="#335EEA" />
          <path d="M18 31L6 18L11 13L18 20L25 13L30 18L18 31Z" fill="#56CCF2" />
        </svg>
      </div>
    );
  }

  // Generic fallback
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
        background: "#007749",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: Math.round(size * 0.4),
        flexShrink: 0,
      }}
    >
      {company.slice(0, 2).toUpperCase()}
    </div>
  );
}
export default CompanyLogo;
