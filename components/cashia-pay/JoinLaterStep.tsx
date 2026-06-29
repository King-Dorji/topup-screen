"use client";

import { useEffect, useState } from "react";
import CashiaLogo from "../icons/CashiaLogo";
import CloseIcon from "../icons/CloseIcon";

type Phase = "push-sent" | "waiting" | "success";

interface Props {
  amount: string;
  phone: string;
  onSuccess: () => void;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length >= 12) {
    return `+254 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export default function JoinLaterStep({ amount, phone, onSuccess }: Props) {
  const [phase, setPhase] = useState<Phase>("push-sent");
  const [dots, setDots] = useState(1);

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
    const t = setTimeout(() => onSuccess(), 1200);
    return () => clearTimeout(t);
  }, [phase, onSuccess]);

  const handleClose = () => window.parent.postMessage({ type: "CASHIA_CLOSE" }, "*");

  const headerTitle = {
    "push-sent": "STK Push Sent",
    waiting: "Waiting for payment…",
    success: "Payment Received!",
  }[phase];

  const headerSubtitle = {
    "push-sent": "Check your phone for the M-Pesa prompt",
    waiting: "Complete the payment on your phone",
    success: "Your Betika balance has been updated",
  }[phase];

  return (
    <div
      className="fixed inset-0 bg-[rgba(10,16,26,0.75)] backdrop-blur-sm flex items-center justify-center p-4"
      onClick={phase !== "success" ? handleClose : undefined}
    >
      <div
        className="modal-enter w-[min(420px,100%)] rounded-[20px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.55)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-cashia-pink-500 to-cashia-pink-700 px-6 pt-7 pb-6 text-center relative">
          {phase !== "success" && (
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
            {phase === "success" ? "✅" : "📱"}
          </div>
          <h2 className="m-0 text-[18px] font-extrabold text-white">{headerTitle}</h2>
          <p className="mt-1.5 mb-0 text-[13px] text-[rgba(255,255,255,0.8)] leading-relaxed">
            {headerSubtitle}
          </p>
        </div>

        <div className="px-6 py-5">
          <div className="bg-cashia-pink-50 border border-cashia-pink-200 rounded-[10px] px-4 py-3 mb-4 flex justify-between items-center">
            <div>
              <p className="m-0 text-[11px] text-grey-500 font-medium">DEPOSITING TO BETIKA</p>
              <p className="mt-0.5 mb-0 text-[13px] font-bold text-grey-900">{formatPhone(phone)}</p>
            </div>
            <p className="m-0 text-[20px] font-extrabold text-cashia-pink-500">KES {Number(amount).toLocaleString()}</p>
          </div>

          {phase === "push-sent" && (
            <div className="text-center py-2">
              <div className="flex justify-center gap-1.5 mb-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "var(--color-cashia-pink-500)", opacity: 0.3,
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
              <div className="w-12 h-12 rounded-full border-[3px] border-grey-150 border-t-[3px] border-t-cashia-pink-500 mx-auto mb-3 spinner" />
              <p className="m-0 text-[12px] text-grey-500">Waiting for confirmation{"." .repeat(dots)}</p>
            </div>
          )}

          {phase === "success" && (
            <div className="fade-in text-center py-1 pb-2">
              <p className="m-0 text-[14px] text-grey-900 font-semibold">
                KES {Number(amount).toLocaleString()} deposited successfully
              </p>
              <p className="mt-1.5 mb-0 text-[12px] text-grey-500">Closing automatically…</p>
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
