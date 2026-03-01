# Viewer — Code Examples

Three complete implementations for reference. Adapt these to the user's project.

## Example 1: Standalone HTML with vanilla Three.js

A single HTML file with no build step. Uses importmap for Three.js from CDN.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Model Viewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #111; overflow: hidden; }
    #viewer {
      width: 100vw;
      height: 100vh;
      position: relative;
    }
    #viewer canvas { display: block; }
    #loading {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-family: system-ui, sans-serif;
      font-size: 0.875rem;
    }
    #loading.hidden { display: none; }
  </style>
</head>
<body>
  <div id="viewer" aria-label="Interactive 3D model viewer — drag to rotate, scroll to zoom">
    <div id="loading">Loading model...</div>
  </div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/"
    }
  }
  </script>
  <script type="module">
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const container = document.getElementById('viewer');
    const loadingEl = document.getElementById('loading');

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      controls.autoRotate = false;
    }

    // Lighting — studio preset
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-3, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/libs/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Load model
    gltfLoader.load(
      'models/product.glb',
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Auto-fit camera to model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length();

        model.position.sub(center); // center the model
        camera.position.set(0, size * 0.5, size * 2.5);
        controls.target.set(0, 0, 0);
        controls.update();

        camera.near = size * 0.01;
        camera.far = size * 10;
        camera.updateProjectionMatrix();

        loadingEl.classList.add('hidden');
      },
      (progress) => {
        if (progress.total > 0) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          loadingEl.textContent = `Loading model... ${pct}%`;
        }
      },
      (error) => {
        loadingEl.textContent = 'Failed to load model';
        console.error('GLTF load error:', error);
      }
    );

    // Resize handling
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animate
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });
  </script>
  <noscript>
    <p>Enable JavaScript to view the interactive 3D model.</p>
  </noscript>
</body>
</html>
```

## Example 2: React Three Fiber component

A reusable React component. Requires `@react-three/fiber` and `@react-three/drei`.

```tsx
// components/ModelViewer.tsx
'use client'; // Required for Next.js app router

import { Suspense, useRef } from 'react';
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
```

**Usage:**

```tsx
// In a page or parent component
import ModelViewer from '@/components/ModelViewer';

export default function ProductPage() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ModelViewer
        modelUrl="/models/product.glb"
        autoRotate
        environment="studio"
      />
    </div>
  );
}
```

**Next.js dynamic import (if SSR causes issues):**

```tsx
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,
  loading: () => <div>Loading viewer...</div>,
});
```

## Example 3: `<model-viewer>` embed

The simplest integration — a single HTML element, no JavaScript required.

```html
<!-- Add the script once, in <head> or before use -->
<script
  type="module"
  src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0/model-viewer.min.js"
></script>

<!-- The viewer -->
<model-viewer
  src="models/product.glb"
  alt="Interactive 3D model of a ceramic coffee mug"
  camera-controls
  auto-rotate
  auto-rotate-delay="1000"
  rotation-per-second="30deg"
  shadow-intensity="1"
  environment-image="neutral"
  loading="lazy"
  poster="images/product-poster.webp"
  style="width: 100%; height: 500px; background: #f5f5f5;"
>
  <!-- Optional: loading indicator -->
  <div slot="progress-bar" style="display: none;"></div>

  <!-- Optional: AR button for mobile -->
  <button slot="ar-button" style="
    position: absolute;
    bottom: 16px;
    right: 16px;
    padding: 8px 16px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
  ">
    View in AR
  </button>
</model-viewer>

<style>
  /* Responsive sizing */
  model-viewer {
    min-height: 300px;
    max-height: 80vh;
  }

  /* Reduce motion */
  @media (prefers-reduced-motion: reduce) {
    model-viewer {
      auto-rotate: false;
    }
  }
</style>
```

**Advantages of `<model-viewer>`:**
- Zero JavaScript to write
- Built-in AR support on Android and iOS
- Handles loading, progress, and error states
- Accessible by default
- Works in any framework (React, Vue, Astro, plain HTML)

**Limitations:**
- Less customizable lighting and post-processing than Three.js
- No programmatic scene composition
- Limited animation control
