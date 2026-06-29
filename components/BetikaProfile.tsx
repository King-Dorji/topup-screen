"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BellIcon from "./icons/BellIcon";
import ClipboardIcon from "./icons/ClipboardIcon";
import UserIcon from "./icons/UserIcon";
import WalletIcon from "./icons/WalletIcon";
import GiftIcon from "./icons/GiftIcon";
import CashiaLogo from "./icons/CashiaLogo";
import MpesaIcon from "./icons/MpesaIcon";

const QUICK_AMOUNTS = [100, 200, 500, 1000];

// Simulated cashia balance — amounts > this trigger the "insufficient" redirect
const CASHIA_BALANCE = 500;
const BETIKA_PHONE = "254706575204";

export default function BetikaProfile() {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const [showCashiaModal, setShowCashiaModal] = useState(false);
  const [cashiaMember, setCashiaMember] = useState(true);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parsedAmount = parseInt(amount || "0", 10);

  const handleQuickAmount = (n: number) =>
    setAmount((prev) => String(parseInt(prev || "0", 10) + n));

  const handleDepositCashia = (member: boolean) => {
    if (parsedAmount < 10) { inputRef.current?.focus(); return; }
    setCashiaMember(member);
    if (member) {
      setCheckingBalance(true);
      setTimeout(() => {
        setCheckingBalance(false);
        setShowCashiaModal(true);
      }, 1500);
    } else {
      setShowCashiaModal(true);
    }
  };

  const handlePaymentSuccess = (paid: number) => {
    setShowCashiaModal(false);
    setBalance((prev) => prev + paid);
    setBalanceUpdated(true);
    setAmount("");
    setTimeout(() => setBalanceUpdated(false), 1600);
  };

  // Listen for postMessage from Cashia and Mpesa iframes
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "CASHIA_PAY_SUCCESS") handlePaymentSuccess(Number(e.data.amount));
      if (e.data?.type === "CASHIA_CLOSE") setShowCashiaModal(false);
      if (e.data?.type === "CASHIA_REDIRECT" && e.data.url) window.location.href = e.data.url;
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const card = "bg-betika-card border border-betika-border rounded-xl p-4 mb-3";

  return (
    <div className="min-h-screen bg-betika-bg text-betika-text">
      <BetikaNav />

      <div className="max-w-[780px] mx-auto px-4 pt-6 pb-[60px]">
        {/* Profile header — row layout, centered */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-[52px] h-[52px] rounded-full bg-betika-avatar flex items-center justify-center">
            <UserIcon width={22} height={22} className="" />
          </div>
          <p className="m-0 text-[17px] font-bold">(254) 706-576203</p>
        </div>

        {/* Balance card */}
        <div className={`${card} flex justify-between items-center`}>
          <div className="flex items-center gap-2.5">
            <WalletIcon size={20} />
            <div>
              <p className="m-0 text-[11px] text-betika-subtext font-medium uppercase tracking-[0.6px]">Balance</p>
              <p className={`mt-0.5 mb-0 text-[14px] font-bold ${balanceUpdated ? "balance-updated" : ""}`}>
                KES {balance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right flex items-center gap-2.5">
            <GiftIcon size={20} />
            <div>
              <p className="m-0 text-[11px] text-betika-subtext font-medium uppercase tracking-[0.6px]">Bonus</p>
              <p className="mt-0.5 mb-0 text-[14px] font-bold">KES 0</p>
            </div>
          </div>
        </div>

        {/* Freebets / Jackpot */}
        <div className={`${card} flex gap-0 py-3.5 px-5`}>
          <div className="flex-1 border-r border-betika-border pr-4">
            <p className="m-0 mb-2 text-[13px] font-semibold">Freebets &amp; Promotions</p>
            <button className="bg-betika-btn-bg border-none text-betika-green-dark rounded-md px-3.5 py-[5px] text-[12px] font-semibold cursor-pointer">View all</button>
          </div>
          <div className="flex-1 pl-4">
            <p className="m-0 mb-2 text-[13px] font-semibold">Jackpot Streaks</p>
            <button className="bg-betika-btn-bg border-none text-betika-green-dark rounded-md px-3.5 py-[5px] text-[12px] font-semibold cursor-pointer">View all</button>
          </div>
        </div>

        {/* Deposit card */}
        <div className={card}>
          <p className="m-0 mb-0.5 text-[16px] font-bold">Deposit</p>
          <p className="m-0 mb-3.5 text-[12px] text-betika-subtext">Send money into your Betika account</p>

          {/* Amount input */}
          <div className="flex items-center bg-betika-input-bg border border-betika-border rounded-lg mb-1.5 overflow-hidden">
            <button onClick={() => setAmount((p) => String(Math.max(0, parseInt(p || "0") - 1)))} className="py-[13px] px-[18px] bg-transparent border-none text-betika-subtext cursor-pointer text-[18px] font-bold">−</button>
            <input
              ref={inputRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to deposit"
              className="flex-1 bg-transparent border-none outline-none text-betika-text text-[14px] text-center"
            />
            <button onClick={() => setAmount((p) => String(parseInt(p || "0") + 1))} className="py-[13px] px-[18px] bg-transparent border-none text-betika-subtext cursor-pointer text-[18px] font-bold">+</button>
          </div>
          <p className="m-0 mb-2.5 text-[11px] text-betika-subtext">Minimum KES 10. All transactions are subject to 5% tax.</p>

          {/* Quick amounts */}
          <div className="flex gap-2 mb-3.5">
            {QUICK_AMOUNTS.map((n) => (
              <button
                key={n}
                onClick={() => handleQuickAmount(n)}
                className="flex-1 py-[9px] rounded-[20px] border border-betika-border bg-betika-card-inner text-betika-text text-[13px] font-semibold cursor-pointer transition-colors duration-[120ms] hover:bg-betika-border"
              >
                +{n}
              </button>
            ))}
          </div>

          {/* Deposit buttons */}
          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <span className="absolute top-[-8px] right-2 bg-[rgba(255,235,240,0.9)] text-cashia-pink-500 text-[9px] font-bold px-[7px] py-0.5 rounded-[20px] whitespace-nowrap z-[1] tracking-[0.2px]">Special Offer</span>
              <button
                onClick={() => handleDepositCashia(true)}
                disabled={checkingBalance}
                className="w-full flex items-center justify-center gap-[7px] py-3 px-4 rounded-lg border-none bg-cashia-pink-500 text-white text-[13px] font-bold cursor-pointer transition-colors duration-[150ms] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {checkingBalance ? (
                  <>
                    <span className="w-[14px] h-[14px] rounded-full border-2 border-white/30 border-t-white spinner shrink-0" />
                    Checking balance…
                  </>
                ) : (
                  <>
                    <CashiaLogo size={18} color="white" />
                    Deposit with Cashia
                  </>
                )}
              </button>
            </div>
            <div className="relative flex-1">
              <span className="absolute top-[-8px] right-2 bg-[rgba(255,235,240,0.9)] text-cashia-pink-500 text-[9px] font-bold px-[7px] py-0.5 rounded-[20px] whitespace-nowrap z-[1] tracking-[0.2px]">New to Cashia?</span>
              <button
                onClick={() => handleDepositCashia(false)}
                className="w-full flex items-center justify-center gap-[7px] py-3 px-4 rounded-lg border border-cashia-pink-200 bg-cashia-pink-50 text-cashia-pink-500 text-[13px] font-bold cursor-pointer hover:bg-cashia-pink-100 transition-colors duration-[150ms]"
              >
                <CashiaLogo size={18} color="var(--color-cashia-pink-500)" />
                Deposit with Cashia
              </button>
            </div>
          </div>

          <p className="mt-2.5 mb-0 text-[14px] text-betika-subtext">
            3 Free deposits daily! Only with Cashia
          </p>
        </div>

        {/* Withdrawals card */}
        <div className={card}>
          <p className="m-0 mb-0.5 text-[16px] font-bold">Withdrawals</p>
          <p className="m-0 mb-3.5 text-[12px] text-betika-subtext">Withdraw money from your Betika wallet</p>

          <div className="flex items-center bg-betika-input-bg border border-betika-border rounded-lg mb-1.5 overflow-hidden">
            <button className="py-[13px] px-[18px] bg-transparent border-none text-betika-subtext cursor-pointer text-[18px] font-bold">−</button>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="flex-1 bg-transparent border-none outline-none text-betika-text text-[14px] text-center"
            />
            <button className="py-[13px] px-[18px] bg-transparent border-none text-betika-subtext cursor-pointer text-[18px] font-bold">+</button>
          </div>
          <p className="m-0 mb-3.5 text-[11px] text-betika-subtext">Minimum KES 50, Maximum KES 300,000. All transactions are subject to 5% tax.</p>

          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <span className="absolute top-[-8px] right-2 bg-[rgba(255,235,240,0.9)] text-cashia-pink-500 text-[9px] font-bold px-[7px] py-0.5 rounded-[20px] whitespace-nowrap z-[1] tracking-[0.2px]">Special Offer</span>
              <button className="w-full flex items-center justify-center gap-[7px] py-3 px-4 rounded-lg border-none bg-cashia-pink-500 text-white text-[13px] font-bold cursor-pointer transition-colors duration-[150ms]">
                <CashiaLogo size={18} color="white" />
                Withdraw with Cashia
              </button>
            </div>
            <button className="flex-1 flex items-center justify-center gap-[7px] py-3 px-4 rounded-lg border border-betika-border bg-transparent text-betika-subtext text-[13px] font-bold cursor-pointer">
              <MpesaIcon size={14} color="var(--color-betika-subtext)" />
              Withdraw with Mpesa
            </button>
          </div>
        </div>
      </div>

      {/* Cashia — fullscreen iframe, owns its own backdrop and card */}
      {showCashiaModal && (
        <iframe
          src={`/cashia-pay?amount=${parsedAmount}&phone=${BETIKA_PHONE}&member=${cashiaMember}${cashiaMember ? `&balance=${CASHIA_BALANCE}` : ""}`}
          style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: "none", zIndex: 200 }}
          title="Cashia Payment"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      )}
    </div>
  );
}

/* ─── Nav ─────────────────────────────────────────────────────────────────── */

const NAV_ITEMS = ["Home", "Live (185)", "Jackpots", "Shishika Bet (1)", "Aviator", "World Cup Hub", "Ligi Bigi", "Casino", "Promotions (16)", "Leaderboard", "Virtuals", "Betika Fasta", "Crash Games", "Live Score"];

function BetikaNav() {
  return (
    <nav className="bg-betika-nav sticky top-0 z-[100]">
      {/* Top row */}
      <div className="max-w-[1280px] mx-auto px-4 flex items-center h-[52px] gap-5">
        <Image src="/betika-logo.png" alt="Betika" width={90} height={30} style={{ objectFit: "contain" }} />
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <NavAction icon={<BellIcon size={16} color="var(--betika-subtext)" />} label="Notifications" />
          <NavAction icon={<ClipboardIcon size={16} color="var(--betika-subtext)" />} label="My Bets" />
          <NavAction icon={<UserIcon width={16} height={16} className="" />} label="Profile" active />
          {/* Deposit button — orange bg, green text */}
          <button className="bg-betika-accent text-betika-bg border-none rounded-lg py-[7px] px-5 text-[13px] font-bold cursor-pointer">
            Deposit
          </button>
        </div>
      </div>

      {/* Sub nav */}
      <div className="max-w-[1280px] mx-auto px-4 flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {NAV_ITEMS.map((item) => (
          <button key={item} className="bg-transparent border-none text-betika-subtext text-[12px] font-normal cursor-pointer py-[9px] px-3 whitespace-nowrap border-b-2 border-transparent">
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

function NavAction({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex items-center gap-[5px] bg-transparent border-none text-[12px] cursor-pointer ${active ? "text-betika-green font-semibold" : "text-betika-subtext font-normal"}`}>
      {icon}
      {label}
    </button>
  );
}

