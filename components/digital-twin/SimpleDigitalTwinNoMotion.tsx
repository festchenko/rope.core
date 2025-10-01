'use client';

import React, { useState, useEffect } from 'react';
import { SYSTEMS, SystemKey } from '../../lib/systems';

export default function SimpleDigitalTwinNoMotion() {
  const [isClient, setIsClient] = useState(false);
  const [activeSystem, setActiveSystem] = useState<SystemKey>('energy');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);

      // Определение активной системы
      const systemIndex = Math.round(progress * (SYSTEMS.length - 1));
      const systemKey =
        SYSTEMS[Math.max(0, Math.min(systemIndex, SYSTEMS.length - 1))].key;
      setActiveSystem(systemKey);
    };

    if (isClient) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial call
    }

    return () => {
      if (isClient) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className='min-h-[200vh] relative'>
        <div className='sticky top-0 h-screen max-w-md mx-auto flex items-center justify-center'>
          <div className='text-white/60'>Loading Digital Twin...</div>
        </div>
        <div className='h-screen bg-gradient-to-b from-transparent to-black/20' />
      </div>
    );
  }

  // Маппинг скролла в поворот от -45° до +45°
  const rotationY = -45 + scrollProgress * 90;

  return (
    <div className='min-h-[200vh] relative'>
      {/* Fixed Canvas - верхняя половина */}
      <div className='sticky top-0 h-screen max-w-md mx-auto'>
        {/* 2D Yacht Representation */}
        <div className='w-full h-full flex items-center justify-center relative'>
          {/* Yacht SVG */}
          <div
            className='transition-transform duration-300 ease-out'
            style={{
              transform: `rotateY(${rotationY}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <svg
              width='300'
              height='200'
              viewBox='0 0 300 200'
              className='drop-shadow-2xl'
            >
              {/* Hull */}
              <ellipse
                cx='150'
                cy='120'
                rx='80'
                ry='25'
                fill='#1F2937'
                stroke='#374151'
                strokeWidth='2'
              />

              {/* Deck */}
              <ellipse
                cx='150'
                cy='110'
                rx='70'
                ry='20'
                fill='#374151'
                stroke='#4B5563'
                strokeWidth='1'
              />

              {/* Mast */}
              <line
                x1='150'
                y1='90'
                x2='150'
                y2='40'
                stroke='#6B7280'
                strokeWidth='3'
              />

              {/* Sail */}
              <path
                d='M 150 40 L 120 60 L 150 80 Z'
                fill='#F3F4F6'
                stroke='#E5E7EB'
                strokeWidth='1'
                opacity='0.9'
              />

              {/* Cabin */}
              <rect
                x='120'
                y='100'
                width='60'
                height='20'
                fill='#4B5563'
                stroke='#6B7280'
                strokeWidth='1'
              />
            </svg>
          </div>

          {/* Hotspot для активной системы */}
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            {SYSTEMS.map((system, index) => {
              const isActive = system.key === activeSystem;
              if (!isActive) return null;

              return (
                <div
                  key={system.key}
                  className='absolute animate-pulse'
                  style={{
                    left: `${50 + system.hotspot[0] * 100}%`,
                    top: `${50 + system.hotspot[1] * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className='w-4 h-4 rounded-full shadow-lg'
                    style={{ backgroundColor: system.color }}
                  >
                    <div
                      className='absolute inset-0 rounded-full animate-ping'
                      style={{ backgroundColor: system.color, opacity: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Chips - фиксированная панель внизу */}
        <div className='absolute bottom-0 left-0 right-0 p-4 pb-safe'>
          <div className='flex gap-2 overflow-x-auto pb-4 scrollbar-hide'>
            {SYSTEMS.map(system => {
              const isActive = system.key === activeSystem;

              return (
                <div
                  key={system.key}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                    transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? 'bg-accent/20 border border-accent text-accent'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }
                  `}
                  style={{
                    borderColor: isActive ? system.color : undefined,
                    color: isActive ? system.color : undefined,
                  }}
                >
                  <div
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: system.color }}
                  />
                  {system.icon}
                  <span className='text-sm font-medium'>{system.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Прокручиваемая область - нижняя половина */}
      <div className='h-screen bg-gradient-to-b from-transparent to-black/20' />
    </div>
  );
}
