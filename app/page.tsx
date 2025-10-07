'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';
import { theme } from '../lib/theme';

const YachtCanvas = dynamic(() => import('../components/YachtCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className='h-dvh ios-fullscreen flex flex-col overflow-hidden border border-gray-600 bg-app-bg rounded-lg'>
      <TopBar />
      <div className='flex-1 bg-app-bg p-4'>
        <YachtCanvas />
      </div>
    </div>
  );
}
