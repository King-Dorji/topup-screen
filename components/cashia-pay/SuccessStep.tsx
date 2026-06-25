import CheckIcon from "../icons/CheckIcon";

export default function SuccessStep({ amount }: { amount: string }) {
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
        <p className="m-0 text-[12px] text-mpesa-success-text font-medium">Closing automatically…</p>
      </div>
    </div>
  );
}
