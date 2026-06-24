"use client";

import { useEffect, useState } from "react";

interface MpesaModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

type Phase = "push-sent" | "waiting" | "success";

export default function MpesaModal({ amount, onClose, onSuccess }: MpesaModalProps) {
  const [phase, setPhase] = useState<Phase>("push-sent");
  const [dots, setDots] = useState(1);

  // Animate waiting dots
  useEffect(() => {
    if (phase !== "waiting") return;
    const t = setInterval(() => setDots((d) => (d % 3) + 1), 600);
    return () => clearInterval(t);
  }, [phase]);

  // Auto-progress: push-sent → waiting → success
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("waiting"), 2000);
    const t2 = setTimeout(() => {
      setPhase("success");
      setTimeout(() => onSuccess(amount), 1400);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [amount, onSuccess]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape" && phase !== "success") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, phase]);

  return (
    <>
      <div onClick={phase !== "success" ? onClose : undefined} className="fade-in"
        style={{ position: "fixed", inset: 0, background: "rgba(10,16,26,0.75)", backdropFilter: "blur(4px)", zIndex: 200 }} />

      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>
        <div className="modal-enter" style={{ pointerEvents: "auto", width: "min(400px, 100%)", borderRadius: 20, background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", overflow: "hidden" }}>

          {/* Green Mpesa header */}
          <div style={{ background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", padding: "24px 24px 20px", textAlign: "center", position: "relative" }}>
            {phase !== "success" && (
              <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 13, color: "#fff" }}>✕</button>
            )}
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {phase === "success" ? "✅" : "📱"}
            </div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "white" }}>
              {phase === "push-sent" && "STK Push Sent"}
              {phase === "waiting" && "Waiting for payment…"}
              {phase === "success" && "Payment Received!"}
            </h2>
            <p style={{ margin: "5px 0 0", fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
              {phase === "push-sent" && "Check your phone for the M-Pesa prompt"}
              {phase === "waiting" && "Complete the payment on your phone"}
              {phase === "success" && "Your Betika balance has been updated"}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 24px" }}>
            {/* Amount summary */}
            <div style={{ background: "#f3f2f2", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#89898a", fontWeight: 500 }}>DEPOSITING TO BETIKA</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 700, color: "#202020" }}>+254 753 777 888</p>
              </div>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#27ae60" }}>KES {amount.toLocaleString()}</p>
            </div>

            {phase === "push-sent" && (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2ecc71", opacity: 0.3, animation: `dotBounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#89898a" }}>
                  An M-Pesa STK push has been sent to your phone.<br />
                  Enter your M-Pesa PIN to confirm.
                </p>
              </div>
            )}

            {phase === "waiting" && (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #e9e9eb", borderTop: "3px solid #2ecc71", margin: "0 auto 12px", animation: "spin 0.9s linear infinite" }} />
                <p style={{ margin: 0, fontSize: 12, color: "#89898a" }}>
                  Waiting for confirmation{"." .repeat(dots)}
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "#c3c3c5" }}>This will complete automatically</p>
              </div>
            )}

            {phase === "success" && (
              <div className="fade-in" style={{ textAlign: "center", padding: "4px 0 8px" }}>
                <p style={{ margin: 0, fontSize: 14, color: "#202020", fontWeight: 600 }}>
                  KES {amount.toLocaleString()} deposited successfully
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#89898a" }}>Closing automatically…</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
