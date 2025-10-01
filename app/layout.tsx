import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import './globals.css';

const labco = localFont({
  src: '../public/fonts/LAB-Grotesk.otf',
  variable: '--font-labco',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'rope.core - Digital Twin',
  description: 'Digital Twin interface for rope.core',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${labco.variable} ${inter.variable}`}>
      <body className={`${inter.className} text-fg antialiased`}>
        <div className='max-w-4xl mx-auto min-h-screen'>{children}</div>
      </body>
    </html>
  );
}
