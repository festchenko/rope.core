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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0b1018',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${labco.variable} ${inter.variable}`}>
      <head>
        <link
          rel='preload'
          href='/models/yaсht.glb'
          as='fetch'
          crossOrigin='anonymous'
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable React DevTools to prevent semver errors
              if (typeof window !== 'undefined') {
                window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
                  isDisabled: true,
                  supportsFiber: true,
                  inject: function() {},
                  onCommitFiberRoot: function() {},
                  onCommitFiberUnmount: function() {}
                };
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} text-fg antialiased h-screen overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
