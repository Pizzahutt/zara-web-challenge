import type { Metadata, Viewport } from 'next';
import QueryProvider from '@/providers/QueryProvider';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import NavigationProgress from '@/components/layout/NavigationProgress';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'MBST — Smartphones',
  description: 'Mobile phone catalog — Zara Web Challenge',
  metadataBase: new URL('https://zara-web-challenge-peach.vercel.app'),
  openGraph: {
    title: 'MBST — Smartphones',
    description: 'Mobile phone catalog — Zara Web Challenge',
    url: 'https://zara-web-challenge-peach.vercel.app',
    siteName: 'MBST',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MBST — Smartphones',
    description: 'Mobile phone catalog — Zara Web Challenge',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://prueba-tecnica-api-tienda-moviles.onrender.com" />
        <link rel="dns-prefetch" href="https://prueba-tecnica-api-tienda-moviles.onrender.com" />
      </head>
      <body>
        <QueryProvider>
          <CartProvider>
            <Navbar />
            <NavigationProgress />
            <main>{children}</main>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
