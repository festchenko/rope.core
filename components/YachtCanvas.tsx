'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// -------- Model loader --------
function YachtModel(props: any) {
  const { scene } = useGLTF('/models/yaсht.glb');
  const groupRef = useRef<THREE.Group>(null);
  const [isScaled, setIsScaled] = React.useState(false);

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
      // If a quick tap (no drag), dolly towards the tapped point
      if (tap.end()) {
        // Raycast to find the point under the cursor
        const rc = new THREE.Raycaster();
        const ndc = new THREE.Vector2(
          (e.clientX / el.clientWidth) * 2 - 1,
          -(e.clientY / el.clientHeight) * 2 + 1
        );
        rc.setFromCamera(ndc, camera);
        // Intersect with scene; fall back to a point ahead if nothing
        const hits = rc.intersectObjects(scene.children, true);
        const target = new THREE.Vector3();
        if (hits && hits.length > 0) target.copy(hits[0].point);
        else target.set(0, 0, 0);

        // Smoothly move camera closer to the target while keeping orbit target synced
        const ctrl = controlsRef.current;
        if (ctrl) {
          const startPos = camera.position.clone();
          const dir = target.clone().sub(startPos).normalize();
          const newPos = target.clone().addScaledVector(dir, 1.6);

          const startTarget = ctrl.target.clone();
          const endTarget = target.clone();

          const duration = 420; // ms
          const t0 = performance.now();
          const animate = () => {
            const t = Math.min(1, (performance.now() - t0) / duration);
            const ease = t * (2 - t); // easeOutQuad
            camera.position.lerpVectors(startPos, newPos, ease);
            ctrl.target.lerpVectors(startTarget, endTarget, ease);
            ctrl.update();
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      }
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
      <fog attach='fog' args={['#0b1018', 5, 20]} />
      {/* Cinematic Sunset Marina Lighting */}
      <ambientLight intensity={0.7} color='#ffffff' />
      <directionalLight
        position={[5, 8, 10]}
        intensity={2.5}
        color='#fff9e8'
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-6, 3, -2]}
        intensity={0.6}
        color='#88aaff'
      />
      <hemisphereLight args={['#ddeeff', '#111', 0.5]} />

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
          color='#1a1a1a' 
          metalness={0} 
          roughness={0.9} 
          transparent={true}
          opacity={0.3}
        />
      </mesh> */}

      {/* Environment lighting */}
      <Environment preset='sunset' />

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

// -------- Public component --------
export default function YachtCanvas() {
  return (
    <div className='w-full h-[calc(100vh-4rem)] md:h-[80vh] rounded-sm overflow-hidden border border-gray-600 bg-gray-800 ios-fullscreen touch-none'>
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
            background:
              'linear-gradient(135deg, #0b1018 0%, #2a2a2a 50%, #1a1a1a 100%)',
          }}
        >
          <color attach='background' args={['#0b1018']} />
          <Suspense fallback={null}>
            <YachtScene />
          </Suspense>
        </Canvas>
      </motion.div>
    </div>
  );
}
