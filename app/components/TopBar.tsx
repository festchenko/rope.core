'use client';

import React from 'react';

export default function TopBar() {
  return (
    <header className='sticky top-0 z-50 bg-gray-800 border border-gray-600 rounded-lg m-4'>
      <div className='flex items-center justify-between p-4'>
        <div
          className='text-xl font-normal tracking-[0.22em] flex items-baseline'
          style={{ fontFamily: 'LAB-Grotesk, sans-serif' }}
        >
          rope
          <span className='text-[0.5em]' style={{ color: '#00bfa6' }}>
            /
          </span>
          <span className='text-[0.5em] text-fg'>{'{'}</span>
          <span
            className='text-[0.5em] animate-pulse'
            style={{ color: '#00bfa6' }}
          >
            core
          </span>
          <span className='text-[0.5em] text-fg'>{'}'}</span>
        </div>
        <div className='flex items-center gap-3'>
          {/* Simple pulsing indicator */}
          <div className='flex items-center gap-2'>
            <div className='relative w-2 h-2'>
              <div
                className='absolute w-2 h-2 rounded-full animate-pulse'
                style={{ backgroundColor: '#00bfa6' }}
              ></div>
              <div
                className='absolute w-2 h-2 rounded-full animate-ping'
                style={{ backgroundColor: 'rgba(0, 191, 166, 0.3)' }}
              ></div>
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
