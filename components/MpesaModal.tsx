"use client";

import { useEffect } from "react";

interface MpesaModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export default function MpesaModal({ amount, onClose, onSuccess }: MpesaModalProps) {
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "MPESA_PAY_SUCCESS") onSuccess(e.data.amount ?? amount);
      if (e.data?.type === "MPESA_CLOSE") onClose();
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
        <div className="modal-enter pointer-events-auto w-[min(400px,100%)] rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          <iframe
            src={`/mpesa-pay?amount=${amount}`}
            className="w-full border-none block"
            style={{ height: "min(420px, calc(100vh - 80px))" }}
            title="M-Pesa Payment"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </>
  );
}
