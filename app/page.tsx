'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <TopBar />
    </div>
  );
}
