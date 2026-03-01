# Landing Page — Examples

Two complete page templates. Read the relevant script file and adapt to the user's brand and framework.

## Example 1: 3D Hero + Sections (Pattern A)

**File:** [scripts/hero-landing-page.html](scripts/hero-landing-page.html)

A full landing page with a 3D hero, feature grid, and CTA. Plain HTML with importmap Three.js. Includes:
- Fixed nav with backdrop blur and CTA button
- Full-viewport 3D hero section with HTML overlay (pointer-events management)
- Feature card grid with auto-fit responsive columns
- CTA section with centered layout
- Footer with border separator
- CSS custom properties for theming (colors, fonts, spacing)
- Responsive fluid typography with `clamp()`
- Three.js setup: WebGLRenderer, OrbitControls (zoom disabled for landing page), studio lighting, auto-fit model centering
- ResizeObserver for responsive canvas
- `prefers-reduced-motion`: hides 3D, shows surface background
- `<noscript>` fallback

**To adapt:** Replace brand colors in `:root`, headline copy, feature cards, model path, and CTA links.

## Example 2: Split Layout (Pattern C)

**File:** [scripts/split-layout-page.html](scripts/split-layout-page.html)

3D model on the left (sticky), scrollable content on the right. Includes:
- CSS Grid split layout (`1fr 1fr`)
- Sticky 3D viewer (`position: sticky; top: 0; height: 100vh`)
- Content sections with heading, description, specs table, and CTA
- Specs table with muted label column
- Mobile responsive: stacks vertically, 3D becomes relative at 50vh
- Three.js setup: OrbitControls with zoom limits (`minDistance`, `maxDistance`), auto-rotate, studio lighting
- `prefers-reduced-motion` support

**To adapt:** Replace product details, specs table rows, model path, and brand colors. Works well for product detail pages, documentation, and detailed showcases.
