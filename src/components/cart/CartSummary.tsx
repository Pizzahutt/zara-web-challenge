'use client';

import Link from 'next/link';

interface CartSummaryProps {
  totalPrice: number;
}

export default function CartSummary({ totalPrice }: CartSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white">
      {/* Mobile layout */}
      <div className="md:hidden px-4 pb-6 pt-4 flex flex-col gap-6">
        <div className="flex items-center justify-between text-sm uppercase">
          <span>Total</span>
          <span>{totalPrice} EUR</span>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            href="/"
            className="border-[0.5px] border-[#1b1a18] h-12 flex-1 flex items-center justify-center font-light text-[12px] uppercase tracking-[0.96px]"
          >
            Continue shopping
          </Link>
          <button
            className="bg-[#1b1a18] text-white h-12 w-[174px] flex items-center justify-center font-light text-[12px] uppercase tracking-[0.96px]"
            aria-label={`Pay ${totalPrice} EUR`}
          >
            Pay
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-between px-page pt-6 pb-14">
        <Link
          href="/"
          className="border-[0.5px] border-[#1b1a18] h-14 w-[260px] flex items-center justify-center font-light text-[12px] uppercase tracking-[0.96px]"
        >
          Continue shopping
        </Link>
        <div className="flex items-center gap-20">
          <div className="flex items-center gap-6 text-sm uppercase">
            <span>Total</span>
            <span>{totalPrice} EUR</span>
          </div>
          <button
            className="bg-[#1b1a18] text-white h-14 w-[260px] flex items-center justify-center font-light text-[12px] uppercase tracking-[0.96px]"
            aria-label={`Pay ${totalPrice} EUR`}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}
