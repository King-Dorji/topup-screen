"use client";

import CashiaLogo from "../icons/CashiaLogo";
import GiftIcon from "../icons/GiftIcon";

interface Props {
  amount: string;
  onOnboard: () => void;
  onJoinLater: () => void;
}

const PERKS = [
  { icon: "🎁", title: "3 free deposits daily", desc: "Skip M-Pesa fees on your first 3 Betika deposits every day" },
  { icon: "⚡", title: "Instant deposits", desc: "Top up Betika in seconds — no waiting, no hassle" },
  { icon: "🔒", title: "Secure Cashia wallet", desc: "Your money, protected. Deposit and withdraw with confidence" },
];

export default function GuestChoiceStep({ amount, onOnboard, onJoinLater }: Props) {
  return (
    <div className="fade-in w-full max-w-[380px] flex flex-col">
      <div className="bg-gradient-to-br from-cashia-pink-500 to-cashia-pink-700 rounded-xl px-5 pt-6 pb-5 mb-4 text-center text-white relative">
        <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 -translate-x-1/3 translate-y-1/3" />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CashiaLogo size={22} color="white" />
            <span className="text-[11px] font-bold uppercase tracking-[1px] opacity-90">Cashia × Betika</span>
          </div>
          <p className="m-0 text-[20px] font-extrabold leading-tight">Get more when you pay with Cashia</p>
          <p className="mt-2 mb-0 text-[13px] text-white/85 leading-relaxed">
            Join thousands of Betika players saving on deposit fees and enjoying faster payouts.
          </p>
        </div>
      </div>

      <div className="bg-cashia-pink-50 border border-cashia-pink-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
        <div>
          <p className="m-0 text-[11px] text-grey-500 font-medium uppercase tracking-[0.4px]">Your deposit</p>
          <p className="mt-0.5 mb-0 text-[13px] font-bold text-grey-900">Betika Account</p>
        </div>
        <p className="m-0 text-[18px] font-extrabold text-cashia-pink-500">KES {Number(amount).toLocaleString()}</p>
      </div>

      <div className="flex flex-col gap-2.5 mb-5">
        {PERKS.map((perk) => (
          <div key={perk.title} className="flex items-start gap-3 bg-grey-50 border border-grey-150 rounded-lg px-3.5 py-3">
            <span className="text-[18px] leading-none mt-0.5">{perk.icon}</span>
            <div>
              <p className="m-0 text-[13px] font-bold text-grey-900">{perk.title}</p>
              <p className="mt-0.5 mb-0 text-[11px] text-grey-500 leading-relaxed">{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onOnboard}
        className="w-full py-[13px] rounded-[10px] border-none bg-cashia-pink-500 hover:bg-cashia-pink-700 text-white text-[14px] font-bold cursor-pointer mb-2.5 transition-colors duration-[150ms] flex items-center justify-center gap-2"
      >
        <GiftIcon size={16} color="white" />
        Complete onboarding now
      </button>
      <button
        onClick={onJoinLater}
        className="w-full py-[11px] rounded-[10px] border border-grey-150 bg-transparent text-grey-600 text-[13px] font-semibold cursor-pointer hover:bg-grey-50 transition-colors"
      >
        Join later — deposit with M-Pesa
      </button>
      <p className="m-0 mt-3 text-[11px] text-grey-400 text-center leading-relaxed">
        You can always create your Cashia account later from the Betika deposit screen.
      </p>
    </div>
  );
}
