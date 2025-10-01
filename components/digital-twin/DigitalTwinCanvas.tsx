'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { MotionValue } from 'framer-motion';
import { SystemKey } from '../../lib/systems';
import YachtModel from './YachtModel';
import Hotspot from './Hotspot';

// Динамический импорт Canvas для SSR
const Canvas = dynamic(
  () => import('@react-three/fiber').then(mod => mod.Canvas),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-full flex items-center justify-center bg-black/20'>
        <div className='text-white/60'>Loading 3D...</div>
      </div>
    ),
  }
);

interface DigitalTwinCanvasProps {
  rotationY: MotionValue<number>;
  activeKey: MotionValue<SystemKey>;
}

export default function DigitalTwinCanvas({
  rotationY,
  activeKey,
}: DigitalTwinCanvasProps) {
  return (
    <div className='w-full h-full relative'>
      <Canvas
        dpr={[1, 2]}
        shadows
        performance={{ min: 0.5 }}
        camera={{
          fov: 35,
          position: [0, 0.4, 2.2],
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Освещение */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 2]} intensity={1.2} castShadow />

          {/* Модель яхты */}
          <YachtModel rotationY={rotationY} />

          {/* Hotspot для активной системы */}
          <Hotspot activeKey={activeKey} />
        </Suspense>
      </Canvas>

      {/* Градиентный туман */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent' />
      </div>
    </div>
  );
}
