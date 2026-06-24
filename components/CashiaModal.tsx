"use client";

import { useEffect, useRef, useState } from "react";
import CashiaLogo from "./icons/CashiaLogo";

interface CashiaModalProps {
  amount: number;
  cashiaBalance: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export default function CashiaModal({ amount, cashiaBalance, onClose, onSuccess }: CashiaModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasEnoughBalance = cashiaBalance >= amount;

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "CASHIA_PAY_SUCCESS") onSuccess(amount);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [amount, onSuccess]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fade-in" style={{ position: "fixed", inset: 0, background: "rgba(10,16,26,0.75)", backdropFilter: "blur(4px)", zIndex: 200 }} />

      {/* Centering wrapper */}
      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>

        {hasEnoughBalance ? (
          /* ── Normal OTP flow ── */
          <div className="modal-enter" style={{ pointerEvents: "auto", width: "min(460px, 100%)", height: "min(600px, calc(100vh - 80px))", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)" }}>
            <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, zIndex: 10, width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.08)", cursor: "pointer", fontSize: 13, color: "#49494a" }}>✕</button>
            <iframe ref={iframeRef} src={`/cashia-pay?amount=${amount}`} style={{ width: "100%", height: "100%", border: "none", display: "block" }} title="Cashia Payment" sandbox="allow-scripts allow-same-origin allow-forms" />
          </div>
        ) : (
          /* ── Insufficient balance redirect ── */
          <InsufficientBalanceCard amount={amount} cashiaBalance={cashiaBalance} onClose={onClose} />
        )}
      </div>
    </>
  );
}

/* ─── Insufficient balance card ──────────────────────────────────────────── */

function InsufficientBalanceCard({ amount, cashiaBalance, onClose }: { amount: number; cashiaBalance: number; onClose: () => void }) {
  const [phase, setPhase] = useState<"info" | "counting" | "redirecting">("info");
  const [count, setCount] = useState(5);
  const needed = amount - cashiaBalance;

  const startRedirect = () => {
    setPhase("counting");
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setPhase("redirecting");
          setTimeout(() => { window.location.href = "https://customer.cashia.com/login"; }, 400);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const circumference = 2 * Math.PI * 26;
  const progress = phase === "counting" ? (count / 5) * circumference : circumference;

  return (
    <div className="modal-enter" style={{ pointerEvents: "auto", width: "min(420px, 100%)", borderRadius: 20, background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)", overflow: "hidden" }}>

      {/* Pink gradient header */}
      <div style={{ background: "linear-gradient(135deg, #dc1f5c 0%, #ab1847 100%)", padding: "28px 24px 24px", textAlign: "center", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 13, color: "#fff" }}>✕</button>

        {/* Cashia logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <CashiaLogo size={28} color="white" />
          <span style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.3px" }}>Cashia</span>
        </div>

        {/* Warning icon */}
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 26 }}>
          💳
        </div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white" }}>Insufficient Balance</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
          Your Cashia wallet doesn&apos;t have enough funds for this deposit
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        {/* Balance breakdown */}
        <div style={{ background: "#fafafb", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: "1px solid #e9e9eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#89898a" }}>Deposit amount</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#202020" }}>KES {amount.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#89898a" }}>Your Cashia balance</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#17b530" }}>KES {cashiaBalance.toLocaleString()}</span>
          </div>
          <div style={{ height: 1, background: "#e9e9eb", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#89898a", fontWeight: 600 }}>Amount needed to top up</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#dc1f5c" }}>KES {needed.toLocaleString()}</span>
          </div>
        </div>

        {phase === "info" && (
          <>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#686869", lineHeight: 1.6, textAlign: "center" }}>
              Top up your Cashia wallet with at least <strong style={{ color: "#dc1f5c" }}>KES {needed.toLocaleString()}</strong> to complete this deposit.
            </p>
            <button
              onClick={startRedirect}
              style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: "#dc1f5c", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ab1847")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#dc1f5c")}
            >
              Top Up Cashia Wallet →
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "1px solid #e9e9eb", background: "transparent", color: "#89898a", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Cancel
            </button>
          </>
        )}

        {(phase === "counting" || phase === "redirecting") && (
          <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#686869" }}>
              {phase === "redirecting" ? "Redirecting you now…" : "Taking you to Cashia to top up…"}
            </p>

            {/* Countdown circle */}
            <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 16px" }}>
              <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
                <circle cx="36" cy="36" r="26" fill="none" stroke="#f3f2f2" strokeWidth="5" />
                <circle
                  cx="36" cy="36" r="26" fill="none"
                  stroke="#dc1f5c" strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {phase === "redirecting" ? (
                  <span style={{ fontSize: 18 }}>→</span>
                ) : (
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#dc1f5c" }}>{count}</span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fbf5f9", border: "1px solid #f3b8cc", borderRadius: 8, padding: "8px 14px" }}>
              <CashiaLogo size={14} color="#dc1f5c" />
              <span style={{ fontSize: 12, color: "#dc1f5c", fontWeight: 600 }}>customer.cashia.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
