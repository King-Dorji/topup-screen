"use client";

import { useEffect, useRef } from "react";
import CloseIcon from "./icons/CloseIcon";

interface CashiaModalProps {
  amount: number;
  cashiaBalance: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export default function CashiaModal({ amount, cashiaBalance, onClose, onSuccess }: CashiaModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "CASHIA_PAY_SUCCESS") onSuccess(amount);
      if (e.data?.type === "CASHIA_CLOSE") onClose();
      if (e.data?.type === "CASHIA_REDIRECT" && e.data.url) {
        window.location.href = e.data.url;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [amount, onSuccess, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fade-in fixed inset-0 bg-[rgba(10,16,26,0.75)] backdrop-blur-sm z-[200]" />

      {/* Modal shell — always an iframe */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div className="modal-enter pointer-events-auto w-[min(460px,100%)] h-[min(600px,calc(100vh-80px))] rounded-2xl overflow-hidden flex flex-col bg-white shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full border-none bg-[rgba(0,0,0,0.08)] cursor-pointer flex items-center justify-center"
          >
            <CloseIcon size={14} color="var(--color-grey-700)" variant="plain" />
          </button>
          <iframe
            ref={iframeRef}
            src={`/cashia-pay?amount=${amount}&balance=${cashiaBalance}`}
            className="w-full h-full border-none block"
            title="Cashia Payment"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </>
  );
}
