import React from 'react';
import TopBar from './components/TopBar';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <TopBar />

      <main className='p-6'>
        <div className='flex items-center justify-center h-[calc(100vh-100px)]'>
          <div className='text-center glass-card rounded-3xl p-12 border border-border'>
            <h1 className='pixel-logo text-6xl mb-8'>
              <span className='text-fg'>rope</span>
              <span className='text-accent mx-2'>/</span>
              <span className='text-fg'>{'{'}</span>
              <span className='text-accent'>core</span>
              <span className='text-fg'>{'}'}</span>
            </h1>
            <p className='text-muted font-inter text-lg mb-8'>
              Digital Twin Interface
            </p>

            {/* Glassmorphism buttons */}
            <div className='flex gap-4 justify-center'>
              <button className='glass-button px-6 py-3 rounded-xl font-inter font-medium text-fg hover:scale-105 transition-transform'>
                Get Started
              </button>
              <button className='glass-button px-6 py-3 rounded-xl font-inter font-medium text-fg hover:scale-105 transition-transform'>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
