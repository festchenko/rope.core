'use client';

import React from 'react';
import TopBar from './components/TopBar';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <TopBar />
      <main className='p-6'>
        <div className='flex items-center justify-center h-[calc(100vh-100px)]'>
          <div className='text-center'>
            <p className='text-muted font-inter text-sm mt-4'>
              Digital Twin Interface
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}