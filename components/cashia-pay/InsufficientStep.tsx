"use client";

import { useEffect, useState } from "react";
import CashiaLogo from "../icons/CashiaLogo";
import CloseIcon from "../icons/CloseIcon";
import MpesaIcon from "../icons/MpesaIcon";

type Phase = "form" | "push-sent" | "waiting" | "success";

interface Props {
  amount: string;
  balance: number;
  onTopUpSuccess: (topUpAmount: number) => void;
}

export default function InsufficientStep({ amount, balance, onTopUpSuccess }: Props) {
  const needed = Number(amount) - balance;
  const [phase, setPhase] = useState<Phase>("form");
  const [topUpAmount, setTopUpAmount] = useState(String(needed));
  const [dots, setDots] = useState(1);
  const parsedTopUp = parseInt(topUpAmount || "0", 10);
  const isValidAmount = parsedTopUp >= needed && parsedTopUp > 0;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "form") {
        window.parent.postMessage({ type: "CASHIA_CLOSE" }, "*");
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const t = setInterval(() => setDots((d) => (d % 3) + 1), 600);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "push-sent") return;
    const t = setTimeout(() => setPhase("waiting"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const t = setTimeout(() => setPhase("success"), 3000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "success") return;
    const t = setTimeout(() => onTopUpSuccess(parsedTopUp), 1200);
    return () => clearTimeout(t);
  }, [phase, parsedTopUp, onTopUpSuccess]);

  const startTopUp = () => {
    if (!isValidAmount) return;
    setPhase("push-sent");
  };

  const handleClose = () => window.parent.postMessage({ type: "CASHIA_CLOSE" }, "*");

  const headerTitle = {
    form: "Insufficient Balance",
    "push-sent": "STK Push Sent",
    waiting: "Waiting for payment…",
    success: "Wallet Topped Up!",
  }[phase];

  const headerSubtitle = {
    form: "Your Cashia wallet doesn't have enough funds for this deposit",
    "push-sent": "Check your phone for the M-Pesa prompt",
    waiting: "Complete the payment on your phone",
    success: "Continuing with your Betika deposit…",
  }[phase];

  return (
    <div
      className="fixed inset-0 bg-[rgba(10,16,26,0.75)] backdrop-blur-sm flex items-center justify-center p-4"
      onClick={phase === "form" ? handleClose : undefined}
    >
      <div
        className="modal-enter w-[min(420px,100%)] rounded-[20px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.55)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-cashia-pink-500 to-cashia-pink-700 px-6 pt-7 pb-6 text-center relative">
          {phase === "form" && (
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full border-none bg-[rgba(255,255,255,0.2)] cursor-pointer flex items-center justify-center"
            >
              <CloseIcon size={14} color="white" variant="plain" />
            </button>
          )}
          <div className="flex items-center justify-center gap-2 mb-4">
            <CashiaLogo size={28} color="white" />
            <span className="text-[20px] font-extrabold text-white tracking-[-0.3px]">Cashia</span>
          </div>
          <div className="w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.15)] border-2 border-[rgba(255,255,255,0.3)] flex items-center justify-center mx-auto mb-3 text-[26px]">
            {phase === "success" ? "✅" : phase === "form" ? "💳" : "📱"}
          </div>
          <h2 className="m-0 text-[18px] font-extrabold text-white">{headerTitle}</h2>
          <p className="mt-1.5 mb-0 text-[13px] text-[rgba(255,255,255,0.8)] leading-relaxed">
            {headerSubtitle}
          </p>
        </div>

        <div className="px-6 py-5">
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
              <span className="text-[12px] text-grey-500 font-semibold">Minimum top up</span>
              <span className="text-[14px] font-extrabold text-cashia-pink-500">KES {needed.toLocaleString()}</span>
            </div>
          </div>

          {phase === "form" && (
            <>
              <label className="block text-[12px] font-semibold text-grey-600 mb-1.5">
                Top up amount (KES)
              </label>
              <input
                type="number"
                min={needed}
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value.replace(/\D/g, ""))}
                className="w-full py-3 px-3.5 rounded-[10px] border border-grey-150 bg-white text-[15px] font-bold text-grey-900 mb-1 outline-none focus:border-cashia-pink-500 transition-colors"
              />
              {!isValidAmount && topUpAmount !== "" && (
                <p className="m-0 mb-3 text-[11px] text-system-red">
                  Enter at least KES {needed.toLocaleString()}
                </p>
              )}
              {isValidAmount && <div className="mb-3" />}
              <p className="m-0 mb-4 text-[12px] text-grey-500 leading-relaxed text-center">
                Direct deposit — M-Pesa tops up your Cashia wallet, then your Betika deposit continues automatically.
              </p>
              <button
                onClick={startTopUp}
                disabled={!isValidAmount}
                className="w-full py-[13px] rounded-[10px] border-none bg-mpesa-green hover:bg-mpesa-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-bold cursor-pointer mb-2.5 transition-colors duration-[150ms] flex items-center justify-center gap-2"
              >
                <MpesaIcon size={16} color="white" />
                Top Up with M-Pesa
              </button>
              <button
                onClick={handleClose}
                className="w-full py-[11px] rounded-[10px] border border-grey-150 bg-transparent text-grey-500 text-[13px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}

          {phase === "push-sent" && (
            <div className="text-center py-2">
              <div className="bg-grey-100 rounded-[10px] px-4 py-3 mb-4 flex justify-between items-center">
                <div className="text-left">
                  <p className="m-0 text-[11px] text-grey-500 font-medium">TOPPING UP CASHIA WALLET</p>
                  <p className="mt-0.5 mb-0 text-[13px] font-bold text-grey-900">Direct deposit</p>
                </div>
                <p className="m-0 text-[20px] font-extrabold text-mpesa-green-dark">KES {parsedTopUp.toLocaleString()}</p>
              </div>
              <div className="flex justify-center gap-1.5 mb-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "var(--color-mpesa-green)", opacity: 0.3,
                      animation: `dotBounce 1s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
              <p className="m-0 text-[12px] text-grey-500">
                An M-Pesa STK push has been sent to your phone.<br />
                Enter your M-Pesa PIN to confirm.
              </p>
            </div>
          )}

          {phase === "waiting" && (
            <div className="text-center py-2">
              <div className="bg-grey-100 rounded-[10px] px-4 py-3 mb-4 flex justify-between items-center">
                <p className="m-0 text-[11px] text-grey-500 font-medium">TOPPING UP CASHIA WALLET</p>
                <p className="m-0 text-[20px] font-extrabold text-mpesa-green-dark">KES {parsedTopUp.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full border-[3px] border-grey-150 border-t-[3px] border-t-mpesa-green mx-auto mb-3 spinner" />
              <p className="m-0 text-[12px] text-grey-500">Waiting for confirmation{"." .repeat(dots)}</p>
            </div>
          )}

          {phase === "success" && (
            <div className="fade-in text-center py-1 pb-2">
              <p className="m-0 text-[14px] text-grey-900 font-semibold">
                KES {parsedTopUp.toLocaleString()} added to your Cashia wallet
              </p>
              <p className="mt-1.5 mb-0 text-[12px] text-grey-500">Resuming your deposit…</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
