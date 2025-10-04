'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';

export default function Home() {
  return (
    <div className='h-dvh flex flex-col overflow-hidden'>
      <TopBar />
      <div className='flex-1 bg-[#0B0F12] flex items-center justify-center'>
        <div className='text-center text-white'>
          <h1 className='text-4xl font-bold mb-4'>rope.core</h1>
          <p className='text-lg text-gray-300'>Digital Twin Interface</p>
        </div>
      </div>
    </div>
  );
}
