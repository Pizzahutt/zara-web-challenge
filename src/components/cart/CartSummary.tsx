'use client';

import Link from 'next/link';

interface CartSummaryProps {
  totalPrice: number;
}

export default function CartSummary({ totalPrice }: CartSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white px-4 md:px-page pb-8 md:pb-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <Link
        href="/"
        className="border-[0.5px] border-[#1b1a18] h-14 w-full md:w-[260px] flex items-center justify-center font-light text-sm uppercase tracking-[0.96px]"
      >
        Continue shopping
      </Link>
      <div className="flex flex-1 gap-6 md:gap-20 items-center justify-end w-full">
        <div className="flex gap-6 items-center text-sm uppercase">
          <span>Total</span>
          <span>{totalPrice} EUR</span>
        </div>
        <button
          className="bg-[#1b1a18] text-white h-14 w-full md:w-[260px] flex items-center justify-center font-light text-sm uppercase tracking-[0.96px]"
          aria-label="Pay"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
