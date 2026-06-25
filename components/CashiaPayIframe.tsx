"use client";

import { useEffect, useRef, useState } from "react";
import CashiaLogo from "./icons/CashiaLogo";
import LockIcon from "./icons/LockIcon";
import LoadingStep from "./cashia-pay/LoadingStep";
import OTPStep, { OTP_LENGTH } from "./cashia-pay/OTPStep";
import SuccessStep from "./cashia-pay/SuccessStep";
import InsufficientStep from "./cashia-pay/InsufficientStep";

const DUMMY_OTP = "123456";

type Step = "loading" | "otp" | "success" | "error" | "insufficient";

export default function CashiaPayIframe() {
  const [step, setStep] = useState<Step>("loading");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isError, setIsError] = useState(false);
  const [amount, setAmount] = useState<string>("200");
  const [balance, setBalance] = useState<number>(Infinity);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amt = params.get("amount");
    const bal = params.get("balance");
    if (amt) setAmount(amt);
    if (bal) setBalance(Number(bal));

    const parsedAmt = Number(amt ?? 200);
    const parsedBal = Number(bal ?? Infinity);

    const timer = setTimeout(() => {
      setStep(parsedAmt > parsedBal ? "insufficient" : "otp");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (step === "otp") setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setIsError(false);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (digit && index === OTP_LENGTH - 1) verify([...next].join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      setIsError(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    if (pasted.length === OTP_LENGTH) verify(pasted);
    else inputRefs.current[pasted.length]?.focus();
  };

  const verify = (code: string) => {
    if (code === DUMMY_OTP) {
      setStep("success");
      setTimeout(() => window.parent.postMessage({ type: "CASHIA_PAY_SUCCESS", amount }, "*"), 1200);
    } else {
      setIsError(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  const isComplete = otp.filter(Boolean).length === OTP_LENGTH;

  if (step === "insufficient") {
    return <InsufficientStep amount={amount} balance={balance} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-grey-100 flex items-center gap-2.5">
        <CashiaLogo size={26} color="var(--color-cashia-pink-500)" />
        <span className="text-[18px] font-bold text-cashia-pink-500 tracking-[-0.3px]">Cashia</span>
        <div className="flex-1" />
        <span className="text-[12px] text-grey-500 bg-grey-50 py-[3px] px-2 rounded-[20px] border border-grey-150">
          Secure payment
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-3">
        {step === "loading" && <LoadingStep />}
        {step === "otp" && (
          <OTPStep
            amount={amount}
            otp={otp}
            inputRefs={inputRefs}
            isError={isError}
            isComplete={isComplete}
            onChange={handleOtpChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onVerify={() => { if (isComplete) verify(otp.join("")); }}
          />
        )}
        {step === "success" && <SuccessStep amount={amount} />}
        {step === "error" && (
          <div className="fade-in text-center">
            <p className="text-system-red font-bold">Something went wrong.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-grey-100 flex items-center justify-center gap-1.5">
        <LockIcon />
        <span className="text-[11px] text-grey-400">256-bit SSL encrypted · Powered by Cashia</span>
      </div>
    </div>
  );
}
