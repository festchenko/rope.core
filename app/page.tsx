'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';

// Простая 2D версия Digital Twin без framer-motion
const SimpleDigitalTwin = dynamic(
  () => import('../components/digital-twin/SimpleDigitalTwinNoMotion'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className='min-h-screen'>
      <TopBar />

      {/* 2D Digital Twin */}
      <SimpleDigitalTwin />

      {/* Placeholder content below */}
      <main className='p-6 pb-24'>
        <div className='text-center'>
          <p className='text-muted font-inter text-sm mt-4'>
            Scroll to interact with the Digital Twin
          </p>
        </div>
      </main>
    </div>
  );
}
