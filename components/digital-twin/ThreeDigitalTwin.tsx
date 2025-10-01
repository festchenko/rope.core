'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SYSTEMS, SystemKey } from '../../lib/systems';

// 3D Yacht Model Component
function YachtModel({
  rotationY,
  activeSystem,
}: {
  rotationY: number;
  activeSystem: SystemKey;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hull - основной корпус */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        <meshStandardMaterial color='#1F2937' metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Deck - палуба */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.05, 1.4]} />
        <meshStandardMaterial color='#374151' metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Mast - мачта */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.8]} />
        <meshStandardMaterial color='#6B7280' metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Sail - парус */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial color='#F3F4F6' transparent opacity={0.9} />
      </mesh>

      {/* Cabin - кабина */}
      <mesh position={[0, 0.25, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <meshStandardMaterial color='#4B5563' metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

// 3D Hotspot Component
function Hotspot3D({
  position,
  color,
  isActive,
}: {
  position: [number, number, number];
  color: string;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(state => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current && isActive) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }

    if (glowRef.current && isActive) {
      const scale = 1.5 + Math.sin(time * 1.5) * 0.2;
      glowRef.current.scale.setScalar(scale);
    }
  });

  if (!isActive) return null;

  return (
    <group position={position}>
      {/* Внешнее свечение */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Основная точка */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* HTML лейбл */}
      <Html
        center
        distanceFactor={10}
        occlude
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className='text-white/80 text-xs font-medium bg-black/50 px-2 py-1 rounded-full'>
          Active System
        </div>
      </Html>
    </group>
  );
}

// Camera Controller
function CameraController({ zoom }: { zoom: number }) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(0, 0.4 + zoom * 0.5, 2.2 - zoom * 0.8);
      camera.lookAt(0, 0, 0);
    }
  }, [camera, zoom]);

  return null;
}

// Main 3D Digital Twin Component
export default function ThreeDigitalTwin() {
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
      const rotation = -Math.PI / 4 + progress * (Math.PI / 2);
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
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{
            fov: 35,
            position: [0, 0.4, 2.2],
            near: 0.1,
            far: 1000,
          }}
          style={{ background: 'transparent' }}
        >
          {/* Освещение */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[2, 3, 2]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Камера контроллер */}
          <CameraController zoom={cameraZoom} />

          {/* 3D Модель яхты */}
          <YachtModel rotationY={rotationY} activeSystem={activeSystem} />

          {/* 3D Hotspot'ы для всех систем */}
          {SYSTEMS.map(system => (
            <Hotspot3D
              key={system.key}
              position={system.hotspot}
              color={system.color}
              isActive={system.key === activeSystem}
            />
          ))}

          {/* OrbitControls для ручного управления */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={1.5}
            maxDistance={5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>

        {/* Градиентный туман */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent' />
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

      {/* Прокручиваемая область */}
      <div className='h-screen bg-gradient-to-b from-transparent to-black/20' />
    </div>
  );
}
