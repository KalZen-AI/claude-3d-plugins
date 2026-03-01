# Configurator — Example

## Product configurator (sneaker with color + material options)

**File:** [scripts/product-configurator.html](scripts/product-configurator.html)

A complete standalone product configurator. Sneaker with configurable upper, sole, and laces — color swatches and material presets.

### What it includes

- **3D canvas** — full-viewport Three.js scene with studio lighting and orbit controls
- **Config panel** — glass-morphism sidebar with part tabs, color swatches, and material buttons
- **Price bar** — bottom bar with dynamic price, "Add to Cart" button, and share link
- **Material presets** — matte (roughness 0.85), glossy (clearcoat 0.8), metallic (metalness 0.95), each with a price modifier
- **State management** — plain JS config object tracking color + material per part
- **URL state** — config encoded in URL search params for shareable configurations
- **Responsive** — panel and price bar reposition on mobile (<640px)

### Model requirements

The GLB file (`shoe.glb`) must have named meshes. The script matches part names by checking if the mesh name (lowercased) includes the config key:
- Meshes with "upper" in the name → configured by the Upper tab
- Meshes with "sole" in the name → configured by the Sole tab
- Meshes with "laces" in the name → configured by the Laces tab

### State flow

1. User clicks a part tab → `activePart` changes
2. User clicks a color swatch or material button → `config[activePart]` updates
3. `applyConfig()` traverses the model, clones materials, and applies new color/roughness/metalness
4. URL is updated with the new config for shareability
5. Price recalculates based on material price modifiers

### Adapting to your product

- Replace part tabs with your product's configurable parts
- Update color swatches with your available colors
- Add/modify material presets with your materials and price modifiers
- Update mesh name matching in `applyConfig()` to target your model's mesh names
- Change `BASE_PRICE` and price modifier values
