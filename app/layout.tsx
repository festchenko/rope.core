import React from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const labco = localFont({
  src: './fonts/LAB-Grotesk.otf',
  variable: '--font-labco',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'rope.core - Digital Twin',
  description: 'Digital Twin interface for rope.core',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={labco.variable}>
      <body className={`${labco.className} bg-bg text-fg antialiased`}>
        <div className="max-w-md mx-auto md:max-w-lg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
