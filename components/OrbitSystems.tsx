'use client';

/**
 * OrbitSystems - 360 Systems Mode Component
 *
 * Features:
 * - Circular orbit of system cards around the yacht
 * - Touch/pointer gestures for rotation (mobile-friendly)
 * - Keyboard controls (Left/Right arrows) for desktop testing
 * - Auto-snap to nearest system on gesture end
 * - Focused system card is larger and highlighted
 * - Cyan dashed line connects focused card to yacht anchor
 * - Yacht model rotates slightly with system selection
 *
 * Usage:
 * - Swipe left/right on mobile to rotate and select systems
 * - Use arrow keys on desktop to navigate systems
 * - Active system status shown in top HUD
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useUI } from '../state/useUI';

interface SystemCardProps {
  system: {
    id: string;
    label: string;
    anchor: [number, number, number];
    status?: string;
    value?: string;
    icon?: string;
  };
  position: [number, number, number];
  isActive: boolean;
  rotationY: number;
}

function SystemCard({
  system,
  position,
  isActive,
  rotationY,
}: SystemCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseScale = isActive ? 0.65 : 0.56; // Увеличили на 30%
  const opacity = isActive ? 1.0 : 0.55;

  // Calculate perspective scale based on distance from camera
  const distanceFromCamera = Math.sqrt(
    position[0] * position[0] +
      position[1] * position[1] +
      position[2] * position[2]
  );
  const perspectiveScale = Math.max(
    0.2,
    Math.min(0.8, 1.5 / distanceFromCamera)
  ); // Уменьшенный диапазон
  const finalScale = baseScale * perspectiveScale;

  // Animate scale, opacity and position
  useFrame(() => {
    if (meshRef.current) {
      // Animate scale with perspective - optimized for mobile
      meshRef.current.scale.lerp(
        new THREE.Vector3(finalScale, finalScale, finalScale),
        0.02 // Much slower for smoother animation on mobile
      );

      // Animate position - smooth movement to target position
      meshRef.current.position.lerp(new THREE.Vector3(...position), 0.03); // Much slower for smoother animation on mobile
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <Html
          center
          distanceFactor={8}
          style={{
            transform: `scale(${finalScale})`,
            opacity: opacity,
            transition:
              'opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease',
            filter: isActive ? 'none' : 'blur(2px)',
          }}
        >
          <div
            className='system-card'
            style={{
              background: '#11161d',
              border: isActive ? '2px solid #00ffd1' : '1px solid #26303a',
              borderRadius: '12px',
              padding: isActive ? '5px' : '4px', // Увеличили на 30%
              minWidth: isActive ? '52px' : '39px', // Увеличили на 30%
              textAlign: 'center',
              color: '#cdd6df',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: isActive ? '9px' : '8px', // Увеличили на 30%
              fontWeight: isActive ? '600' : '500',
              boxShadow: isActive
                ? '0 0 25px rgba(0, 255, 209, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.2)',
              transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div
              style={{
                color: isActive ? '#00ffd1' : '#00ffd1',
                fontSize: isActive ? '7px' : '5px', // Увеличили на 30%
                fontWeight: isActive ? '700' : '600',
                marginBottom: isActive ? '3px' : '1px', // Увеличили на 30%
                textShadow: isActive
                  ? '0 0 10px rgba(0, 255, 209, 0.5)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px', // Увеличили на 30%
              }}
            >
              <span style={{ fontSize: isActive ? '8px' : '7px' }}>
                {' '}
                {/* Увеличили на 30% */}
                {system.icon}
              </span>
              {system.label}
            </div>
            <div
              style={{
                fontSize: isActive ? '5px' : '4px', // Увеличили на 30%
                opacity: isActive ? 0.9 : 0.6,
                marginBottom: isActive ? '1px' : '1px', // Увеличили на 30%
                fontWeight: isActive ? '500' : '400',
              }}
            >
              {system.status}
            </div>
            <div
              style={{
                fontSize: isActive ? '4px' : '4px', // Увеличили на 30%
                opacity: isActive ? 0.8 : 0.5,
                fontWeight: isActive ? '500' : '400',
              }}
            >
              {system.value}
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// PointerLine component removed as requested

export default function OrbitSystems() {
  const { camera, gl } = useThree();
  const {
    activeSystem,
    rotationY,
    systems,
    setRotationY,
    setActiveSystem,
    snapToNearestSystem,
  } = useUI();

  // State for card appearance animation
  const [visibleCards, setVisibleCards] = React.useState<number>(0);
  const [isYachtLoaded, setIsYachtLoaded] = React.useState(false);
  const [showHUD, setShowHUD] = React.useState(false);

  const gestureRef = useRef<{
    isDragging: boolean;
    startX: number;
    startRotation: number;
    lastX: number;
  }>({
    isDragging: false,
    startX: 0,
    startRotation: 0,
    lastX: 0,
  });

  // Gesture handling - now we switch systems instead of rotating
  const handlePointerDown = useCallback((event: PointerEvent) => {
    gestureRef.current.isDragging = true;
    gestureRef.current.startX = event.clientX;
    gestureRef.current.lastX = event.clientX;
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!gestureRef.current.isDragging) return;
    // Just track movement, we'll handle switching on pointer up
    gestureRef.current.lastX = event.clientX;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (gestureRef.current.isDragging) {
      gestureRef.current.isDragging = false;

      const deltaX = gestureRef.current.lastX - gestureRef.current.startX;
      const threshold = 50; // Minimum swipe distance

      if (Math.abs(deltaX) > threshold) {
        const currentIndex = systems.findIndex(s => s.id === activeSystem);
        let newIndex;

        if (deltaX > 0) {
          // Swipe right - go to previous system
          newIndex = (currentIndex - 1 + systems.length) % systems.length;
        } else {
          // Swipe left - go to next system
          newIndex = (currentIndex + 1) % systems.length;
        }

        setActiveSystem(systems[newIndex].id);
      }
    }
  }, [activeSystem, systems, setActiveSystem]);

  // Keyboard controls for desktop testing
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        const currentIndex = systems.findIndex(s => s.id === activeSystem);
        const prevIndex = (currentIndex - 1 + systems.length) % systems.length;
        setActiveSystem(systems[prevIndex].id);
      } else if (event.key === 'ArrowRight') {
        const currentIndex = systems.findIndex(s => s.id === activeSystem);
        const nextIndex = (currentIndex + 1) % systems.length;
        setActiveSystem(systems[nextIndex].id);
      }
    },
    [activeSystem, systems, setActiveSystem]
  );

  // Check if yacht is loaded (look for yacht model in scene)
  useEffect(() => {
    const checkYachtLoaded = () => {
      // Simple check - if we're on client side and have been running for a bit
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          setIsYachtLoaded(true);
        }, 3000); // Wait 3 seconds for yacht to load
      }
    };

    checkYachtLoaded();
  }, []);

  // Animate cards appearing one by one after yacht loads
  useEffect(() => {
    if (isYachtLoaded && visibleCards < systems.length) {
      const timer = setTimeout(() => {
        setVisibleCards(prev => prev + 1);
      }, 200); // Show one card every 200ms for smoother effect

      return () => clearTimeout(timer);
    }
  }, [isYachtLoaded, visibleCards, systems.length]);

  // Event listeners
  useEffect(() => {
    const canvas = gl.domElement;

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);

      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    gl.domElement,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
  ]);

  // Early return if not on client side
  if (typeof window === 'undefined') {
    return null;
  }

  const orbitRadius = 1.5; // Увеличиваем радиус для лучшего разделения
  const angleStep = (2 * Math.PI) / systems.length;

  // Calculate system positions - active card in center, others around
  const activeSystemIndex = systems.findIndex(s => s.id === activeSystem);
  const systemPositions = systems.map((_, index) => {
    if (index === activeSystemIndex) {
      // Active card in center (in front of camera) - perfectly centered
      return [0, 0, 1.5] as [number, number, number];
    } else {
      // Other cards around the yacht - разнесены по вертикали
      const angle = index * angleStep + rotationY;
      const verticalOffset = (index % 3) * 0.4 - 0.4; // 3 уровня по вертикали
      return [
        Math.cos(angle) * orbitRadius,
        0.3 + verticalOffset, // Разные высоты
        Math.sin(angle) * orbitRadius,
      ] as [number, number, number];
    }
  });

  return (
    <group>
      {/* System Cards - only show visible cards */}
      {systems.map((system, index) => {
        if (index >= visibleCards) return null; // Don't render if not visible yet

        return (
          <SystemCard
            key={system.id}
            system={system}
            position={systemPositions[index]}
            isActive={system.id === activeSystem}
            rotationY={rotationY}
          />
        );
      })}

      {/* Pointer Line removed as requested */}
    </group>
  );
}
