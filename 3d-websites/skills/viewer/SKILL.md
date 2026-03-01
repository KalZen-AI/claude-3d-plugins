---
description: Create an interactive 3D model viewer for the web. Use when the user wants to display a single GLB model with orbit controls, lighting, and responsive sizing.
---

# 3d-websites viewer

Build a drop-in 3D model viewer — the simplest way to put an interactive 3D model on a web page.

## Gather requirements

Ask the user:

- **GLB file path** — where is the model? (e.g., `public/models/product.glb`)
- **Integration target** — standalone HTML page, React/Next.js component, or simple embed?
- **Interaction mode** — orbit (rotate/zoom/pan), turntable (auto-rotate), or static (fixed view)?
- **Background** — transparent, solid color, gradient, or environment map?

## Framework detection

If the user doesn't specify, auto-detect:

| Check | Framework | Path |
|-------|-----------|------|
| `next.config.*` exists | Next.js | React Three Fiber component |
| `react` in package.json deps | React app | React Three Fiber component |
| `astro.config.*` exists | Astro | `<model-viewer>` or standalone script |
| `index.html` in root only | Plain HTML | Vanilla Three.js or `<model-viewer>` |

For the simplest possible integration, recommend `<model-viewer>`. For custom control, use Three.js or R3F.

## Choose a path

### Path A: `<model-viewer>` (simplest)

Best for: quick embeds, product pages, no-JS-required contexts, AR-ready previews.

Use Google's `<model-viewer>` web component. Zero JavaScript setup required.

Key features to include:
- `src` — path to GLB
- `alt` — accessible description
- `camera-controls` — enable orbit interaction
- `auto-rotate` — slow turntable when idle
- `ar` — enable AR on supported devices
- `shadow-intensity` — ground shadow
- `environment-image` — lighting environment
- `loading="lazy"` — defer load until near viewport
- `poster` — static image placeholder while loading

Style the element to fill its container with `width: 100%; height: 100%;`.

### Path B: Vanilla Three.js (custom control)

Best for: standalone HTML pages, custom interactions, learning Three.js.

**Import strategy** — use an importmap for CDN delivery (no build step):

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/"
  }
}
</script>
```

Or use npm packages if the project has a bundler.

**Setup checklist:**

1. **Renderer** — `WebGLRenderer` with `antialias: true`, `alpha: true` (for transparent bg), `toneMapping: ACESFilmicToneMapping`, `outputColorSpace: SRGBColorSpace`
2. **Camera** — `PerspectiveCamera(45, aspect, 0.1, 100)`. After loading the model, auto-fit by computing the bounding box and positioning the camera at 2.5x the bounding sphere radius.
3. **Loader** — `GLTFLoader`. Add `DRACOLoader` pointing to the Draco decoder path for compressed models.
4. **Controls** — `OrbitControls` with `enableDamping: true`, `dampingFactor: 0.05`. Optionally `autoRotate: true`, `autoRotateSpeed: 1.0`.
5. **Lighting** — use a three-point rig (see Lighting presets below).
6. **Resize** — attach a `ResizeObserver` to the container to update camera aspect and renderer size.
7. **Animation loop** — `renderer.setAnimationFrame(animate)` updating controls and rendering each frame.
8. **Cleanup** — dispose renderer, geometry, materials, and textures on teardown.

### Path C: React Three Fiber (React/Next.js)

Best for: React apps, Next.js sites, component-based architectures.

**Dependencies**: `@react-three/fiber`, `@react-three/drei`

**Component structure:**

```
<Canvas>
  <Suspense fallback={null}>
    <Model url="/models/product.glb" />
    <OrbitControls />
    <Environment preset="studio" />
  </Suspense>
</Canvas>
```

Key elements:
- `useGLTF` hook from drei to load the model
- `OrbitControls` from drei for interaction
- `Environment` from drei for image-based lighting (presets: studio, sunset, dawn, night, warehouse, city, park, forest)
- `Suspense` wrapper for async loading
- `Center` from drei to auto-center the model in the scene
- `useGLTF.preload('/models/product.glb')` at module level for eager loading

For Next.js: wrap the Canvas in a client component (`"use client"`) and dynamically import it with `ssr: false` since Three.js needs the DOM.

## Lighting presets

Apply one of these presets based on the model's intended look:

### Studio (default — balanced product lighting)
- Key light: `DirectionalLight`, intensity 1.5, position (5, 5, 5), cast shadow
- Fill light: `DirectionalLight`, intensity 0.5, position (-3, 3, -3)
- Rim light: `DirectionalLight`, intensity 0.8, position (0, 3, -5)
- Ambient: `AmbientLight`, intensity 0.3

### Natural (outdoor/organic feel)
- `HemisphereLight`, sky #87CEEB, ground #8B7355, intensity 1.0
- Sun: `DirectionalLight`, intensity 1.2, position (5, 10, 5), cast shadow

### Minimal (clean/modern)
- Ambient: `AmbientLight`, intensity 0.6
- Key: `DirectionalLight`, intensity 1.0, position (3, 5, 3)

## Accessibility

- Add `aria-label` to the canvas container describing the 3D content
- Support keyboard controls: arrow keys for rotation, +/- for zoom
- Respect `prefers-reduced-motion`: disable auto-rotate and reduce animation speed
- Provide a static fallback image in a `<noscript>` tag

## Performance tips

- Keep GLB files under 3MB for hero viewers, under 1MB for embedded viewers
- Use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to cap resolution on high-DPI screens
- Enable `powerPreference: 'high-performance'` on the renderer for dedicated GPU
- Lazy-load the viewer with `IntersectionObserver` if below the fold
- Add a loading indicator (progress bar or spinner) while the model loads

## After creating the viewer

Suggest next steps based on what the user might need:

- **`/3d-websites:landing-page`** — wrap the viewer in a full page with copy and CTAs
- **`/3d-websites:3d-scene`** — if they want to show multiple models together
- **`/3d-websites:scroll-scene`** — if they want scroll-driven camera movement
- **`/3d-websites:configurator`** — if the model should have swappable colors/materials

See [examples.md](examples.md) for complete, ready-to-use code for each path.
