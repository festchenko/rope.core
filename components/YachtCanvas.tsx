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

  useEffect(() => {
    if (scene && !isScaled) {
      console.log('Scaling model...', scene);

      // Wait for model to be fully loaded
      setTimeout(() => {
        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        console.log('Model size:', size);
        console.log('Model center:', center);

        // Calculate scale to fit in view
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 4; // Target size in world units
        const scale = targetSize / maxDimension;

        console.log('Calculated scale:', scale);

        // Apply transformations
        scene.scale.setScalar(scale);
        scene.position.sub(center.multiplyScalar(scale));

        // Enable shadows
        scene.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setIsScaled(true);
        console.log('Model scaled successfully');
      }, 100);
    }
  }, [scene, isScaled]);

  // Alternative scaling approach using useFrame
  useFrame(() => {
    if (scene && !isScaled && scene.children.length > 0) {
      console.log('useFrame scaling...');

      // Calculate bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      if (size.length() > 0) {
        // Calculate scale to fit in view
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 4; // Target size in world units
        const scale = targetSize / maxDimension;

        // Apply transformations
        scene.scale.setScalar(scale);
        scene.position.sub(center.multiplyScalar(scale));

        // Enable shadows
        scene.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setIsScaled(true);
        console.log('useFrame: Model scaled successfully');
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

  // Initial camera framing
  useEffect(() => {
    // Set camera position for good initial view
    camera.position.set(5, 3, 7);
    camera.lookAt(0, 0, 0);
    camera.near = 0.1;
    camera.far = 1000;
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
      <Environment preset='city' />

      {/* Controls: rotate + pinch-zoom; tap handled above */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
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
