'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';

const DigitalTwinSection = dynamic(
  () => import('../components/digital-twin/DigitalTwinSection'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className='min-h-screen'>
      <TopBar />

      {/* Digital Twin Section */}
      <DigitalTwinSection />

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
