'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import type { MotionValue } from 'framer-motion';
import { SYSTEMS, SystemKey } from '../../lib/systems';

interface HotspotProps {
  activeKey: MotionValue<SystemKey>;
}

export default function Hotspot({ activeKey }: HotspotProps) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  // Получаем данные активной системы
  const activeSystem = useMemo(() => {
    return SYSTEMS[0]; // Пока используем первую систему
  }, []);

  // Анимация пульсации
  useFrame(state => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }

    if (glowRef.current) {
      const scale = 1.5 + Math.sin(time * 1.5) * 0.2;
      glowRef.current.scale.setScalar(scale);
      glowRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group position={activeSystem.hotspot}>
      {/* Внешнее свечение */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color={activeSystem.color}
          transparent
          opacity={0.3}
          blending={2} // AdditiveBlending
        />
      </mesh>

      {/* Основная точка */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={activeSystem.color}
          emissive={activeSystem.color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* HTML лейбл для доступности */}
      <Html
        center
        distanceFactor={10}
        occlude
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          className='text-white/80 text-xs font-medium bg-black/50 px-2 py-1 rounded-full'
          aria-label={`Active system: ${activeSystem.label}`}
        >
          {activeSystem.label}
        </div>
      </Html>
    </group>
  );
}
