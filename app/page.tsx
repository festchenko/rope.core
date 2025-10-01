'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import TopBar from './components/TopBar';

// Временно отключаем 3D компоненты
// const DigitalTwinSection = dynamic(
//   () => import('../components/digital-twin/DigitalTwinSection'),
//   { ssr: false }
// );

export default function Home() {
  return (
    <div className='min-h-screen'>
      <TopBar />

      {/* Временно отключен Digital Twin */}
      <main className='p-6 pb-24'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white mb-4'>
            rope.core - Digital Twin
          </h1>
          <p className='text-muted font-inter text-sm mt-4'>
            3D Digital Twin temporarily disabled due to Three.js import issues
          </p>
          <div className='mt-8 p-4 bg-white/5 rounded-lg border border-white/10'>
            <h2 className='text-lg font-semibold text-white mb-2'>
              Systems Status
            </h2>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-accent'></div>
                <span className='text-white/80'>Energy</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-accent'></div>
                <span className='text-white/80'>Tanks</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-accent'></div>
                <span className='text-white/80'>Security</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-accent'></div>
                <span className='text-white/80'>Anchor</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-accent'></div>
                <span className='text-white/80'>Environment</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-accent'></div>
                <span className='text-white/80'>Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
