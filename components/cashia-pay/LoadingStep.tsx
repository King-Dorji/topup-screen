import CashiaLogo from "../icons/CashiaLogo";

export default function LoadingStep() {
  return (
    <div className="fade-in text-center flex flex-col items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-cashia-pink-50 flex items-center justify-center">
        <CashiaLogo size={32} color="var(--color-cashia-pink-500)" />
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
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--color-cashia-pink-500)", opacity: 0.3,
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
