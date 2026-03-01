---
description: Build a complete 3D landing page with hero section, copy, and CTAs. Use when the user wants a full web page featuring 3D content.
---

# 3d-websites landing-page

Build a full, deployable web page that combines 3D content with HTML/CSS layout — hero sections, feature blocks, CTAs, and responsive design.

## Gather requirements

Ask the user:

- **Page purpose** — product launch, portfolio piece, SaaS landing, personal brand?
- **3D content** — existing model (path?) or need to generate one? (`/3d-websites:generate`)
- **Framework** — plain HTML, Next.js, Astro, or auto-detect from project?
- **Sections needed** — hero, features, specs, testimonials, pricing, CTA?
- **Brand** (optional) — primary color, font, tone of voice?

## Page architecture patterns

Recommend one of these patterns based on the user's needs:

### Pattern A: 3D Hero + Scroll Sections

Full-viewport 3D hero at the top, traditional HTML sections below. The most common and safest pattern.

```
┌─────────────────────────┐
│                         │
│      3D Hero (100vh)    │
│    [model + headline]   │
│                         │
├─────────────────────────┤
│   Feature Section       │
├─────────────────────────┤
│   Details / Specs       │
├─────────────────────────┤
│   CTA / Footer          │
└─────────────────────────┘
```

Best for: product launches, SaaS landing pages, portfolio highlights.

### Pattern B: Scroll-Driven 3D Story

The model transforms throughout the page as the user scrolls. Use `/3d-websites:scroll-scene` for implementation.

```
┌─────────────────────────┐
│  3D canvas (position:   │
│  fixed, full viewport)  │
│                         │
│  Content overlays       │
│  scroll over the 3D     │
│  triggering transforms  │
└─────────────────────────┘
```

Best for: storytelling, product deep-dives, immersive experiences.

### Pattern C: Split Layout

3D viewer on one side, text/content on the other. Works well on desktop, stacks on mobile.

```
┌────────────┬────────────┐
│            │            │
│  3D Model  │  Content   │
│  (sticky)  │  (scrolls) │
│            │            │
└────────────┴────────────┘
```

Best for: product configurators, documentation, detailed product pages.

### Pattern D: 3D Card Grid

Multiple smaller viewers arranged in a grid. Each card is an independent viewer.

```
┌───────┬───────┬───────┐
│ Model │ Model │ Model │
│  + CTA│  + CTA│  + CTA│
├───────┼───────┼───────┤
│ Model │ Model │ Model │
│  + CTA│  + CTA│  + CTA│
└───────┴───────┴───────┘
```

Best for: product collections, portfolios, galleries.

## HTML/CSS structure

### Semantic markup

```html
<body>
  <header><!-- nav --></header>
  <main>
    <section class="hero" id="hero">
      <div class="hero-3d"><!-- Three.js canvas or model-viewer --></div>
      <div class="hero-content">
        <h1>Headline</h1>
        <p>Subheadline</p>
        <a href="#" class="cta">Call to Action</a>
      </div>
    </section>
    <section class="features" id="features">...</section>
    <section class="cta-section" id="cta">...</section>
  </main>
  <footer>...</footer>
</body>
```

### CSS custom properties for theming

```css
:root {
  --color-primary: #2563eb;
  --color-background: #0a0a0a;
  --color-surface: #141414;
  --color-text: #fafafa;
  --color-text-muted: #888;
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --space-section: clamp(4rem, 8vw, 8rem);
}
```

### Responsive breakpoints

```css
/* Mobile-first base styles */
/* Tablet */   @media (min-width: 768px) { ... }
/* Desktop */  @media (min-width: 1024px) { ... }
/* Wide */     @media (min-width: 1440px) { ... }
```

## 3D-HTML integration

### Hero overlay (Pattern A)

Layer HTML content over the 3D canvas:

```css
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-3d {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-3d canvas {
  width: 100% !important;
  height: 100% !important;
}

.hero-content {
  position: relative;
  z-index: 1;
  pointer-events: none; /* Let clicks pass through to 3D */
}

.hero-content a,
.hero-content button {
  pointer-events: auto; /* Re-enable clicks on interactive elements */
}
```

### Sticky 3D with scrolling content (Pattern B/C)

```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.split-3d {
  position: sticky;
  top: 0;
  height: 100vh;
}

@media (max-width: 767px) {
  .split-layout {
    grid-template-columns: 1fr;
  }
  .split-3d {
    position: relative;
    height: 50vh;
  }
}
```

## Loading strategy

Fast loading is critical — users abandon pages that take too long.

1. **Render HTML/CSS first** — all text content loads instantly, independent of 3D.
2. **Skeleton or blur placeholder** — show a blurred poster image or gradient where the 3D will appear.
3. **Async model loading** — load the GLB after the page is interactive. Show a progress indicator.
4. **IntersectionObserver for below-fold** — only load models in view (or about to be in view).

```javascript
// Lazy-load models when section enters viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadModel(entry.target.dataset.model);
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '200px' }
);

document.querySelectorAll('[data-model]').forEach((el) => observer.observe(el));
```

## Performance budget

| Metric | Target | Why |
|--------|--------|-----|
| First Contentful Paint (FCP) | < 1.5s | Text/UI visible fast |
| Largest Contentful Paint (LCP) | < 2.5s | Hero content (text + placeholder) loaded |
| Total GLB size (hero) | < 5MB | Keep initial load reasonable |
| Total GLB size (full page) | < 10MB | Budget for all models on the page |
| JavaScript (non-Three.js) | < 100KB gzipped | Keep page logic lean |

## SEO

- Put meaningful content in HTML, not inside the canvas. Search engines can't read 3D scenes.
- Use proper heading hierarchy: one `<h1>`, descriptive `<h2>`s for sections.
- Write descriptive `alt` text and `aria-label` for 3D containers.
- Add a `<noscript>` fallback with a static image and text description.
- Use semantic elements: `<section>`, `<article>`, `<nav>`, `<footer>`.
- Include meta description and Open Graph tags for social sharing.

## Accessibility

- `aria-hidden="true"` on decorative 3D canvases (the real content is in the HTML overlay).
- All text content must be in the HTML, not rendered on canvas.
- `prefers-reduced-motion`: disable auto-rotate and entrance animations. Optionally replace 3D with a static image.
- Sufficient color contrast (4.5:1 minimum) for text overlaid on 3D backgrounds.
- Keyboard-navigable: CTAs and links must be focusable and reachable via Tab.

## Framework-specific output

### Plain HTML
Single `index.html` with inline styles and importmap-based Three.js. Self-contained, zero build step.

### Next.js (App Router)
- `app/page.tsx` — server component with HTML sections
- `components/Hero3D.tsx` — client component (`"use client"`) wrapping the Canvas
- Dynamic import with `ssr: false` for the 3D component
- Images in `public/`, models in `public/models/`

### Astro
- `src/pages/index.astro` — Astro page with HTML sections
- `src/components/Hero3D.tsx` — React island with `client:visible` directive
- Models in `public/models/`

## After building the page

Suggest next steps:

- **`/3d-websites:scroll-scene`** — upgrade to scroll-driven 3D interactions
- **`/3d-websites:configurator`** — add product configuration to the page
- **`/3d-websites:generate`** — create additional models for feature sections

See [examples.md](examples.md) for complete page templates.
