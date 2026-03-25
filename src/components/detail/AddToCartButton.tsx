'use client';

interface AddToCartButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export default function AddToCartButton({ disabled, onClick }: AddToCartButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 bg-[#1b1a18] text-white font-light text-sm uppercase tracking-[0.96px] disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label="Add to cart"
    >
      Añadir
    </button>
  );
}
