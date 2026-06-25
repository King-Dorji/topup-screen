"use client";

import { useEffect, useState } from "react";
import CashiaLogo from "../icons/CashiaLogo";
import CloseIcon from "../icons/CloseIcon";

interface Props {
  amount: string;
  balance: number;
}

export default function InsufficientStep({ amount, balance }: Props) {
  const [phase, setPhase] = useState<"info" | "counting" | "redirecting">("info");
  const [count, setCount] = useState(5);
  const needed = Number(amount) - balance;
  const circumference = 2 * Math.PI * 26;
  const progress = phase === "counting" ? (count / 5) * circumference : circumference;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.parent.postMessage({ type: "CASHIA_CLOSE" }, "*");
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const startRedirect = () => {
    setPhase("counting");
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setPhase("redirecting");
          setTimeout(() => {
            window.parent.postMessage({ type: "CASHIA_REDIRECT", url: "https://customer.cashia.com/login" }, "*");
          }, 400);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(10,16,26,0.75)] backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => window.parent.postMessage({ type: "CASHIA_CLOSE" }, "*")}
    >
    <div
      className="modal-enter w-[min(420px,100%)] rounded-[20px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.55)] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pink gradient header */}
      <div className="bg-gradient-to-br from-cashia-pink-500 to-cashia-pink-700 px-6 pt-7 pb-6 text-center relative">
        <button
          onClick={() => window.parent.postMessage({ type: "CASHIA_CLOSE" }, "*")}
          className="absolute top-3 right-3 w-7 h-7 rounded-full border-none bg-[rgba(255,255,255,0.2)] cursor-pointer flex items-center justify-center"
        >
          <CloseIcon size={14} color="white" variant="plain" />
        </button>
        <div className="flex items-center justify-center gap-2 mb-4">
          <CashiaLogo size={28} color="white" />
          <span className="text-[20px] font-extrabold text-white tracking-[-0.3px]">Cashia</span>
        </div>
        <div className="w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.15)] border-2 border-[rgba(255,255,255,0.3)] flex items-center justify-center mx-auto mb-3 text-[26px]">
          💳
        </div>
        <h2 className="m-0 text-[18px] font-extrabold text-white">Insufficient Balance</h2>
        <p className="mt-1.5 mb-0 text-[13px] text-[rgba(255,255,255,0.8)] leading-relaxed">
          Your Cashia wallet doesn&apos;t have enough funds for this deposit
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {/* Balance breakdown */}
        <div className="bg-grey-50 rounded-xl p-4 mb-4 border border-grey-150">
          <div className="flex justify-between mb-2">
            <span className="text-[12px] text-grey-500">Deposit amount</span>
            <span className="text-[13px] font-bold text-grey-900">KES {Number(amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[12px] text-grey-500">Your Cashia balance</span>
            <span className="text-[13px] font-bold text-system-green">KES {balance.toLocaleString()}</span>
          </div>
          <div className="h-px bg-grey-150 my-2.5" />
          <div className="flex justify-between">
            <span className="text-[12px] text-grey-500 font-semibold">Amount needed to top up</span>
            <span className="text-[14px] font-extrabold text-cashia-pink-500">KES {needed.toLocaleString()}</span>
          </div>
        </div>

        {phase === "info" && (
          <>
            <p className="m-0 mb-4 text-[13px] text-grey-600 leading-relaxed text-center">
              Top up your Cashia wallet with at least{" "}
              <strong className="text-cashia-pink-500">KES {needed.toLocaleString()}</strong>{" "}
              to complete this deposit.
            </p>
            <button
              onClick={startRedirect}
              className="w-full py-[13px] rounded-[10px] border-none bg-cashia-pink-500 hover:bg-cashia-pink-700 text-white text-[14px] font-bold cursor-pointer mb-2.5 transition-colors duration-[150ms]"
            >
              Top Up Cashia Wallet →
            </button>
            <button
              onClick={() => window.parent.postMessage({ type: "CASHIA_CLOSE" }, "*")}
              className="w-full py-[11px] rounded-[10px] border border-grey-150 bg-transparent text-grey-500 text-[13px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}

        {(phase === "counting" || phase === "redirecting") && (
          <div className="text-center py-2 pb-1">
            <p className="m-0 mb-4 text-[13px] text-grey-600">
              {phase === "redirecting" ? "Redirecting you now…" : "Taking you to Cashia to top up…"}
            </p>
            <div className="relative w-[72px] h-[72px] mx-auto mb-4">
              <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
                <circle cx="36" cy="36" r="26" fill="none" stroke="var(--color-grey-100)" strokeWidth="5" />
                <circle
                  cx="36" cy="36" r="26" fill="none"
                  stroke="var(--color-cashia-pink-500)" strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {phase === "redirecting"
                  ? <span className="text-[18px]">→</span>
                  : <span className="text-[22px] font-extrabold text-cashia-pink-500">{count}</span>}
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-cashia-pink-50 border border-cashia-pink-200 rounded-lg py-2 px-3.5">
              <CashiaLogo size={14} color="var(--color-cashia-pink-500)" />
              <span className="text-[12px] text-cashia-pink-500 font-semibold">customer.cashia.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
