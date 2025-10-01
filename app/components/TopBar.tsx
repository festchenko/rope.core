'use client';

import React from 'react';

export default function TopBar() {
  return (
    <header className='sticky top-0 z-50 glass border-b border-border w-full'>
      <div className='flex items-center justify-between px-4 py-4'>
        <div className='text-xl font-normal tracking-[0.22em] flex items-baseline' style={{ fontFamily: 'LAB-Grotesk, sans-serif' }}>
          rope<span className='text-accent text-[0.5em]'>/</span>
          <span className='text-[0.5em] text-fg'>{'{'}</span>
          <span className='text-[0.5em] text-accent'>core</span>
          <span className='text-[0.5em] text-fg'>{'}'}</span>
        </div>
        <div className='flex items-center gap-2 px-4 py-2 rounded-full glass-card'>
          <div className='w-2 h-2 rounded-full bg-accent glow-accent'></div>
          <span className='text-sm text-muted font-inter font-medium'>Demo • Offline</span>
        </div>
      </div>
    </header>
  );
}