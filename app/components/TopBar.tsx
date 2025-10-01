import React from 'react';

export default function TopBar() {
  return (
    <header className='sticky top-0 z-50 glass border-b border-border'>
      <div className='flex items-center justify-between px-4 py-4'>
        {/* Logo */}
        <div className='flex items-center'>
          <h1 className='pixel-logo text-2xl'>
            <span className='text-fg'>rope</span>
            <span className='text-accent mx-1'>/</span>
            <span className='text-fg'>{'{'}</span>
            <span className='text-accent'>core</span>
            <span className='text-fg'>{'}'}</span>
          </h1>
        </div>

        {/* Status pill */}
        <div className='flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-border'>
          <div className='w-2 h-2 rounded-full bg-accent glow-accent'></div>
          <span className='text-sm text-muted font-inter font-medium'>
            Demo • Offline
          </span>
        </div>
      </div>
    </header>
  );
}
