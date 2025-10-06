'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// -------- Model loader --------
function YachtModel(props: any) {
  const { scene } = useGLTF('/models/yaht.glb');
  return (
    <group {...props} dispose={null}>
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

  // Initial camera framing
  useEffect(() => {
    camera.position.set(4.5, 2.6, 6.2);
    camera.near = 0.05;
    camera.far = 200;
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    const el = gl.domElement as HTMLCanvasElement;
    const onDown = (e: PointerEvent) => tap.start(e);
    const onMove = (e: PointerEvent) => tap.move(e);
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
  }, [camera, gl, scene, tap]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[6, 5, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Model */}
      <Suspense
        fallback={
          <Html center>
            <div className='text-xs px-2 py-1 rounded bg-black/50 text-white'>
              Loading yacht…
            </div>
          </Html>
        }
      >
        <group position={[0, -0.3, 0]}>
          <YachtModel />
        </group>
      </Suspense>

      {/* Subtle floor for scale cues */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.31, 0]}
        receiveShadow
      >
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial color='#8f9aa8' metalness={0} roughness={0.9} />
      </mesh>

      {/* Environment lighting */}
      <Environment preset='city' />

      {/* Controls: rotate + pinch-zoom; tap handled above */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.2}
        maxDistance={12}
        makeDefault
      />
    </>
  );
}

// -------- Public component --------
export default function YachtCanvas() {
  return (
    <div className='w-full h-[calc(100vh-4rem)] md:h-[80vh] rounded-2xl overflow-hidden border bg-neutral-950'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full h-full'
      >
        <Canvas shadows camera={{ fov: 45 }} dpr={[1, 2]}>
          <color attach='background' args={['#0a0b0f']} />
          <Suspense fallback={null}>
            <YachtScene />
          </Suspense>
        </Canvas>
      </motion.div>
    </div>
  );
}
