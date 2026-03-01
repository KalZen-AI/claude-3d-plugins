// components/ModelViewer.tsx
// React Three Fiber model viewer component.
// Requires: @react-three/fiber, @react-three/drei
'use client'; // Required for Next.js app router

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Environment, useGLTF, useProgress, Html } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <p style={{ color: '#999', fontFamily: 'system-ui', fontSize: '0.875rem' }}>
        {progress.toFixed(0)}% loaded
      </p>
    </Html>
  );
}

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

interface ModelViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  environment?: 'studio' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'city' | 'park' | 'forest';
  background?: string;
  className?: string;
}

export default function ModelViewer({
  modelUrl,
  autoRotate = true,
  environment = 'studio',
  background = 'transparent',
  className,
}: ModelViewerProps) {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', background }}
      aria-label="Interactive 3D model viewer"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: 3, // ACESFilmicToneMapping
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }}
      >
        <Suspense fallback={<Loader />}>
          <Model url={modelUrl} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate={autoRotate && !reducedMotion}
            autoRotateSpeed={1.0}
          />
          <Environment preset={environment} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Usage:
//
// import ModelViewer from '@/components/ModelViewer';
//
// export default function ProductPage() {
//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <ModelViewer
//         modelUrl="/models/product.glb"
//         autoRotate
//         environment="studio"
//       />
//     </div>
//   );
// }
//
// Next.js dynamic import (if SSR causes issues):
//
// import dynamic from 'next/dynamic';
// const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
//   ssr: false,
//   loading: () => <div>Loading viewer...</div>,
// });
