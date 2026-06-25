"use client";

import { useEffect, useState } from "react";
import CloseIcon from "./icons/CloseIcon";

type Phase = "push-sent" | "waiting" | "success";

export default function MpesaPayIframe() {
  const [phase, setPhase] = useState<Phase>("push-sent");
  const [dots, setDots] = useState(1);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amt = params.get("amount");
    if (amt) setAmount(Number(amt));
  }, []);

  // Animate waiting dots
  useEffect(() => {
    if (phase !== "waiting") return;
    const t = setInterval(() => setDots((d) => (d % 3) + 1), 600);
    return () => clearInterval(t);
  }, [phase]);

  // Auto-progress: push-sent → waiting → success → postMessage parent
  useEffect(() => {
    if (!amount) return;
    const t1 = setTimeout(() => setPhase("waiting"), 2000);
    const t2 = setTimeout(() => {
      setPhase("success");
      setTimeout(() => {
        window.parent.postMessage({ type: "MPESA_PAY_SUCCESS", amount }, "*");
      }, 1400);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [amount]);

  const handleClose = () => {
    window.parent.postMessage({ type: "MPESA_CLOSE" }, "*");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Green Mpesa header */}
      <div className="bg-gradient-to-br from-mpesa-green to-mpesa-green-dark px-6 pt-6 pb-5 text-center relative">
        {phase !== "success" && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full border-none bg-[rgba(255,255,255,0.2)] cursor-pointer flex items-center justify-center"
          >
            <CloseIcon size={14} color="white" variant="plain" />
          </button>
        )}
        <div className="text-[40px] mb-2">
          {phase === "success" ? "✅" : "📱"}
        </div>
        <h2 className="m-0 text-[17px] font-extrabold text-white">
          {phase === "push-sent" && "STK Push Sent"}
          {phase === "waiting" && "Waiting for payment…"}
          {phase === "success" && "Payment Received!"}
        </h2>
        <p className="mt-[5px] mb-0 text-[12px] text-[rgba(255,255,255,0.85)]">
          {phase === "push-sent" && "Check your phone for the M-Pesa prompt"}
          {phase === "waiting" && "Complete the payment on your phone"}
          {phase === "success" && "Your Betika balance has been updated"}
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {/* Amount summary */}
        <div className="bg-grey-100 rounded-[10px] px-4 py-3 mb-4 flex justify-between items-center">
          <div>
            <p className="m-0 text-[11px] text-grey-500 font-medium">DEPOSITING TO BETIKA</p>
            <p className="mt-0.5 mb-0 text-[13px] font-bold text-grey-900">+254 753 777 888</p>
          </div>
          <p className="m-0 text-[20px] font-extrabold text-mpesa-green-dark">KES {amount.toLocaleString()}</p>
        </div>

        {phase === "push-sent" && (
          <div className="text-center py-2">
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
            <div className="w-12 h-12 rounded-full border-[3px] border-grey-150 border-t-[3px] border-t-mpesa-green mx-auto mb-3 spinner" />
            <p className="m-0 text-[12px] text-grey-500">
              Waiting for confirmation{"." .repeat(dots)}
            </p>
            <p className="mt-2 mb-0 text-[11px] text-grey-300">This will complete automatically</p>
          </div>
        )}

        {phase === "success" && (
          <div className="fade-in text-center py-1 pb-2">
            <p className="m-0 text-[14px] text-grey-900 font-semibold">
              KES {amount.toLocaleString()} deposited successfully
            </p>
            <p className="mt-1.5 mb-0 text-[12px] text-grey-500">Closing automatically…</p>
          </div>
        )}
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
