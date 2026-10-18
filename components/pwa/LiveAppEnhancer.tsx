"use client";

import React, { useEffect, useState, useRef } from "react";
import { getActiveUser, getUsers, saveUsers, EcoUser } from "@/lib/database/user-store";

export function playEcoNotificationSound(type: "CREDIT" | "DEBIT" = "CREDIT") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    if (type === "CREDIT") {
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.setValueAtTime(880, now + 0.12);
      osc2.frequency.setValueAtTime(1174.66, now + 0.12);
    } else {
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.1);
      osc2.frequency.setValueAtTime(659.25, now + 0.1);
    }

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.12);
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);
  } catch {}
}

export default function LiveAppEnhancer() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [liveAlert, setLiveAlert] = useState<{
    title: string;
    amount: string;
    sender: string;
  } | null>(null);

  const lastKnownBalanceRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    const dismissed = sessionStorage.getItem("eco_pwa_prompt_dismissed");
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(iosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) {
        setTimeout(() => setShowInstallBanner(true), 2000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (iosDevice && !dismissed) {
      setTimeout(() => setShowInstallBanner(true), 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Real-Time Dynamic Sync Polling (Every 2 seconds for automated updates)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const active = getActiveUser();
    if (active) {
      lastKnownBalanceRef.current = active.balanceKobo;
    }

    fetch("/api/users-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users: getUsers() }),
    }).catch(() => {});

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/users-sync", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.ok || !Array.isArray(data.users)) return;

        const serverUsers: EcoUser[] = data.users;
        const localUsers = getUsers();
        const currentActive = getActiveUser();

        let updatedActive: EcoUser | null = null;
        const merged = [...localUsers];

        for (const sUser of serverUsers) {
          const idx = merged.findIndex((u) => u.accountNumber === sUser.accountNumber);
          if (idx === -1) {
            merged.push(sUser);
          } else {
            const localTxLen = merged[idx].transactions?.length || 0;
            const serverTxLen = sUser.transactions?.length || 0;
            if (serverTxLen > localTxLen || sUser.balanceKobo !== merged[idx].balanceKobo) {
              merged[idx] = sUser;
            }
          }
          if (currentActive && sUser.accountNumber === currentActive.accountNumber) {
            updatedActive = sUser;
          }
        }

        saveUsers(merged);

        if (updatedActive && lastKnownBalanceRef.current !== null) {
          if (updatedActive.balanceKobo > lastKnownBalanceRef.current) {
            const diffNaira = (
              (updatedActive.balanceKobo - lastKnownBalanceRef.current) /
              100
            ).toLocaleString("en-NG", { minimumFractionDigits: 2 });
            const latestTx = updatedActive.transactions?.[0];

            playEcoNotificationSound("CREDIT");
            setLiveAlert({
              title: latestTx?.title || "Credit Alert!",
              amount: `+₦${diffNaira}`,
              sender: latestTx?.counterpartyName || "EcoCampus Transfer",
            });

            window.dispatchEvent(new Event("storage"));
            setTimeout(() => setLiveAlert(null), 6500);
          } else if (updatedActive.balanceKobo < lastKnownBalanceRef.current) {
            playEcoNotificationSound("DEBIT");
            window.dispatchEvent(new Event("storage"));
          }
          lastKnownBalanceRef.current = updatedActive.balanceKobo;
        }
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert(
        "To install EcoCampus in full-screen on iPhone:\n1. Tap the Share button at the bottom of Safari.\n2. Scroll down and tap 'Add to Home Screen'."
      );
    }
  };

  const dismissBanner = () => {
    sessionStorage.setItem("eco_pwa_prompt_dismissed", "1");
    setShowInstallBanner(false);
  };

  return (
    <>
      {liveAlert && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99999,
            width: "92%",
            maxWidth: "400px",
            background: "linear-gradient(135deg, #003B65 0%, #005A9C 100%)",
            color: "#ffffff",
            borderRadius: "16px",
            padding: "14px 18px",
            boxShadow: "0 14px 34px rgba(0, 59, 101, 0.45)",
            border: "1px solid rgba(163, 217, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "#A3D900", fontWeight: 700, letterSpacing: "0.06em" }}>
              🔔 ECOBANK INSTANT CREDIT ALERT
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginTop: "2px" }}>
              {liveAlert.title}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.85 }}>From: {liveAlert.sender}</div>
          </div>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#A3D900" }}>
            {liveAlert.amount}
          </div>
        </div>
      )}

      {showInstallBanner && (
        <div
          style={{
            position: "fixed",
            bottom: "18px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99998,
            width: "92%",
            maxWidth: "380px",
            background: "#0B192C",
            color: "#ffffff",
            borderRadius: "16px",
            padding: "14px 18px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
            border: "1px solid rgba(0, 130, 198, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#A3D900" }}>
            Install EcoCampus App
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleInstallClick}
              style={{
                background: "linear-gradient(135deg, #0082C6 0%, #66B032 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Install
            </button>
            <button
              onClick={dismissBanner}
              style={{
                background: "transparent",
                color: "#94a3b8",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                padding: "4px",
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}