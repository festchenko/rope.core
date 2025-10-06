import React, { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// -------- Yacht Model Component --------
function YachtModel() {
  const { scene } = useGLTF('/models/yaht.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.castShadow = true;
      modelRef.current.receiveShadow = true;
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}

// -------- Scene Component --------
function YachtScene() {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef<any>(null);
  const [tap, setTap] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = gl.domElement;
    let isDragging = false;
    let startPos = new THREE.Vector3();
    let startTarget = new THREE.Vector3();

    const onDown = (e: PointerEvent) => {
      isDragging = false;
      startPos.copy(camera.position);
      if (controlsRef.current) {
        startTarget.copy(controlsRef.current.target);
      }
    };

    const onMove = () => {
      isDragging = true;
    };

    const onUp = (e: PointerEvent) => {
      if (!isDragging && e.pointerType !== 'mouse') {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        setTap({ x, y });
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
  }, [camera, gl, scene]);

  useEffect(() => {
    if (tap && controlsRef.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(tap.x, tap.y), camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const target = intersects[0].point;
        const newPos = camera.position
          .clone()
          .sub(target)
          .normalize()
          .multiplyScalar(3)
          .add(target);
        const startPos = camera.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const endTarget = target.clone();

        const duration = 420; // ms
        const t0 = performance.now();
        const animate = () => {
          const t = Math.min(1, (performance.now() - t0) / duration);
          const ease = t * (2 - t); // easeOutQuad
          camera.position.lerpVectors(startPos, newPos, ease);
          controlsRef.current.target.lerpVectors(startTarget, endTarget, ease);
          controlsRef.current.update();
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }
  }, [tap, camera, scene]);

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
