import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="px-4 md:px-page py-20 text-center flex flex-col items-center gap-6">
      <h1 className="font-light text-2xl uppercase">Page not found</h1>
      <p className="font-light text-sm text-text-secondary">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="border-[0.5px] border-[#1b1a18] h-14 px-8 py-5 font-light text-sm uppercase tracking-[0.96px] inline-flex items-center"
      >
        Back to home
      </Link>
    </div>
  );
}
