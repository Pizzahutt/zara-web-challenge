'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useHydrated } from '@/hooks/useHydrated';

function LogoMark() {
  return (
    <svg
      width="13"
      height="15"
      viewBox="0 0 13 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 8-pointed asterisk mark built from rotated bars */}
      <rect x="5" y="0" width="3" height="15" rx="0.5" fill="currentColor" />
      <rect
        x="0"
        y="6"
        width="3"
        height="15"
        rx="0.5"
        fill="currentColor"
        transform="rotate(-90 0 6)"
      />
      <rect
        x="1.5"
        y="1"
        width="3"
        height="14.5"
        rx="0.5"
        fill="currentColor"
        transform="rotate(-45 6.5 7.5)"
      />
      <rect
        x="1.5"
        y="1"
        width="3"
        height="14.5"
        rx="0.5"
        fill="currentColor"
        transform="rotate(45 6.5 7.5)"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5.4 7.2V4.5C5.4 2.52 7.02 0.9 9 0.9C10.98 0.9 12.6 2.52 12.6 4.5V7.2M3.6 5.4H14.4C15.06 5.4 15.6 5.94 15.6 6.6V15.6C15.6 16.26 15.06 16.8 14.4 16.8H3.6C2.94 16.8 2.4 16.26 2.4 15.6V6.6C2.4 5.94 2.94 5.4 3.6 5.4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isCartPage = pathname === '/cart';
  const { getTotalItems } = useCart();
  const hydrated = useHydrated();
  const totalItems = hydrated ? getTotalItems() : 0;

  return (
    <header className="flex h-header items-center justify-between bg-background px-4 py-6 md:px-page">
      <Link href="/" aria-label="MBST home">
        <span className="flex items-center gap-1.5">
          <LogoMark />
          <span className="text-xl font-bold uppercase leading-none tracking-tighter">MBST</span>
        </span>
      </Link>

      {!isCartPage && (
        <Link
          href="/cart"
          className="flex items-center gap-1.5 py-1"
          aria-label={`Shopping bag, ${totalItems} items`}
        >
          <BagIcon />
          <span className="font-light uppercase leading-4">{totalItems}</span>
        </Link>
      )}
    </header>
  );
}
