---
description: Create scroll-driven 3D storytelling experiences. Use when the user wants 3D content that responds to page scroll — camera fly-throughs, model reveals, scroll-animated transformations.
---

# 3d-websites scroll-scene

Build immersive scroll-driven 3D experiences — map scroll progress to camera movement, model transforms, shader reveals, and stage transitions. The hottest pattern in 3D web development.

## Gather requirements

Ask the user:

- **Narrative structure** — what happens as the user scrolls? (e.g., "camera flies around the product, then zooms into a detail, then pulls back to show the full lineup")
- **Models** — which GLB files to include?
- **Number of chapters/sections** — how many distinct "acts" in the scroll story?
- **Content** — is there text/HTML that overlays or accompanies the 3D? Or is it pure 3D?
- **Framework** — R3F + drei ScrollControls, or vanilla Three.js + GSAP?

## Architecture decision

### Option 1: Vanilla Three.js + GSAP ScrollTrigger + Lenis

Best for: plain HTML projects, maximum control, complex multi-model scenes, sites not using React.

**Stack:**
- Three.js — 3D rendering
- GSAP + ScrollTrigger — scroll-to-animation mapping
- Lenis — smooth scrolling (optional but recommended)

### Option 2: React Three Fiber + drei ScrollControls

Best for: React/Next.js projects, simpler scroll animations, component-based scenes.

**Stack:**
- @react-three/fiber — React Three.js wrapper
- @react-three/drei ScrollControls + Scroll + useScroll — scroll integration

Recommend Option 1 for complex multi-chapter experiences, Option 2 for React projects with simpler scroll needs.

## Core concept: scroll progress

The fundamental pattern: map a scroll range (in pixels or viewport heights) to a 0→1 progress value, then use that progress to drive 3D transforms.

```
Scroll position    →  Progress (0-1)  →  3D Transform
top of section     →  0               →  camera at start position
middle             →  0.5             →  camera at midpoint
bottom of section  →  1               →  camera at end position
```

## GSAP ScrollTrigger approach

### Setup

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### Pin the canvas and animate on scroll

The key pattern: pin the 3D canvas (position: fixed) while HTML content scrolls over it. Use ScrollTrigger to map scroll position to animation progress.

```javascript
// Proxy object to hold animated values
const state = { cameraX: 0, cameraY: 2, cameraZ: 5, rotationY: 0 };

// Chapter 1: camera orbits right
gsap.to(state, {
  cameraX: 4,
  cameraZ: 3,
  scrollTrigger: {
    trigger: '#chapter-1',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,         // smooth tie to scroll
    pin: false,        // content scrolls naturally
  },
  onUpdate: () => {
    camera.position.set(state.cameraX, state.cameraY, state.cameraZ);
    camera.lookAt(0, 0, 0);
  },
});
```

Use `scrub: true` (or a number like `scrub: 1` for smoothing) to tie the animation directly to scroll position rather than triggering it.

### Section pinning

Pin the 3D canvas so it stays visible while text content scrolls:

```css
.scroll-scene-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.scroll-content {
  position: relative;
  z-index: 1;
}

.chapter {
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 5vw;
}

.chapter-text {
  max-width: 500px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 12px;
}
```

## Lenis smooth scrolling

Lenis provides buttery-smooth scrolling that pairs well with GSAP ScrollTrigger.

```javascript
import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

See [reference.md](reference.md) for the full setup pattern.

## Animation types

### Camera path animation

Move the camera along a spline curve tied to scroll progress:

```javascript
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2, 5),
  new THREE.Vector3(3, 3, 3),
  new THREE.Vector3(5, 2, 0),
  new THREE.Vector3(3, 1, -3),
  new THREE.Vector3(0, 2, -5),
]);

ScrollTrigger.create({
  trigger: '#scroll-container',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,
  onUpdate: (self) => {
    const point = curve.getPointAt(self.progress);
    camera.position.copy(point);
    camera.lookAt(0, 0, 0);
  },
});
```

### Model transforms

Rotate, scale, or move models as the user scrolls:

```javascript
// Rotate model 360° over the scroll range
gsap.to(model.rotation, {
  y: Math.PI * 2,
  scrollTrigger: {
    trigger: '#chapter-2',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
  },
});

// Scale up from 0 (reveal)
gsap.from(model.scale, {
  x: 0, y: 0, z: 0,
  scrollTrigger: {
    trigger: '#chapter-1',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  },
});
```

### Material/shader transitions

Animate material properties for visual transitions:

```javascript
// Fade model opacity
gsap.to(model.material, {
  opacity: 1,
  scrollTrigger: {
    trigger: '#reveal-section',
    start: 'top center',
    end: 'top top',
    scrub: true,
  },
});
// Requires: material.transparent = true; material.opacity = 0;
```

### Stage reveals

Show/hide scene elements at scroll breakpoints:

```javascript
ScrollTrigger.create({
  trigger: '#chapter-3',
  start: 'top center',
  onEnter: () => { secondModel.visible = true; },
  onLeaveBack: () => { secondModel.visible = false; },
});
```

## R3F + drei ScrollControls

For React projects, drei provides a simpler scroll integration:

```tsx
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';

function AnimatedModel() {
  const scroll = useScroll();
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const progress = scroll.offset; // 0 → 1
    ref.current.rotation.y = progress * Math.PI * 2;
    ref.current.position.y = Math.sin(progress * Math.PI) * 2;
  });

  return (
    <group ref={ref}>
      <Model url="/models/product.glb" />
    </group>
  );
}

export default function ScrollScene() {
  return (
    <Canvas>
      <ScrollControls pages={5} damping={0.25}>
        <AnimatedModel />
        <Scroll html>
          <div style={{ height: '100vh' }}>
            <h1>Chapter 1</h1>
          </div>
          <div style={{ height: '100vh' }}>
            <h2>Chapter 2</h2>
          </div>
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
}
```

## Progress indicators

Add visual feedback for scroll position:

- **Progress bar** — thin bar at the top of the viewport showing scroll percentage
- **Chapter markers** — dots or labels in a sidebar showing which section is active
- **Chapter titles** — fade in/out section titles as the user scrolls through them

## Mobile handling

Scroll-driven 3D is performance-intensive on mobile. Adapt:

- **Simplify animations** — reduce the number of animated properties. Prefer rotation-only over rotation + position + scale.
- **Reduce keyframes** — fewer scroll breakpoints, smoother interpolation.
- **Lower render quality** — `pixelRatio: 1` on mobile, reduce shadow map size or disable shadows.
- **Consider static fallback** — on very low-end devices (check `navigator.hardwareConcurrency < 4`), show a static image sequence instead of live 3D.
- **Touch scroll** — Lenis handles touch scrolling, but test on real devices. Avoid hijacking native scroll momentum.

## Performance tips

- Use `scrub` (not trigger-based animations) to avoid janky jumps
- Keep the total page scroll height reasonable (5-10x viewport height)
- Minimize draw calls — merge static geometry, use instancing for repeated objects
- Profile with Chrome DevTools Performance tab — aim for 60fps during scroll
- Dispose Three.js resources when the component unmounts

## After building the scroll scene

Suggest next steps:

- **`/3d-websites:landing-page`** — add traditional HTML sections before/after the scroll experience
- **`/3d-websites:generate`** — create additional models to reveal during the scroll
- **`/3d-websites:scene`** — compose the multi-model scene that the scroll drives through

See [reference.md](reference.md) for GSAP ScrollTrigger patterns, Lenis setup, and scroll-to-animation mapping formulas.
