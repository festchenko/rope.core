'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';

const YachtCanvas = dynamic(() => import('../components/YachtCanvas'), {
  ssr: false,
  loading: () => (
    <div className='flex-1 bg-[#0B0F12] flex items-center justify-center'>
      <div className='text-center text-white'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4'></div>
        <p className='text-lg text-gray-300'>Loading 3D Yacht...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className='h-dvh ios-fullscreen flex flex-col overflow-hidden border border-gray-600 bg-gray-900'>
      <TopBar />
      <div className='flex-1 bg-gray-900 p-4'>
        <YachtCanvas />
      </div>
    </div>
  );
}
