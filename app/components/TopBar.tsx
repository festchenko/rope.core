import React from 'react'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="font-labco font-semibold text-fg tracking-tight text-lg">
            rope.core
          </h1>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <span className="text-sm text-muted font-medium">
            Demo • Offline
          </span>
        </div>
      </div>
    </header>
  )
}
