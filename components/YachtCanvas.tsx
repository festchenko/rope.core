'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { theme } from '../lib/theme';
import { useUI } from '../state/useUI';
import OrbitSystems from './OrbitSystems';

// -------- Model loader --------
function YachtModel(props: any) {
  const { scene } = useGLTF('/models/yaсht.glb');
  const groupRef = useRef<THREE.Group>(null);
  const [isScaled, setIsScaled] = React.useState(false);
  const { rotationY } = useUI();

  // Remove useEffect scaling to prevent conflicts with useFrame

  // Optimized scaling approach using useFrame
  useFrame(() => {
    if (scene && !isScaled && scene.children.length > 0) {
      // Calculate bounding box only once
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      if (size.length() > 0) {
        // Detect mobile device and adjust target size - with SSR safety
        const isClient = typeof window !== 'undefined';
        const isMobile = isClient && window.innerWidth < 768;
        const isSmallMobile = isClient && window.innerWidth < 480;
        let targetSize = 4; // Default desktop

        if (isSmallMobile) {
          targetSize = 1.2; // Very small for small phones
        } else if (isMobile) {
          targetSize = 1.8; // Small for mobile
        } else if (!isClient) {
          // SSR fallback - use mobile size for safety
          targetSize = 1.8;
        }

        // Calculate scale to fit in view - focus on hull, not mast
        const hullSize = Math.max(size.x, size.z); // Use X and Z (hull dimensions), ignore Y (mast height)
        const scale = targetSize / hullSize;

        // Apply transformations - center on hull, not mast
        scene.scale.setScalar(scale);
        // Center the model properly - center on hull level
        scene.position.set(
          -center.x * scale,
          -center.y * scale, // Center on actual model center
          -center.z * scale
        );

        // Enable shadows efficiently
        scene.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setIsScaled(true);
      }
    }

    // Apply rotation based on active system
    if (groupRef.current) {
      const { activeSystem, systems } = useUI.getState();
      const activeSystemIndex = systems.findIndex(s => s.id === activeSystem);
      if (activeSystemIndex !== -1) {
        const angleStep = (2 * Math.PI) / systems.length;
        const targetRotation = activeSystemIndex * angleStep;
        groupRef.current.rotation.y = targetRotation * 0.3; // Rotate yacht based on active system
      }
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// -------- Tap-to-zoom helper --------
function useTapZoom() {
  const tapRef = useRef<{
    t: number;
    down: boolean;
    moved: boolean;
    x: number;
    y: number;
  } | null>(null);

  const start = (e: PointerEvent) => {
    tapRef.current = {
      t: performance.now(),
      down: true,
      moved: false,
      x: e.clientX,
      y: e.clientY,
    };
  };

  const move = (e: PointerEvent) => {
    if (!tapRef.current) return;
    const dx = Math.abs(e.clientX - tapRef.current.x);
    const dy = Math.abs(e.clientY - tapRef.current.y);
    if (dx > 6 || dy > 6) tapRef.current.moved = true;
  };

  const isTap = () => {
    const st = tapRef.current;
    if (!st) return false;
    const dt = performance.now() - st.t;
    return st.down && !st.moved && dt < 300;
  };

  const end = () => {
    const ok = isTap();
    tapRef.current = null;
    return ok;
  };

  return { start, move, end };
}

// -------- Scene with camera animation --------
function YachtScene() {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef<any>(null);
  const tap = useTapZoom();
  const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoRotateEnabled, setAutoRotateEnabled] = React.useState(true);

  // Auto-rotation management
  const handleUserInteraction = React.useCallback(() => {
    // Disable auto-rotation immediately
    setAutoRotateEnabled(false);

    // Clear existing timeout
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
    }

    // Set new timeout to re-enable auto-rotation after 5 seconds
    autoRotateTimeoutRef.current = setTimeout(() => {
      setAutoRotateEnabled(true);
    }, 5000);
  }, []);

  // Initial camera framing - run only once
  useEffect(() => {
    // Detect mobile device and adjust camera - with SSR safety
    const isClient = typeof window !== 'undefined';
    const isMobile = isClient && window.innerWidth < 768;
    const isSmallMobile = isClient && window.innerWidth < 480;

    if (isSmallMobile) {
      // Very small mobile camera position
      camera.position.set(2, 2, 3);
      camera.lookAt(0, -0.5, 0); // Look at yacht center, slightly below
    } else if (isMobile) {
      // Mobile camera position - focus on yacht center
      camera.position.set(3, 2.5, 4);
      camera.lookAt(0, -0.5, 0); // Look at yacht center, slightly below
    } else {
      // Desktop camera position - focus on yacht center
      camera.position.set(5, 3.5, 7);
      camera.lookAt(0, -0.5, 0); // Look at yacht center, slightly below
    }

    camera.near = 0.1;
    camera.far = 1000;
    camera.updateProjectionMatrix();
  }, [camera]); // Include camera dependency

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const el = gl.domElement as HTMLCanvasElement;
    const onDown = (e: PointerEvent) => {
      tap.start(e);
      handleUserInteraction(); // Disable auto-rotation on interaction
    };
    const onMove = (e: PointerEvent) => {
      tap.move(e);
      handleUserInteraction(); // Disable auto-rotation on interaction
    };
    const onUp = async (e: PointerEvent) => {
      // No zoom on tap - just disable auto-rotation
    };

    el.addEventListener('pointerdown', onDown, { passive: true });
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerup', onUp, { passive: true });
    el.addEventListener('pointercancel', onUp, { passive: true });

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [camera, gl, scene, tap, handleUserInteraction]);

  return (
    <>
      {/* Gradient background fog to match CSS gradient */}
      <fog attach='fog' args={[theme.colors.scene.fog, 5, 20]} />
      {/* Cinematic Sunset Marina Lighting */}
      <ambientLight intensity={0.7} color={theme.colors.scene.ambientLight} />
      <directionalLight
        position={[5, 8, 10]}
        intensity={2.5}
        color={theme.colors.scene.directionalLight}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-6, 3, -2]}
        intensity={0.6}
        color={theme.colors.scene.directionalLightSecondary}
      />
      <hemisphereLight
        args={[
          theme.colors.scene.hemisphereLight,
          theme.colors.background,
          0.5,
        ]}
      />

      {/* Model */}
      <Suspense
        fallback={
          <Html center>
            <div className='flex flex-col items-center justify-center space-y-6'>
              {/* Animated loading spinner */}
              <div className='relative'>
                <div className='w-16 h-16 border-3 border-white/10 rounded-full animate-spin border-t-accent'></div>
                <div className='absolute inset-0 w-16 h-16 border-3 border-transparent rounded-full animate-pulse-glow border-t-accent/30'></div>
                <div
                  className='absolute inset-2 w-12 h-12 border-2 border-transparent rounded-full animate-spin border-t-accent/60'
                  style={{
                    animationDirection: 'reverse',
                    animationDuration: '1.5s',
                  }}
                ></div>
              </div>
              {/* Loading text */}
              <div className='text-base font-medium text-white/90 tracking-wide'>
                Loading yacht…
              </div>
              {/* Progress bar */}
              <div className='w-40 h-1.5 bg-white/10 rounded-full overflow-hidden'>
                <div className='h-full bg-gradient-to-r from-accent via-accent/80 to-accent/60 rounded-full animate-pulse-glow'></div>
              </div>
            </div>
          </Html>
        }
      >
        <group position={[0, -0.3, 0]}>
          <YachtModel />
        </group>
      </Suspense>

      {/* Floor removed for cleaner look */}
      {/* <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.31, 0]}
        receiveShadow
      >
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial 
          color='#1a1d23' 
          metalness={0} 
          roughness={0.9} 
          transparent={true}
          opacity={0.3}
        />
      </mesh> */}

      {/* Environment lighting */}
      <Environment preset='sunset' />

      {/* 360 Systems Orbit */}
      <Suspense fallback={null}>
        <OrbitSystems />
      </Suspense>

      {/* Controls: rotate + pinch-zoom; tap handled above */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        autoRotate={autoRotateEnabled}
        autoRotateSpeed={0.6}
        minDistance={
          typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2
        }
        maxDistance={
          typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 20
        }
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        target={[0, -0.5, 0]} // Focus on yacht center, slightly below model center
        makeDefault
      />
    </>
  );
}

// -------- HUD Component --------
function SystemHUD() {
  const { activeSystem, systems } = useUI();
  const activeSystemData = systems.find(s => s.id === activeSystem);

  // Debug log removed for production

  // Early return if not on client side or no active system
  if (typeof window === 'undefined' || !activeSystemData) return null;

  return (
    <div className='absolute top-24 left-1/2 transform -translate-x-1/2 z-10'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className='relative'
      >
        {/* Main HUD container - styled like topbar */}
        <div
          className='relative px-6 py-3 rounded-lg border border-gray-600 bg-gray-800'
          style={{
            color: '#cdd6df',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle animated background gradient */}
          <motion.div
            className='absolute inset-0 rounded-lg'
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(0, 255, 209, 0.05) 50%, transparent 100%)',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Content */}
          <div className='relative z-10'>
            {/* System name with subtle animation */}
            <motion.div
              style={{
                color: '#00ffd1',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '6px',
                letterSpacing: '0.3px',
              }}
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {activeSystemData.label}
            </motion.div>

            {/* Status and value with hover effects */}
            <div className='flex items-center justify-center gap-3'>
              <motion.div
                className='px-2 py-1 rounded text-xs font-medium'
                style={{
                  background: 'rgba(0, 255, 209, 0.1)',
                  color: '#00ffd1',
                  border: '1px solid rgba(0, 255, 209, 0.2)',
                }}
                whileHover={{
                  scale: 1.05,
                  background: 'rgba(0, 255, 209, 0.15)',
                }}
                transition={{ duration: 0.2 }}
              >
                {activeSystemData.status}
              </motion.div>

              <div
                style={{
                  fontSize: '10px',
                  opacity: 0.6,
                  color: '#cdd6df',
                }}
              >
                •
              </div>

              <motion.div
                className='px-2 py-1 rounded text-xs font-medium'
                style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#cdd6df',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                }}
                whileHover={{
                  scale: 1.05,
                  background: 'rgba(107, 114, 128, 0.15)',
                }}
                transition={{ duration: 0.2 }}
              >
                {activeSystemData.value}
              </motion.div>
            </div>
          </div>

          {/* Corner accent removed */}
        </div>
      </motion.div>
    </div>
  );
}

// -------- Public component --------
export default function YachtCanvas() {
  return (
    <div className='w-full h-[calc(100vh-4rem)] md:h-[80vh] rounded-lg overflow-hidden border border-gray-600 bg-gray-800 ios-fullscreen touch-none relative'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full h-full'
      >
        <Canvas
          shadows
          camera={{ fov: 45 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.card} 50%, ${theme.colors.background} 100%)`,
          }}
        >
          <color attach='background' args={[theme.colors.background]} />
          <Suspense fallback={null}>
            <YachtScene />
          </Suspense>
        </Canvas>

        {/* System HUD */}
        <SystemHUD />
      </motion.div>
    </div>
  );
}
