# Scroll Scene — Reference

GSAP ScrollTrigger patterns, Lenis setup, and scroll-to-animation mapping.

## Complete working example

**File:** [scripts/scroll-scene.html](scripts/scroll-scene.html)

A full standalone scroll-driven 3D scene with Three.js + GSAP ScrollTrigger + Lenis. Three chapters: gentle rotation → zoom in → pull back. Includes:
- Fixed Three.js canvas with scrollable HTML content overlay
- Lenis smooth scrolling connected to GSAP ScrollTrigger
- Per-chapter scroll animations (model rotation, camera zoom, camera pull-back)
- Glass-morphism chapter text cards with backdrop blur
- CDN-loaded GSAP/ScrollTrigger/Lenis + importmap Three.js

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
```

**npm:**
```bash
npm install gsap lenis
```
