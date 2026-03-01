---
description: Build a 3D product configurator with real-time color, material, and variant switching. Use when the user wants customers to customize a product visually in 3D.
---

# 3d-websites configurator

Build interactive product configurators where users change colors, materials, and parts in real-time. High-value e-commerce pattern — products with 3D configurators see significantly higher engagement and conversion.

## Gather requirements

Ask the user:

- **Product type** — what is being configured? (shoe, furniture, electronics, jewelry, etc.)
- **Configurable properties** — what can the user change? (color, material, finish, parts/components)
- **Number of variants** — how many options per property? (e.g., 6 colors, 3 materials)
- **Model setup** — do they have a GLB with named meshes, or need to generate one?
- **Framework** — React/Next.js or plain HTML?

## Model requirements

The configurator depends on the model having **named meshes or materials** that can be targeted individually.

### Ideal model structure

A GLB with clearly named parts:

```
shoe.glb
├── sole (mesh)
├── upper (mesh)
├── laces (mesh)
├── tongue (mesh)
└── logo (mesh)
```

Each mesh has its own material, so colors/textures can be swapped independently.

### If the model isn't set up for configuration

Options:
1. **Re-export from 3D tool** — separate the model into named parts in Blender and re-export
2. **Generate with UnrealizeX** — use `/3d-websites:generate-3d` to create a base model, then generate texture variants with `start_texturing` using different style prompts
3. **Material-only config** — even without named parts, you can swap the material on the entire model (color, roughness, metalness)

## Architecture

```
┌─────────────────────────────────────────────┐
│                                             │
│   ┌───────────────────┐  ┌──────────────┐  │
│   │                   │  │  Config UI    │  │
│   │   3D Canvas       │  │  ┌─────────┐ │  │
│   │                   │  │  │ Colors   │ │  │
│   │   [Product Model] │  │  ├─────────┤ │  │
│   │                   │  │  │ Material │ │  │
│   │                   │  │  ├─────────┤ │  │
│   │                   │  │  │ Parts    │ │  │
│   │                   │  │  └─────────┘ │  │
│   └───────────────────┘  └──────────────┘  │
│                                             │
│   [Price: $XX]              [Add to Cart]   │
└─────────────────────────────────────────────┘
```

Components:
- **3D Canvas** — viewer with orbit controls, showing the product
- **Config UI** — HTML panel with color swatches, material selectors, part toggles
- **State** — tracks current configuration (selected color per part, material, etc.)
- **Camera** — auto-focuses on the changed part with smooth transition

## Material swapping

### Color change

Clone the material (don't mutate the original) and update the color:

```javascript
function setPartColor(model, partName, hexColor) {
  model.traverse((child) => {
    if (child.isMesh && child.name === partName) {
      child.material = child.material.clone();
      child.material.color.set(hexColor);
    }
  });
}
```

### Material properties

For more realistic changes (matte vs glossy, leather vs fabric):

```javascript
function setPartMaterial(model, partName, materialProps) {
  model.traverse((child) => {
    if (child.isMesh && child.name === partName) {
      child.material = child.material.clone();
      Object.assign(child.material, {
        color: new THREE.Color(materialProps.color),
        roughness: materialProps.roughness,     // 0 = mirror, 1 = matte
        metalness: materialProps.metalness,     // 0 = non-metal, 1 = full metal
        clearcoat: materialProps.clearcoat ?? 0, // 0-1, adds a clear coat layer
      });
      child.material.needsUpdate = true;
    }
  });
}
```

### Material presets

Define preset material configurations:

```javascript
const materials = {
  'matte-white':    { color: '#ffffff', roughness: 0.9, metalness: 0.0 },
  'glossy-black':   { color: '#111111', roughness: 0.1, metalness: 0.0 },
  'brushed-steel':  { color: '#cccccc', roughness: 0.4, metalness: 1.0 },
  'rose-gold':      { color: '#b76e79', roughness: 0.3, metalness: 0.9 },
  'matte-leather':  { color: '#8B4513', roughness: 0.8, metalness: 0.0 },
  'patent-leather': { color: '#1a1a1a', roughness: 0.05, metalness: 0.0, clearcoat: 1.0 },
};
```

## Multi-part configuration

Traverse the GLTF scene graph and target meshes by name:

```javascript
function getConfigurableParts(model) {
  const parts = [];
  model.traverse((child) => {
    if (child.isMesh && child.name) {
      parts.push({
        name: child.name,
        currentColor: '#' + child.material.color.getHexString(),
        currentRoughness: child.material.roughness,
        currentMetalness: child.material.metalness,
      });
    }
  });
  return parts;
}
```

## Generate texture variants with UnrealizeX

For more dramatic variant differences (full texture changes, not just color), use UnrealizeX:

1. Generate the base model with `/3d-websites:generate-3d`
2. After the base texture is done, call `start_texturing` again with different style prompts:
   - "ocean blue colorway with white stitching"
   - "all-black stealth edition"
   - "natural tan leather with brass accents"
3. Each texturing run produces a different GLB with baked textures
4. In the configurator, swap between these GLB files for full-texture variants

## Config UI

Build the UI as an HTML overlay panel positioned alongside the 3D canvas.

### Color swatches

```html
<div class="config-section">
  <label>Color</label>
  <div class="swatches" data-part="upper">
    <button class="swatch" data-color="#ffffff" style="background: #ffffff;" aria-label="White"></button>
    <button class="swatch" data-color="#111111" style="background: #111111;" aria-label="Black"></button>
    <button class="swatch" data-color="#2563eb" style="background: #2563eb;" aria-label="Blue"></button>
    <button class="swatch" data-color="#dc2626" style="background: #dc2626;" aria-label="Red"></button>
  </div>
</div>
```

### Material selector

```html
<div class="config-section">
  <label>Material</label>
  <div class="material-options" data-part="upper">
    <button class="material-btn" data-material="matte-leather">Matte Leather</button>
    <button class="material-btn" data-material="patent-leather">Patent Leather</button>
    <button class="material-btn" data-material="brushed-steel">Brushed Steel</button>
  </div>
</div>
```

### CSS for config panel

```css
.config-panel {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 220px;
}

.config-section { margin-bottom: 1.25rem; }
.config-section label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #999; margin-bottom: 0.5rem; }

.swatches { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.swatch {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}
.swatch:hover { transform: scale(1.1); }
.swatch.active { border-color: #fff; }
```

## State management

### Vanilla JS — simple object

```javascript
const config = {
  upper: { color: '#ffffff', material: 'matte-leather' },
  sole: { color: '#111111', material: 'glossy-black' },
  laces: { color: '#ffffff', material: 'matte-leather' },
};

function updateConfig(part, property, value) {
  config[part][property] = value;
  applyConfig(model, config);
  updateURL(config);
}
```

### React — zustand store

```typescript
import { create } from 'zustand';

interface ConfigState {
  parts: Record<string, { color: string; material: string }>;
  setPart: (name: string, color: string, material: string) => void;
}

const useConfigStore = create<ConfigState>((set) => ({
  parts: {
    upper: { color: '#ffffff', material: 'matte-leather' },
    sole: { color: '#111111', material: 'glossy-black' },
  },
  setPart: (name, color, material) =>
    set((state) => ({
      parts: { ...state.parts, [name]: { color, material } },
    })),
}));
```

### URL params for shareable configs

Encode the config in URL search params so users can share their customization:

```javascript
function updateURL(config) {
  const params = new URLSearchParams();
  for (const [part, props] of Object.entries(config)) {
    params.set(part, `${props.color},${props.material}`);
  }
  history.replaceState(null, '', '?' + params.toString());
}

function loadFromURL() {
  const params = new URLSearchParams(location.search);
  const config = {};
  for (const [part, value] of params) {
    const [color, material] = value.split(',');
    config[part] = { color, material };
  }
  return config;
}
```

## Camera behavior

When the user changes a part, smoothly animate the camera to focus on that area:

```javascript
const partFocusPoints = {
  upper: { position: [2, 1.5, 2], target: [0, 0.8, 0] },
  sole:  { position: [2, 0.3, 2], target: [0, 0.1, 0] },
  laces: { position: [1, 1.5, 1.5], target: [0, 1.0, 0] },
};

function focusOnPart(partName) {
  const focus = partFocusPoints[partName];
  if (!focus) return;

  gsap.to(camera.position, {
    x: focus.position[0],
    y: focus.position[1],
    z: focus.position[2],
    duration: 0.8,
    ease: 'power2.inOut',
  });
  gsap.to(controls.target, {
    x: focus.target[0],
    y: focus.target[1],
    z: focus.target[2],
    duration: 0.8,
    ease: 'power2.inOut',
  });
}
```

## Price/SKU mapping

Connect visual configuration to product data:

```javascript
const pricing = {
  'matte-leather': { priceModifier: 0 },
  'patent-leather': { priceModifier: 15 },
  'brushed-steel': { priceModifier: 25 },
};

function calculatePrice(config, basePrice = 120) {
  let total = basePrice;
  for (const props of Object.values(config)) {
    const modifier = pricing[props.material]?.priceModifier ?? 0;
    total += modifier;
  }
  return total;
}
```

## Export / share

- **Screenshot**: capture the current configuration with `renderer.domElement.toDataURL('image/png')`
- **Share link**: encode config in URL params (see above)
- **Add to cart**: pass config object to your e-commerce API

## Performance tips

- Clone materials sparingly — only when a property actually changes
- Reuse cloned materials for repeated color selections (cache by color hex)
- Keep the total material count reasonable — dispose old clones when no longer used
- Texture-variant GLBs should be under 3MB each
- Preload variant GLBs that the user is likely to try (e.g., popular colors)

## After building the configurator

Suggest next steps:

- **`/3d-websites:landing-page`** — wrap the configurator in a product page with specs and CTAs
- **`/3d-websites:generate-3d`** — create texture variants via UnrealizeX for full-texture swaps

See [examples.md](examples.md) for a complete configurator example.
