import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

// TODO: Подключить шрифт LAB-Grotesk.otf
// const labco = localFont({
//   src: '../public/fonts/LAB-Grotesk.otf',
//   variable: '--font-labco',
//   display: 'swap',
// })

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
    <html lang="en">
      <body className="bg-bg text-fg antialiased font-sans">
        <div className="max-w-md mx-auto md:max-w-lg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
