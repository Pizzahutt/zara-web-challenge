'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-4 md:px-page py-20 text-center flex flex-col items-center gap-6">
      <h1 className="font-light text-2xl uppercase">Something went wrong</h1>
      <p className="font-light text-sm text-text-secondary">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="border-[0.5px] border-[#1b1a18] h-14 px-8 py-5 font-light text-sm uppercase tracking-[0.96px] inline-flex items-center"
      >
        Try again
      </button>
    </div>
  );
}
