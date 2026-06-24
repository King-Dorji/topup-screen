"use client";

import { useEffect, useRef, useState } from "react";
type Step = "loading" | "otp" | "success" | "error";

const DUMMY_OTP = "123456";
const OTP_LENGTH = 6;

export default function CashiaPayIframe() {
  const [step, setStep] = useState<Step>("loading");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isError, setIsError] = useState(false);
  const [amount, setAmount] = useState<string>("200");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Read amount from query param
    const params = new URLSearchParams(window.location.search);
    const amt = params.get("amount");
    if (amt) setAmount(amt);

    // Simulate OTP being sent — show loading for 1.8s then reveal OTP screen
    const timer = setTimeout(() => setStep("otp"), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setIsError(false);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits filled
    if (digit && index === OTP_LENGTH - 1) {
      const entered = [...next].join("");
      verify(entered);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
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
    if (pasted.length === OTP_LENGTH) {
      verify(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const verify = (code: string) => {
    if (code === DUMMY_OTP) {
      setStep("success");
      // Notify parent window after short delay to show success state
      setTimeout(() => {
        window.parent.postMessage({ type: "CASHIA_PAY_SUCCESS", amount }, "*");
      }, 1200);
    } else {
      setIsError(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  const handleVerifyClick = () => {
    const code = otp.join("");
    if (code.length === OTP_LENGTH) verify(code);
  };

  const filledCount = otp.filter(Boolean).length;
  const isComplete = filledCount === OTP_LENGTH;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #f3f2f2",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <CashiaLogoSvg size={26} />
        <span style={{ fontSize: 18, fontWeight: 700, color: "#dc1f5c", letterSpacing: "-0.3px" }}>
          Cashia
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: "#89898a", background: "#fafafb", padding: "3px 8px", borderRadius: 20, border: "1px solid #e9e9eb" }}>
          Secure payment
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 24px" }}>

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
            onVerify={handleVerifyClick}
          />
        )}
        {step === "success" && <SuccessStep amount={amount} />}
        {step === "error" && <ErrorStep />}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid #f3f2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <LockIcon />
        <span style={{ fontSize: 11, color: "#a8a8aa" }}>
          256-bit SSL encrypted · Powered by Cashia
        </span>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function LoadingStep() {
  return (
    <div className="fade-in" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fbf5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CashiaLogoSvg size={32} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#202020" }}>Preparing your payment</p>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#89898a" }}>Sending OTP to your phone…</p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#dc1f5c",
              opacity: 0.3,
              animation: `dotBounce 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
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

interface OTPStepProps {
  amount: string;
  otp: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  isError: boolean;
  isComplete: boolean;
  onChange: (i: number, v: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onVerify: () => void;
}

function OTPStep({ amount, otp, inputRefs, isError, isComplete, onChange, onKeyDown, onPaste, onVerify }: OTPStepProps) {
  return (
    <div className="fade-in" style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {/* Payment summary card */}
      <div
        style={{
          width: "100%",
          background: "#fbf5f9",
          border: "1px solid #f3b8cc",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dc1f5c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <BetikaMiniIcon />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 11, color: "#89898a", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Deposit to</p>
          <p style={{ margin: "1px 0 0", fontSize: 14, fontWeight: 700, color: "#202020" }}>Betika Account</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#89898a", fontWeight: 500 }}>Amount</p>
          <p style={{ margin: "1px 0 0", fontSize: 18, fontWeight: 800, color: "#dc1f5c" }}>
            KES {Number(amount).toLocaleString()}
          </p>
        </div>
      </div>

      {/* OTP heading */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fbf5f9", border: "1.5px solid #f3b8cc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <PhoneIcon />
        </div>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#202020" }}>Enter verification code</p>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#89898a", lineHeight: 1.5 }}>
          We sent a 6-digit OTP to your Cashia-registered phone number
        </p>
      </div>

      {/* OTP boxes */}
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }} onPaste={onPaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className={`otp-box ${digit ? (isError ? "" : "filled") : ""}`}
            style={isError ? { borderColor: "#f73b3b", boxShadow: "0 0 0 3px #fde8e8", background: "#fff8f8" } : {}}
          />
        ))}
      </div>

      {isError && (
        <p className="fade-in" style={{ margin: "0 0 12px", fontSize: 12, color: "#f73b3b", fontWeight: 500 }}>
          Incorrect OTP. Please try again.
        </p>
      )}

      <p style={{ margin: "8px 0 24px", fontSize: 12, color: "#a8a8aa" }}>
        Hint: use <strong style={{ color: "#dc1f5c" }}>123456</strong> for this demo
      </p>

      {/* Confirm button */}
      <button
        onClick={onVerify}
        disabled={!isComplete}
        style={{
          width: "100%",
          padding: "14px 24px",
          borderRadius: 8,
          border: "none",
          background: isComplete ? "#dc1f5c" : "#f3b8cc",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: isComplete ? "pointer" : "not-allowed",
          transition: "background 0.15s ease, transform 0.1s ease",
          letterSpacing: "0.2px",
        }}
        onMouseDown={(e) => isComplete && ((e.target as HTMLButtonElement).style.transform = "scale(0.98)")}
        onMouseUp={(e) => ((e.target as HTMLButtonElement).style.transform = "scale(1)")}
      >
        Confirm Payment
      </button>

      <p style={{ margin: "16px 0 0", fontSize: 12, color: "#c3c3c5" }}>
        Didn&apos;t receive a code?{" "}
        <span
          style={{ color: "#dc1f5c", cursor: "pointer", fontWeight: 600 }}
          onClick={() => {}}
        >
          Resend OTP
        </span>
      </p>
    </div>
  );
}

function SuccessStep({ amount }: { amount: string }) {
  return (
    <div className="fade-in" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        className="check-pop"
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#17b530",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#202020" }}>Payment Successful!</p>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#89898a" }}>
          <strong style={{ color: "#17b530" }}>KES {Number(amount).toLocaleString()}</strong> has been deposited to your Betika account
        </p>
      </div>
      <div style={{ background: "#f1f9f1", border: "1px solid #b5e6bf", borderRadius: 8, padding: "10px 20px" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#128c25", fontWeight: 500 }}>
          Closing automatically…
        </p>
      </div>
    </div>
  );
}

function ErrorStep() {
  return (
    <div className="fade-in" style={{ textAlign: "center" }}>
      <p style={{ color: "#f73b3b", fontWeight: 700 }}>Something went wrong.</p>
    </div>
  );
}

/* ─── Icon helpers ─────────────────────────────────────────────────────────── */

function CashiaLogoSvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 0C13.1123 0 12.2447 0.0822886 11.4035 0.240738C10.1288 0.479725 8.91546 0.891168 7.78877 1.44968C3.17259 3.73888 0 8.49936 0 14.0004C0 21.7321 6.26726 28 14 28C21.7319 28 28 21.7321 28 14.0004C28 6.26794 21.7319 0 14 0ZM13.9877 4.0549C16.3164 4.0549 18.4542 4.87604 20.1316 6.2478C21.787 7.60031 22.9942 9.4877 23.4941 11.6491H18.3903C17.556 10.0305 15.8796 8.92568 13.9466 8.92568C11.182 8.92568 8.93997 11.1877 8.93997 13.9794C8.93997 14.5484 9.03277 15.0947 9.20435 15.6051C9.21836 15.6453 9.23237 15.6856 9.24725 15.725C7.85268 14.7078 6.96236 13.1635 6.96236 11.4346C6.96236 10.5137 7.21448 9.64615 7.66095 8.88191C7.77389 8.68757 7.89995 8.50023 8.03739 8.32078L6.8004 7.23789C8.58367 5.28135 11.1434 4.0549 13.9877 4.0549ZM13.9877 23.7385C8.75438 23.7385 4.48399 19.5873 4.23799 14.3742C5.67721 17.5616 8.63532 19.7466 12.0486 19.7466C14.7923 19.7466 17.24 18.3355 18.8429 16.1277H23.4985C22.4961 20.4881 18.6179 23.7385 13.9877 23.7385Z"
        fill="#dc1f5c"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#a8a8aa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#dc1f5c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.06 6.06l.91-.82a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BetikaMiniIcon() {
  return (
    <svg width={22} height={14} viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="16" fontSize="18" fontWeight="900" fill="#f5c518" fontFamily="Arial Black, sans-serif">B</text>
      <text x="14" y="16" fontSize="14" fontWeight="700" fill="white" fontFamily="Arial, sans-serif">etika</text>
    </svg>
  );
}
