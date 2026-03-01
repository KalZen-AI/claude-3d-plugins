# Viewer — Code Examples

Three complete implementations. Read the relevant script file and adapt it to the user's project.

## Example 1: Standalone HTML with vanilla Three.js

**File:** [scripts/standalone-viewer.html](scripts/standalone-viewer.html)

A single HTML file with no build step. Uses importmap for Three.js from CDN. Includes:
- WebGLRenderer with ACES tone mapping and SRGB color space
- PerspectiveCamera with auto-fit to model bounding box
- GLTFLoader + DRACOLoader for compressed models
- OrbitControls with damping and auto-rotate
- Three-point studio lighting rig (key, fill, rim + ambient)
- ResizeObserver for responsive container sizing
- Loading indicator with progress percentage
- `prefers-reduced-motion` support
- `<noscript>` fallback

**To adapt:** Change the model path (`models/product.glb`), lighting preset, and background.

## Example 2: React Three Fiber component

**File:** [scripts/ModelViewer.tsx](scripts/ModelViewer.tsx)

A reusable React component with TypeScript props. Requires `@react-three/fiber` and `@react-three/drei`. Includes:
- `useGLTF` hook for model loading with `Center` auto-centering
- `OrbitControls` with auto-rotate and damping
- `Environment` preset for image-based lighting
- `Suspense` + `useProgress` loading indicator
- `'use client'` directive for Next.js app router
- `prefers-reduced-motion` support
- Usage example and Next.js dynamic import pattern in comments

**Props:** `modelUrl`, `autoRotate`, `environment` (preset name), `background`, `className`

## Example 3: `<model-viewer>` embed

**File:** [scripts/model-viewer-embed.html](scripts/model-viewer-embed.html)

The simplest integration — Google's `<model-viewer>` web component. Zero JavaScript to write. Includes:
- `camera-controls` for orbit interaction
- `auto-rotate` with configurable delay and speed
- `shadow-intensity` for ground shadow
- `environment-image` for lighting
- `loading="lazy"` for deferred loading
- `poster` for static image placeholder
- AR button slot for mobile AR preview
- Responsive sizing with min/max height
- `prefers-reduced-motion` media query

**Advantages:** Zero JS, built-in AR, accessible by default, works in any framework.

**Limitations:** Less customizable than Three.js — no programmatic scene composition or advanced post-processing.
