'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh, Group } from 'three';
import type { MotionValue } from 'framer-motion';

interface YachtModelProps {
  rotationY: MotionValue<number>;
}

export default function YachtModel({ rotationY }: YachtModelProps) {
  const groupRef = useRef<Group>(null);

  // Попытка загрузить GLB модель (пока используем фолбэк)
  // TODO: replace yacht.glb with real asset
  const useFallback = true; // Временно всегда используем фолбэк

  // Анимация поворота
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY.get();
    }
  });

  if (!useFallback) {
    // TODO: Используем загруженную модель когда она будет доступна
    // const gltf = useGLTF('/models/yacht.glb');
    // return (
    //   <group ref={groupRef} scale={[0.8, 0.8, 0.8]} position={[0, -0.1, 0]}>
    //     <primitive object={gltf.scene} />
    //   </group>
    // );
  }

  // Фолбэк геометрия - простая яхта
  return (
    <group ref={groupRef} scale={[1, 1, 1]} position={[0, 0, 0]}>
      {/* Корпус яхты */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        <meshStandardMaterial color='#1F2937' metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Палуба */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.05, 1.4]} />
        <meshStandardMaterial color='#374151' metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Мачта */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.8]} />
        <meshStandardMaterial color='#6B7280' metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Парус */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial color='#F3F4F6' transparent opacity={0.9} />
      </mesh>

      {/* Кабина */}
      <mesh position={[0, 0.25, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <meshStandardMaterial color='#4B5563' metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}
