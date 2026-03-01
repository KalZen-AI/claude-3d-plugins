# Scroll Scene — Reference

GSAP ScrollTrigger patterns, Lenis setup, and scroll-to-animation mapping.

## Full GSAP + Lenis + Three.js setup

Complete initialization pattern for a scroll-driven 3D scene.

### HTML structure

```html
<!-- Fixed 3D canvas -->
<div id="scene-container" aria-hidden="true"></div>

<!-- Scrollable content -->
<div id="scroll-content">
  <section id="chapter-1" class="chapter">
    <div class="chapter-text">
      <h2>Chapter 1: Introduction</h2>
      <p>Content for the first section.</p>
    </div>
  </section>

  <section id="chapter-2" class="chapter">
    <div class="chapter-text">
      <h2>Chapter 2: Features</h2>
      <p>Content for the second section.</p>
    </div>
  </section>

  <section id="chapter-3" class="chapter">
    <div class="chapter-text">
      <h2>Chapter 3: Details</h2>
      <p>Content for the third section.</p>
    </div>
  </section>
</div>
```

### CSS

```css
#scene-container {
  position: fixed;
  inset: 0;
  z-index: 0;
}

#scroll-content {
  position: relative;
  z-index: 1;
}

.chapter {
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 5vw;
  pointer-events: none;
}

.chapter-text {
  max-width: 480px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  color: #fafafa;
  pointer-events: auto;
}
```

### JavaScript initialization

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// --- Lenis smooth scroll ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// --- Three.js setup ---
const container = document.getElementById('scene-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Load model and set up scroll animations ---
const loader = new GLTFLoader();
loader.load('models/product.glb', (gltf) => {
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  scene.add(model);

  setupScrollAnimations(model);
});

function setupScrollAnimations(model) {
  // Chapter 1: gentle rotation
  gsap.to(model.rotation, {
    y: Math.PI * 0.5,
    scrollTrigger: {
      trigger: '#chapter-1',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Chapter 2: zoom in + continue rotation
  gsap.to(camera.position, {
    z: 2.5,
    y: 1,
    scrollTrigger: {
      trigger: '#chapter-2',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to(model.rotation, {
    y: Math.PI,
    scrollTrigger: {
      trigger: '#chapter-2',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Chapter 3: pull back to wide view
  gsap.to(camera.position, {
    z: 6,
    y: 3,
    scrollTrigger: {
      trigger: '#chapter-3',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to(model.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
      trigger: '#chapter-3',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

// --- Animation loop ---
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
```

## ScrollTrigger configuration patterns

### Basic scrub (most common)

```javascript
gsap.to(target, {
  propertyName: endValue,
  scrollTrigger: {
    trigger: '#section',     // Element that triggers the animation
    start: 'top top',        // When trigger's top hits viewport top
    end: 'bottom top',       // When trigger's bottom hits viewport top
    scrub: 1,                // Smooth scrub with 1s catch-up
  },
});
```

### Start/end position reference

```
'top top'      — trigger's top edge hits viewport's top edge
'top center'   — trigger's top edge hits viewport's center
'top 80%'      — trigger's top edge hits 80% down the viewport
'bottom top'   — trigger's bottom edge hits viewport's top edge
'center center' — trigger's center hits viewport's center
```

### Pin a section while animating

```javascript
ScrollTrigger.create({
  trigger: '#pinned-section',
  start: 'top top',
  end: '+=200%',             // Pin for 2x viewport heights of scroll
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress; // 0 → 1
    // Use progress to drive any animation
  },
});
```

### Snap to sections

```javascript
ScrollTrigger.create({
  trigger: '#scroll-content',
  start: 'top top',
  end: 'bottom bottom',
  snap: {
    snapTo: 1 / (totalChapters - 1), // Snap to each chapter
    duration: 0.5,
    ease: 'power2.inOut',
  },
});
```

## Camera path with scroll progress

```javascript
// Define camera path points
const pathPoints = [
  new THREE.Vector3(0, 2, 5),    // Front
  new THREE.Vector3(4, 3, 3),    // Upper right
  new THREE.Vector3(5, 1.5, -1), // Right side
  new THREE.Vector3(2, 2, -4),   // Behind
  new THREE.Vector3(-3, 3, -2),  // Behind left
  new THREE.Vector3(-4, 2, 2),   // Left side
];

const cameraPath = new THREE.CatmullRomCurve3(pathPoints, false);
// false = open path (start to end)
// true = closed loop (returns to start)

// Optional: define look-at targets per chapter
const lookTargets = [
  new THREE.Vector3(0, 0, 0),   // Center
  new THREE.Vector3(0, 0.5, 0), // Slightly above center
  new THREE.Vector3(1, 0, 0),   // Off-center right
  new THREE.Vector3(0, 0, 0),   // Back to center
];

ScrollTrigger.create({
  trigger: '#scroll-content',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1.5,
  onUpdate: (self) => {
    // Move camera along path
    const pos = cameraPath.getPointAt(self.progress);
    camera.position.copy(pos);

    // Interpolate look-at target
    const targetIndex = self.progress * (lookTargets.length - 1);
    const i = Math.floor(targetIndex);
    const t = targetIndex - i;
    const from = lookTargets[Math.min(i, lookTargets.length - 1)];
    const to = lookTargets[Math.min(i + 1, lookTargets.length - 1)];
    const lookAt = new THREE.Vector3().lerpVectors(from, to, t);
    camera.lookAt(lookAt);
  },
});
```

## Easing functions for Lenis

```javascript
// Default — exponential ease out (recommended)
(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

// Smoother — cubic ease out
(t) => 1 - Math.pow(1 - t, 3)

// Snappy — quintic ease out
(t) => 1 - Math.pow(1 - t, 5)
```

## Progress-to-animation mapping formulas

### Linear map

```javascript
// Map progress (0-1) to a range
function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

// Example: map scroll to rotation 0 → 2π
model.rotation.y = lerp(0, Math.PI * 2, progress);
```

### Segmented map (different behavior per chapter)

```javascript
function segmentedProgress(progress, segments) {
  // segments = [0, 0.33, 0.66, 1.0] for 3 chapters
  for (let i = 0; i < segments.length - 1; i++) {
    if (progress <= segments[i + 1]) {
      return {
        chapter: i,
        localProgress: (progress - segments[i]) / (segments[i + 1] - segments[i]),
      };
    }
  }
  return { chapter: segments.length - 2, localProgress: 1 };
}

// Usage
const { chapter, localProgress } = segmentedProgress(scrollProgress, [0, 0.33, 0.66, 1.0]);
switch (chapter) {
  case 0: // Rotate
    model.rotation.y = lerp(0, Math.PI, localProgress);
    break;
  case 1: // Zoom
    camera.position.z = lerp(5, 2, localProgress);
    break;
  case 2: // Pull back
    camera.position.z = lerp(2, 6, localProgress);
    camera.position.y = lerp(1, 3, localProgress);
    break;
}
```

### Smooth step (ease in/out per segment)

```javascript
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Apply to a scroll range: smooth transition between 0.3 and 0.6 progress
const opacity = smoothstep(0.3, 0.6, scrollProgress);
model.material.opacity = opacity;
```

## CDN links

```html
<!-- GSAP + ScrollTrigger -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>

<!-- Lenis -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>

<!-- Or via importmap for ES modules -->
<script type="importmap">
{
  "imports": {
    "gsap": "https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js",
    "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js",
    "lenis": "https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.mjs"
  }
}
</script>
```

**npm:**
```bash
npm install gsap lenis
```
