'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useHydrated } from '@/hooks/useHydrated';

function LogoMark() {
  return (
    <svg
      width="28"
      height="15"
      viewBox="0 0 28 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Crescent moon shape (Figma "Subtract") */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8454 2.23917C11.485 0.857001 9.59259 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15C9.50619 15 11.3284 14.2123 12.6742 12.9293C11.6202 11.4554 11 9.65014 11 7.7C11 5.64651 11.6877 3.75364 12.8454 2.23917Z"
        fill="currentColor"
      />
      {/* 8-pointed asterisk: 4 bars rotated around center */}
      <rect x="18.44" y="0.43" width="3.143" height="14.571" fill="currentColor" />
      <rect x="18.44" y="0.43" width="3.143" height="14.571" fill="currentColor" transform="rotate(90 20.01 7.72)" />
      <rect x="18.44" y="0.43" width="3.143" height="14.571" fill="currentColor" transform="rotate(45 20.01 7.72)" />
      <rect x="18.44" y="0.43" width="3.143" height="14.571" fill="currentColor" transform="rotate(-45 20.01 7.72)" />
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
      <nav aria-label="Main navigation" className="flex w-full items-center justify-between">
      <Link href="/" aria-label="MBST home">
        <span className="flex items-center gap-1.5">
          <LogoMark />
          <span className="text-xl font-bold uppercase leading-none" style={{ letterSpacing: '-2.9px' }}>MBST</span>
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
      </nav>
    </header>
  );
}
