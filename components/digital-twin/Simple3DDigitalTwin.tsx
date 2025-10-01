'use client';

import React, { useRef, useState, useEffect } from 'react';
import { SYSTEMS, SystemKey } from '../../lib/systems';

export default function Simple3DDigitalTwin() {
  const [isClient, setIsClient] = useState(false);
  const [activeSystem, setActiveSystem] = useState<SystemKey>('energy');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [cameraZoom, setCameraZoom] = useState(0);

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

      // Поворот яхты от -45° до +45°
      const rotation = -45 + progress * 90;
      setRotationY(rotation);

      // Зум камеры
      setCameraZoom(progress * 0.5);

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
          <div className='text-white/60'>Loading 3D Digital Twin...</div>
        </div>
        <div className='h-screen bg-gradient-to-b from-transparent to-black/20' />
      </div>
    );
  }

  return (
    <div className='min-h-[200vh] relative'>
      {/* Fixed 3D Canvas */}
      <div className='sticky top-0 h-screen max-w-md mx-auto'>
        {/* 3D Yacht with CSS 3D transforms */}
        <div className='w-full h-full flex items-center justify-center relative perspective-1000'>
          <div
            className='relative'
            style={{
              transform: `rotateY(${rotationY}deg) scale(${1 + cameraZoom * 0.3})`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* 3D Yacht Model using CSS */}
            <div className='relative w-80 h-60'>
              {/* Hull - корпус */}
              <div
                className='absolute bottom-0 left-1/2 transform -translate-x-1/2'
                style={{
                  width: '200px',
                  height: '80px',
                  background:
                    'linear-gradient(135deg, #1F2937 0%, #0B0F12 100%)',
                  borderRadius: '100px 100px 60px 60px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  border: '2px solid #00BFA6',
                }}
              />

              {/* Deck - палуба */}
              <div
                className='absolute bottom-16 left-1/2 transform -translate-x-1/2'
                style={{
                  width: '180px',
                  height: '20px',
                  background: '#374151',
                  borderRadius: '10px',
                  border: '1px solid #1F2937',
                }}
              />

              {/* Mast - мачта */}
              <div
                className='absolute bottom-16 left-1/2 transform -translate-x-1/2'
                style={{
                  width: '4px',
                  height: '120px',
                  background: '#6B7280',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                }}
              />

              {/* Sail - парус */}
              <div
                className='absolute bottom-28 left-1/2 transform -translate-x-1/2'
                style={{
                  width: '0',
                  height: '0',
                  borderLeft: '80px solid transparent',
                  borderRight: '80px solid transparent',
                  borderBottom: '100px solid rgba(243, 244, 246, 0.9)',
                  filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))',
                }}
              />

              {/* Cabin - кабина */}
              <div
                className='absolute bottom-20 left-1/2 transform -translate-x-1/2'
                style={{
                  width: '60px',
                  height: '30px',
                  background: '#4B5563',
                  borderRadius: '5px',
                  border: '1px solid #374151',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                }}
              />

              {/* 3D Hotspots */}
              {SYSTEMS.map(system => {
                const isActive = system.key === activeSystem;
                const [x, y, z] = system.hotspot;
                const left = 50 + x * 30; // Convert to percentage
                const top = 50 + y * 30;

                return (
                  <div
                    key={system.key}
                    className='absolute transform -translate-x-1/2 -translate-y-1/2'
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      zIndex: 10,
                    }}
                  >
                    {/* Outer glow */}
                    {isActive && (
                      <div
                        className='absolute inset-0 rounded-full animate-ping'
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: system.color,
                          opacity: 0.3,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    )}

                    {/* Main hotspot */}
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        isActive ? 'animate-pulse' : ''
                      }`}
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: system.color,
                        boxShadow: isActive
                          ? `0 0 20px ${system.color}, 0 0 40px ${system.color}`
                          : 'none',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />

                    {/* Label */}
                    {isActive && (
                      <div
                        className='absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded-full whitespace-nowrap'
                        style={{
                          color: system.color,
                        }}
                      >
                        {system.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Chips - фиксированная панель внизу */}
        <div className='absolute bottom-0 left-0 right-0 p-4 pb-safe z-10'>
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

        {/* Градиентный туман */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent' />
        </div>
      </div>

      {/* Прокручиваемая область */}
      <div className='h-screen bg-gradient-to-b from-transparent to-black/20' />
    </div>
  );
}
