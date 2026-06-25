import SmsIcon from "../icons/SmsIcon";

const OTP_LENGTH = 6;

interface Props {
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

export default function OTPStep({ amount, otp, inputRefs, isError, isComplete, onChange, onKeyDown, onPaste, onVerify }: Props) {
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
          <SmsIcon size={22} color="var(--color-cashia-pink-500)" />
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
        <span className="text-cashia-pink-500 cursor-pointer font-semibold" onClick={() => {}}>
          Resend OTP
        </span>
      </p>
    </div>
  );
}

export { OTP_LENGTH };
