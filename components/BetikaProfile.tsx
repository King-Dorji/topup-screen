"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import CashiaModal from "./CashiaModal";
import MpesaModal from "./MpesaModal";
import BellIcon from "./icons/BellIcon";
import ClipboardIcon from "./icons/ClipboardIcon";
import UserIcon from "./icons/UserIcon";
import WalletIcon from "./icons/WalletIcon";
import GiftIcon from "./icons/GiftIcon";
import CashiaLogo from "./icons/CashiaLogo";

const QUICK_AMOUNTS = [100, 200, 500, 1000];

// Simulated cashia balance — amounts > this trigger the "insufficient" redirect
const CASHIA_BALANCE = 500;

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--betika-bg)",
    color: "var(--betika-text)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,
  card: {
    background: "var(--betika-card)",
    border: "1px solid var(--betika-border)",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 12,
  } as React.CSSProperties,
};

export default function BetikaProfile() {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const [showCashiaModal, setShowCashiaModal] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parsedAmount = parseInt(amount || "0", 10);

  const handleQuickAmount = (n: number) =>
    setAmount((prev) => String(parseInt(prev || "0", 10) + n));

  const handleDepositCashia = () => {
    if (parsedAmount < 10) { inputRef.current?.focus(); return; }
    setShowCashiaModal(true);
  };

  const handleMpesa = () => {
    if (parsedAmount < 10) { inputRef.current?.focus(); return; }
    setShowMpesaModal(true);
  };

  const handlePaymentSuccess = (paid: number) => {
    setShowCashiaModal(false);
    setShowMpesaModal(false);
    setBalance((prev) => prev + paid);
    setBalanceUpdated(true);
    setAmount("");
    setTimeout(() => setBalanceUpdated(false), 1600);
  };

  return (
    <div style={s.page}>
      <BetikaNav />

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "var(--betika-card)",
            border: "2px solid var(--betika-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <UserIcon width={22} height={22} className="" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>(254) 706-576203</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--betika-subtext)" }}>Verified account</p>
          </div>
        </div>

        {/* Balance card */}
        <div style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <WalletIcon size={20} />
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "var(--betika-subtext)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>Balance</p>
              <p className={balanceUpdated ? "balance-updated" : ""} style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800 }}>
                KES {balance.toLocaleString()}
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 10 }}>
            <GiftIcon size={20} />
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "var(--betika-subtext)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>Bonus</p>
              <p style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800 }}>KES 0</p>
            </div>
          </div>
        </div>

        {/* Freebets / Jackpot */}
        <div style={{ ...s.card, display: "flex", gap: 0, padding: "14px 20px" }}>
          <div style={{ flex: 1, borderRight: "1px solid var(--betika-border)", paddingRight: 16 }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>Freebets &amp; Promotions</p>
            <button style={outlineBtn}>View all</button>
          </div>
          <div style={{ flex: 1, paddingLeft: 16 }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>Jackpot Streaks</p>
            <button style={outlineBtn}>View all</button>
          </div>
        </div>

        {/* Deposit card */}
        <div style={s.card}>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700 }}>Deposit</p>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--betika-subtext)" }}>Send money into your Betika account</p>

          {/* Amount input */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--betika-input-bg)", border: "1px solid var(--betika-border)", borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
            <button onClick={() => setAmount((p) => String(Math.max(0, parseInt(p || "0") - 1)))} style={pmBtn}>−</button>
            <input
              ref={inputRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to deposit"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--betika-text)", fontSize: 14, textAlign: "center" }}
            />
            <button onClick={() => setAmount((p) => String(parseInt(p || "0") + 1))} style={pmBtn}>+</button>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 11, color: "var(--betika-subtext)" }}>Minimum KES 10. All transactions are subject to 5% tax.</p>

          {/* Quick amounts */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {QUICK_AMOUNTS.map((n) => (
              <button key={n} onClick={() => handleQuickAmount(n)} style={quickBtn}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2c4a6e")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--betika-card-inner)")}>
                +{n}
              </button>
            ))}
          </div>

          {/* Deposit buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={specialBadge}>Special Offer</span>
              <button onClick={handleDepositCashia} style={{ ...cashiaBtn }}>
                <CashiaLogo size={18} color="white" />
                Deposit with Cashia
              </button>
            </div>
            <button onClick={handleMpesa} style={mpesaBtn}>
              <MpesaCircleIcon />
              Deposit with Mpesa
            </button>
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 11, color: "var(--betika-subtext)" }}>
            🎁 3 Free deposits daily! Only with Cashia
          </p>
        </div>

        {/* Withdrawals card */}
        <div style={s.card}>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700 }}>Withdrawals</p>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--betika-subtext)" }}>Withdraw money from your Betika wallet</p>

          <div style={{ display: "flex", alignItems: "center", background: "var(--betika-input-bg)", border: "1px solid var(--betika-border)", borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
            <button style={pmBtn}>−</button>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--betika-text)", fontSize: 14, textAlign: "center" }}
            />
            <button style={pmBtn}>+</button>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 11, color: "var(--betika-subtext)" }}>Minimum KES 50, Maximum KES 300,000. All transactions are subject to 5% tax.</p>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={specialBadge}>Special Offer</span>
              <button style={{ ...cashiaBtn }}>
                <CashiaLogo size={18} color="white" />
                Withdraw with Cashia
              </button>
            </div>
            <button style={{ ...mpesaBtn, background: "transparent", border: "1px solid var(--betika-border)" }}>
              <MpesaCircleIcon muted />
              Withdraw with Mpesa
            </button>
          </div>
        </div>
      </div>

      {/* Cashia payment modal (OTP flow + insufficient balance) */}
      {showCashiaModal && (
        <CashiaModal
          amount={parsedAmount}
          cashiaBalance={CASHIA_BALANCE}
          onClose={() => setShowCashiaModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Mpesa STK push simulation */}
      {showMpesaModal && (
        <MpesaModal
          amount={parsedAmount}
          onClose={() => setShowMpesaModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

/* ─── Nav ─────────────────────────────────────────────────────────────────── */

const NAV_ITEMS = ["Home", "Live (185)", "Jackpots", "Shishika Bet (1)", "Aviator", "World Cup Hub", "Ligi Bigi", "Casino", "Promotions (16)", "Leaderboard", "Virtuals", "Betika Fasta", "Crash Games", "Live Score"];

function BetikaNav() {
  return (
    <nav style={{ background: "#1a2332", borderBottom: "1px solid #222f45", position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top row */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 52, gap: 20 }}>
        <Image src="/betika-logo.png" alt="Betika" width={90} height={30} style={{ objectFit: "contain" }} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <NavAction icon={<BellIcon size={16} color="#a0aec0" />} label="Notifications" />
          <NavAction icon={<ClipboardIcon size={16} color="#a0aec0" />} label="My Bets" />
          <NavAction icon={<UserIcon width={16} height={16} className="" />} label="Profile" active />
          <button style={{ background: "#4CAF50", color: "#fff", border: "none", borderRadius: 6, padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.2px" }}>
            Deposit
          </button>
        </div>
      </div>

      {/* Sub nav */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none", borderTop: "1px solid #222f45" }}>
        {NAV_ITEMS.map((item, i) => (
          <button key={item} style={{
            background: "none", border: "none", color: i === 0 ? "#fff" : "#8a9bb5",
            fontSize: 12, fontWeight: i === 0 ? 600 : 400, cursor: "pointer",
            padding: "9px 12px", whiteSpace: "nowrap",
            borderBottom: i === 0 ? "2px solid #4CAF50" : "2px solid transparent",
          }}>
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

function NavAction({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: active ? "#fff" : "#8a9bb5", fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer" }}>
      {icon}
      {label}
    </button>
  );
}

/* ─── Shared styles ───────────────────────────────────────────────────────── */

const outlineBtn: React.CSSProperties = {
  background: "none", border: "1px solid var(--betika-border)",
  color: "#c8b84a", borderRadius: 6, padding: "5px 14px",
  fontSize: 12, fontWeight: 600, cursor: "pointer",
};

const pmBtn: React.CSSProperties = {
  padding: "13px 18px", background: "none", border: "none",
  color: "var(--betika-subtext)", cursor: "pointer", fontSize: 18, fontWeight: 700,
};

const quickBtn: React.CSSProperties = {
  flex: 1, padding: "9px 0", borderRadius: 6,
  border: "1px solid var(--betika-border)",
  background: "var(--betika-card-inner)", color: "var(--betika-text)",
  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.12s",
};

const specialBadge: React.CSSProperties = {
  position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
  background: "#f5c518", color: "#1a2332", fontSize: 10, fontWeight: 800,
  padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap", zIndex: 1,
};

const cashiaBtn: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
  padding: "12px 16px", borderRadius: 8, border: "none",
  background: "#dc1f5c", color: "#fff", fontSize: 13, fontWeight: 700,
  cursor: "pointer", transition: "background 0.15s",
};

const mpesaBtn: React.CSSProperties = {
  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
  padding: "12px 16px", borderRadius: 8, border: "none",
  background: "#4CAF50", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
};

/* ─── Icons ───────────────────────────────────────────────────────────────── */

function MpesaCircleIcon({ muted }: { muted?: boolean }) {
  const c = muted ? "#7e93b2" : "white";
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={muted ? "transparent" : "rgba(255,255,255,0.2)"} stroke={c} strokeWidth={1.5} />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="900" fill={c} fontFamily="Arial Black, sans-serif">M</text>
    </svg>
  );
}
