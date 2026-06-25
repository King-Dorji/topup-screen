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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-grey-100 flex items-center gap-2.5">
        <CashiaLogoSvg size={26} />
        <span className="text-[18px] font-bold text-cashia-pink-500 tracking-[-0.3px]">
          Cashia
        </span>
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
            onVerify={handleVerifyClick}
          />
        )}
        {step === "success" && <SuccessStep amount={amount} />}
        {step === "error" && <ErrorStep />}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-grey-100 flex items-center justify-center gap-1.5">
        <LockIcon />
        <span className="text-[11px] text-grey-400">
          256-bit SSL encrypted · Powered by Cashia
        </span>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function LoadingStep() {
  return (
    <div className="fade-in text-center flex flex-col items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-cashia-pink-50 flex items-center justify-center">
        <CashiaLogoSvg size={32} />
      </div>
      <div>
        <p className="m-0 text-[16px] font-semibold text-grey-900">Preparing your payment</p>
        <p className="mt-1.5 mb-0 text-[13px] text-grey-500">Sending OTP to your phone…</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-cashia-pink-500)",
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
    <div className="fade-in w-full max-w-[360px] flex flex-col items-center gap-0">
      {/* Payment summary card */}
      <div className="w-full bg-cashia-pink-50 border border-cashia-pink-200 rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-betika-nav flex items-center justify-center shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betika-logo.png" alt="Betika" style={{ width: 32, height: "auto", objectFit: "contain" }} />
        </div>
        <div className="flex-1">
          <p className="m-0 text-[11px] text-grey-500 font-medium uppercase tracking-[0.5px]">Deposit to</p>
          <p className="mt-[1px] mb-0 text-[14px] font-bold text-grey-900">Betika Account</p>
        </div>
        <div className="text-right">
          <p className="m-0 text-[11px] text-grey-500 font-medium">Amount</p>
          <p className="mt-[1px] mb-0 text-[18px] font-extrabold text-cashia-pink-500">
            KES {Number(amount).toLocaleString()}
          </p>
        </div>
      </div>

      {/* OTP heading */}
      <div className="text-center mb-3.5">
        <div className="w-12 h-12 rounded-full bg-cashia-pink-50 border-[1.5px] border-cashia-pink-200 flex items-center justify-center mx-auto mb-3">
          <PhoneIcon />
        </div>
        <p className="m-0 text-[17px] font-bold text-grey-900">Enter verification code</p>
        <p className="mt-1.5 mb-0 text-[13px] text-grey-500 leading-relaxed">
          We sent a 6-digit OTP to your Cashia-registered phone number
        </p>
      </div>

      {/* OTP boxes */}
      <div className="flex gap-2.5 mb-2" onPaste={onPaste}>
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
            style={isError ? { borderColor: "var(--color-system-red)", boxShadow: "0 0 0 3px var(--color-otp-error-shadow)", background: "var(--color-otp-error-bg)" } : {}}
          />
        ))}
      </div>

      {isError && (
        <p className="fade-in m-0 mb-3 text-[12px] text-system-red font-medium">
          Incorrect OTP. Please try again.
        </p>
      )}

      <p className="mt-2 mb-6 text-[12px] text-grey-400">
        Hint: use <strong className="text-cashia-pink-500">123456</strong> for this demo
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
          background: isComplete ? "var(--color-cashia-pink-500)" : "var(--color-cashia-pink-200)",
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

      <p className="mt-4 mb-0 text-[12px] text-grey-300">
        Didn&apos;t receive a code?{" "}
        <span
          className="text-cashia-pink-500 cursor-pointer font-semibold"
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
    <div className="fade-in text-center flex flex-col items-center gap-4">
      <div className="check-pop w-[72px] h-[72px] rounded-full bg-system-green flex items-center justify-center">
        <CheckIcon />
      </div>
      <div>
        <p className="m-0 text-[20px] font-extrabold text-grey-900">Payment Successful!</p>
        <p className="mt-1.5 mb-0 text-[14px] text-grey-500">
          <strong className="text-system-green">KES {Number(amount).toLocaleString()}</strong> has been deposited to your Betika account
        </p>
      </div>
      <div className="bg-mpesa-success-bg border border-mpesa-success-border rounded-lg py-2.5 px-5">
        <p className="m-0 text-[12px] text-mpesa-success-text font-medium">
          Closing automatically…
        </p>
      </div>
    </div>
  );
}

function ErrorStep() {
  return (
    <div className="fade-in text-center">
      <p className="text-system-red font-bold">Something went wrong.</p>
    </div>
  );
}

/* ─── Icon helpers ─────────────────────────────────────────────────────────── */

function CashiaLogoSvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 0C13.1123 0 12.2447 0.0822886 11.4035 0.240738C10.1288 0.479725 8.91546 0.891168 7.78877 1.44968C3.17259 3.73888 0 8.49936 0 14.0004C0 21.7321 6.26726 28 14 28C21.7319 28 28 21.7321 28 14.0004C28 6.26794 21.7319 0 14 0ZM13.9877 4.0549C16.3164 4.0549 18.4542 4.87604 20.1316 6.2478C21.787 7.60031 22.9942 9.4877 23.4941 11.6491H18.3903C17.556 10.0305 15.8796 8.92568 13.9466 8.92568C11.182 8.92568 8.93997 11.1877 8.93997 13.9794C8.93997 14.5484 9.03277 15.0947 9.20435 15.6051C9.21836 15.6453 9.23237 15.6856 9.24725 15.725C7.85268 14.7078 6.96236 13.1635 6.96236 11.4346C6.96236 10.5137 7.21448 9.64615 7.66095 8.88191C7.77389 8.68757 7.89995 8.50023 8.03739 8.32078L6.8004 7.23789C8.58367 5.28135 11.1434 4.0549 13.9877 4.0549ZM13.9877 23.7385C8.75438 23.7385 4.48399 19.5873 4.23799 14.3742C5.67721 17.5616 8.63532 19.7466 12.0486 19.7466C14.7923 19.7466 17.24 18.3355 18.8429 16.1277H23.4985C22.4961 20.4881 18.6179 23.7385 13.9877 23.7385Z"
        fill="var(--color-cashia-pink-500)"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-grey-400)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--color-cashia-pink-500)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.06 6.06l.91-.82a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="var(--color-grey-00)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
