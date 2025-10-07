'use client';

import React from 'react';

export default function TopBar() {
  return (
    <header className='sticky top-0 z-50 w-full bg-gray-800 border border-gray-600 rounded-sm'>
      <div className='flex items-center justify-between px-4 py-3'>
        <div
          className='text-xl font-normal tracking-[0.22em] flex items-baseline'
          style={{ fontFamily: 'LAB-Grotesk, sans-serif' }}
        >
          rope<span className='text-accent text-[0.5em]'>/</span>
          <span className='text-[0.5em] text-fg'>{'{'}</span>
          <span className='text-[0.5em] text-accent animate-pulse'>core</span>
          <span className='text-[0.5em] text-fg'>{'}'}</span>
        </div>
        <div className='flex items-center gap-3'>
          {/* Simple pulsing indicator */}
          <div className='flex items-center gap-2'>
            <div className='relative w-2 h-2'>
              <div className='absolute w-2 h-2 rounded-full bg-accent animate-pulse'></div>
              <div className='absolute w-2 h-2 rounded-full bg-accent/30 animate-ping'></div>
            </div>
            <span className='text-sm font-medium text-white/80 tracking-wide'>
              live
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
