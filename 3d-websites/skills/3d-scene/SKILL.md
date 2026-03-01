---
description: Compose multiple 3D models into an interactive scene with lighting, camera systems, and interaction. Use when the user wants to display several models together.
---

# 3D Scene

Compose multiple models into a unified 3D scene with environment, lighting, camera systems, and user interaction.

## Gather requirements

Ask the user:

- **Models** — list of GLB files to include (paths or names)
- **Scene type** — showcase (products on pedestals), hero (single dramatic composition), gallery (browsable collection), explorer (free-roam environment)
- **Environment** — studio backdrop, skybox, solid color, or transparent
- **Interactions** — click-to-focus, hover highlights, annotations, none
- **Animations** — auto-rotate scene, model entrance animations, camera tour

## Scene graph architecture

Structure the scene using a `THREE.Group` hierarchy:

```
Scene
├── EnvironmentGroup (skybox, ground plane, fog)
├── LightingGroup (all lights)
├── ModelsGroup
│   ├── Model_A (THREE.Group — position, rotation, scale)
│   ├── Model_B
│   └── Model_C
├── AnnotationsGroup (HTML overlays, sprites)
└── CameraRig (for animated camera paths)
```

**Coordinate conventions**: Y-up, right-handed. Place the ground plane at Y=0.

**Bounding box normalization**: After loading each model, compute its bounding box and normalize scale so all models are proportional. A common approach: scale each model so its longest dimension equals 1 unit, then position them in the layout.

## Layout systems

### Grid layout
Place models in an evenly-spaced grid. Compute positions from row/column indices:

```
x = (col - (cols - 1) / 2) * spacing
z = (row - (rows - 1) / 2) * spacing
```

### Circular layout
Arrange models in a circle. Compute positions from angle:

```
angle = (index / count) * Math.PI * 2
x = radius * Math.cos(angle)
z = radius * Math.sin(angle)
```

Each model faces the center: `model.lookAt(0, 0, 0)`.

### Shelf / pedestal layout
Place models on raised platforms. Create a simple pedestal geometry (cylinder or box) beneath each model. Useful for product showcases.

### Linear / conveyor layout
Models in a line along the X or Z axis with even spacing. Good for comparison views.

See [reference.md](reference.md) for exact formulas and preset values.

## Lighting

Choose a lighting preset and add it to the `LightingGroup`. Each preset includes exact values in [reference.md](reference.md).

| Preset | Feel | Best for |
|--------|------|----------|
| Studio | Balanced, professional | Product showcases, galleries |
| Dramatic | High-contrast, moody | Hero scenes, portfolio pieces |
| Natural | Soft, organic | Environment scenes, architecture |
| Minimal | Clean, modern | Tech products, minimalist design |

For image-based lighting (IBL), use `PMREMGenerator` with an HDRI environment map. This provides the most realistic reflections and ambient lighting. In R3F, use drei's `<Environment>` component.

## Camera systems

### Static orbit
Default. `OrbitControls` centered on the scene. Good for showcases.

- Set `minDistance` and `maxDistance` to prevent zooming too close or too far
- Set `minPolarAngle` and `maxPolarAngle` to limit vertical rotation
- Use `controls.target` to orbit around a specific model

### Click-to-focus
When the user clicks a model, smoothly animate the camera to frame that model.

1. Raycast from mouse position to detect clicked model
2. Compute the target camera position: bounding sphere center + offset
3. Animate camera position and controls target using `gsap.to()` or manual lerp

### Auto-tour
Automatically cycle through models with smooth camera transitions.

1. Build a list of camera positions (one per model, framing each)
2. On a timer or user trigger, animate between positions
3. Pause the tour when the user interacts with controls, resume after idle

### Scroll-driven
Map scroll progress to camera position along a path. See `/3d-websites:scroll-scene` for full implementation.

## Interaction

### Raycasting for hover and click

```javascript
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

canvas.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  pointer.y = -(e.clientY / canvas.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(modelsGroup.children, true);
  // Handle hover state
});
```

### Annotations
Position HTML labels relative to 3D points using `Vector3.project()`:

```javascript
const screenPos = worldPosition.clone().project(camera);
label.style.left = ((screenPos.x + 1) / 2) * canvas.clientWidth + 'px';
label.style.top = ((-screenPos.y + 1) / 2) * canvas.clientHeight + 'px';
```

### Selection highlighting
On click, apply an outline or emissive boost to the selected model. Reset the previous selection.

## Post-processing (optional)

Use sparingly — each pass costs performance:

- **Bloom** — `UnrealBloomPass` for glowing edges or emissive materials. Keep `strength` low (0.3-0.5).
- **Outline** — `OutlinePass` for selected object highlighting.
- **SMAA** — `SMAAPass` for anti-aliasing without MSAA overhead.

Requires `EffectComposer` from Three.js post-processing addons. In R3F, use `@react-three/postprocessing`.

## Performance rules

- **Total GLB budget**: keep all models under 10MB combined
- **LOD (Level of Detail)**: for distant models, use simpler versions. Three.js `LOD` object switches automatically.
- **InstancedMesh**: if the scene has repeated objects (e.g., 50 trees), use `THREE.InstancedMesh` instead of 50 separate meshes.
- **Frustum culling**: enabled by default in Three.js — objects outside the camera view are not rendered.
- **Lazy loading**: for large scenes, load models nearest to the camera first. Use `IntersectionObserver` on the container to defer loading until the scene is visible.
- **Shadow maps**: limit to 1-2 shadow-casting lights. Use `shadowMap.type = THREE.PCFSoftShadowMap` for quality. Keep shadow map size at 1024x1024 for web.
- **Dispose unused**: when removing models from the scene, call `geometry.dispose()` and `material.dispose()` to free GPU memory.

## After building the scene

Suggest next steps:

- **`/3d-websites:landing-page`** — wrap the scene in a full page with copy and navigation
- **`/3d-websites:scroll-scene`** — add scroll-driven camera movement through the scene
- **`/3d-websites:generate-3d`** — create additional models to add to the scene
