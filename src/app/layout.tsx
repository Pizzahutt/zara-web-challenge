import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MBST — Smartphones',
  description: 'Mobile phone catalog — Zara Web Challenge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
