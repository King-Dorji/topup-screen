"use client";

import { useEffect, useState } from "react";
import CashiaLogo from "../icons/CashiaLogo";

type Phase = "id-input" | "verifying" | "creating" | "complete";

interface Props {
  phone: string;
  onComplete: () => void;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length >= 12) {
    return `+254 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  if (digits.length === 9) {
    return `+254 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export default function OnboardingStep({ phone, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("id-input");
  const [idNumber, setIdNumber] = useState("");
  const parsedId = idNumber.replace(/\D/g, "");
  const isValidId = parsedId.length >= 7 && parsedId.length <= 8;

  useEffect(() => {
    if (phase !== "verifying") return;
    const t = setTimeout(() => setPhase("creating"), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "creating") return;
    const t = setTimeout(() => setPhase("complete"), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "complete") return;
    const t = setTimeout(() => onComplete(), 1400);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const handleSubmit = () => {
    if (!isValidId) return;
    setPhase("verifying");
  };

  if (phase !== "id-input") {
    const messages = {
      verifying: { title: "Verifying your ID", subtitle: "Confirming your details with the national registry…" },
      creating: { title: "Setting up your wallet", subtitle: "Creating your Cashia account…" },
      complete: { title: "Welcome to Cashia!", subtitle: "Your wallet is ready. Top up to complete your Betika deposit." },
    }[phase];

    return (
      <div className="fade-in w-full max-w-[360px] flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-cashia-pink-50 border border-cashia-pink-200 flex items-center justify-center mb-4">
          {phase === "complete" ? (
            <span className="text-[28px]">🎉</span>
          ) : (
            <div className="w-8 h-8 rounded-full border-[3px] border-grey-150 border-t-cashia-pink-500 spinner" />
          )}
        </div>
        <p className="m-0 text-[17px] font-bold text-grey-900">{messages.title}</p>
        <p className="mt-1.5 mb-0 text-[13px] text-grey-500 leading-relaxed max-w-[280px]">{messages.subtitle}</p>
        {phase === "complete" && (
          <div className="mt-4 flex items-center gap-2 bg-cashia-pink-50 border border-cashia-pink-200 rounded-lg py-2 px-3.5">
            <CashiaLogo size={14} color="var(--color-cashia-pink-500)" />
            <span className="text-[12px] text-cashia-pink-500 font-semibold">Cashia member</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fade-in w-full max-w-[360px] flex flex-col">
      <div className="text-center mb-5">
        <div className="w-12 h-12 rounded-full bg-cashia-pink-50 border border-cashia-pink-200 flex items-center justify-center mx-auto mb-3">
          <CashiaLogo size={22} color="var(--color-cashia-pink-500)" />
        </div>
        <p className="m-0 text-[17px] font-bold text-grey-900">Verify your identity</p>
        <p className="mt-1.5 mb-0 text-[13px] text-grey-500 leading-relaxed">
          Enter your National ID number to create your Cashia account
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-[12px] font-semibold text-grey-600 mb-1.5">
          Phone number <span className="font-normal text-grey-400">(from Betika)</span>
        </label>
        <div className="py-3 px-3.5 rounded-[10px] border border-grey-150 bg-grey-50 text-[14px] font-semibold text-grey-700">
          {formatPhone(phone)}
        </div>
      </div>

      <div className="mb-1">
        <label className="block text-[12px] font-semibold text-grey-600 mb-1.5">
          National ID number
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={8}
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
          placeholder="e.g. 12345678"
          className="w-full py-3 px-3.5 rounded-[10px] border border-grey-150 bg-white text-[15px] font-bold text-grey-900 outline-none focus:border-cashia-pink-500 transition-colors tracking-[2px]"
          autoFocus
        />
      </div>
      {!isValidId && idNumber.length > 0 && (
        <p className="m-0 mb-3 text-[11px] text-system-red">Enter a valid 7–8 digit ID number</p>
      )}
      {isValidId && <div className="mb-3" />}

      <p className="m-0 mb-4 text-[11px] text-grey-400 leading-relaxed">
        By continuing, you agree to Cashia&apos;s Terms of Service and Privacy Policy.
        Your ID is used only to verify your identity.
      </p>

      <button
        onClick={handleSubmit}
        disabled={!isValidId}
        className="w-full py-[13px] rounded-[10px] border-none bg-cashia-pink-500 hover:bg-cashia-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-bold cursor-pointer transition-colors duration-[150ms]"
      >
        Create my Cashia account
      </button>
    </div>
  );
}
