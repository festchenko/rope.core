'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { SYSTEMS, SystemKey } from '../../lib/systems';
import DigitalTwinCanvas from './DigitalTwinCanvas';
import SystemChips from './SystemChips';

export default function DigitalTwinSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Маппинг скролла в поворот от -45° до +45°
  const rotationY = useTransform(
    scrollYProgress,
    [0, 1],
    [-Math.PI / 4, Math.PI / 4]
  );

  // Определение активной системы на основе прогресса скролла
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, SYSTEMS.length - 1]
  );
  const activeKey = useTransform(activeIndex, value => {
    const index = Math.round(value);
    return SYSTEMS[Math.max(0, Math.min(index, SYSTEMS.length - 1))].key;
  });

  // Fallback для SSR
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

  return (
    <div ref={containerRef} className='min-h-[200vh] relative'>
      {/* Fixed Canvas - верхняя половина */}
      <div className='sticky top-0 h-screen max-w-md mx-auto'>
        <DigitalTwinCanvas rotationY={rotationY} activeKey={activeKey} />

        {/* System Chips - фиксированная панель внизу */}
        <div className='absolute bottom-0 left-0 right-0 p-4 pb-safe'>
          <SystemChips activeKey={activeKey} />
        </div>
      </div>

      {/* Прокручиваемая область - нижняя половина */}
      <div className='h-screen bg-gradient-to-b from-transparent to-black/20' />
    </div>
  );
}
