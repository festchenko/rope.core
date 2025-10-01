'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';

// Простой 3D Digital Twin с CSS 3D
const Simple3DDigitalTwin = dynamic(
  () => import('../components/digital-twin/Simple3DDigitalTwin'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className='min-h-screen'>
      <TopBar />

      {/* Простой 3D Digital Twin */}
      <Simple3DDigitalTwin />

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
