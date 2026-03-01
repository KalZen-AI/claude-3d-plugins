# Landing Page — Examples

Two complete page templates for reference. Adapt to the user's brand and framework.

## Example 1: 3D Hero + Sections (Pattern A)

A full landing page with a 3D hero, feature grid, and CTA. Plain HTML with importmap Three.js.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Name — Tagline</title>
  <meta name="description" content="One-sentence product description for search engines.">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --color-primary: #2563eb;
      --color-primary-hover: #1d4ed8;
      --color-bg: #0a0a0a;
      --color-surface: #141414;
      --color-text: #fafafa;
      --color-text-muted: #888;
      --font: 'Inter', system-ui, -apple-system, sans-serif;
      --space-section: clamp(4rem, 8vw, 8rem);
      --max-width: 1200px;
    }

    body {
      font-family: var(--font);
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* — Nav — */
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(10, 10, 10, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    nav .logo {
      font-weight: 700;
      font-size: 1.125rem;
      color: var(--color-text);
      text-decoration: none;
    }

    nav .nav-cta {
      padding: 0.5rem 1.25rem;
      background: var(--color-primary);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s;
    }
    nav .nav-cta:hover { background: var(--color-primary-hover); }

    /* — Hero — */
    .hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      text-align: center;
      padding: 2rem;
      pointer-events: none;
      max-width: 700px;
    }

    .hero-content h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }

    .hero-content p {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: var(--color-text-muted);
      margin-bottom: 2rem;
    }

    .hero-content .cta {
      pointer-events: auto;
      display: inline-block;
      padding: 0.875rem 2rem;
      background: var(--color-primary);
      color: #fff;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s, transform 0.15s;
    }
    .hero-content .cta:hover {
      background: var(--color-primary-hover);
      transform: translateY(-1px);
    }

    /* — Features — */
    .features {
      padding: var(--space-section) 2rem;
    }

    .features-inner {
      max-width: var(--max-width);
      margin: 0 auto;
    }

    .features h2 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: var(--color-surface);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 2rem;
    }

    .feature-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: var(--color-text-muted);
      font-size: 0.9375rem;
    }

    /* — CTA Section — */
    .cta-section {
      padding: var(--space-section) 2rem;
      text-align: center;
    }

    .cta-section h2 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-section p {
      color: var(--color-text-muted);
      margin-bottom: 2rem;
      font-size: 1.125rem;
    }

    .cta-section .cta {
      display: inline-block;
      padding: 0.875rem 2.5rem;
      background: var(--color-primary);
      color: #fff;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s;
    }
    .cta-section .cta:hover { background: var(--color-primary-hover); }

    /* — Footer — */
    footer {
      padding: 2rem;
      text-align: center;
      color: var(--color-text-muted);
      font-size: 0.8125rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* — Reduced motion — */
    @media (prefers-reduced-motion: reduce) {
      .hero-3d { display: none; }
      .hero { background: var(--color-surface); }
    }
  </style>
</head>
<body>

<nav>
  <a href="#" class="logo">ProductName</a>
  <a href="#cta" class="nav-cta">Get Started</a>
</nav>

<main>
  <section class="hero" id="hero">
    <div class="hero-3d" id="hero-3d" aria-hidden="true"></div>
    <div class="hero-content">
      <h1>Your Product Headline</h1>
      <p>A concise description of what makes your product special.</p>
      <a href="#cta" class="cta">Get Started</a>
    </div>
  </section>

  <section class="features" id="features">
    <div class="features-inner">
      <h2>Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>Feature One</h3>
          <p>Brief description of this feature and why it matters to your users.</p>
        </div>
        <div class="feature-card">
          <h3>Feature Two</h3>
          <p>Brief description of this feature and why it matters to your users.</p>
        </div>
        <div class="feature-card">
          <h3>Feature Three</h3>
          <p>Brief description of this feature and why it matters to your users.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section" id="cta">
    <h2>Ready to get started?</h2>
    <p>Start building with your 3D product today.</p>
    <a href="#" class="cta">Sign Up Free</a>
  </section>
</main>

<footer>
  <p>&copy; 2026 ProductName. All rights reserved.</p>
</footer>

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/"
  }
}
</script>
<script type="module">
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  const container = document.getElementById('hero-3d');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45, container.clientWidth / container.clientHeight, 0.1, 100
  );
  camera.position.set(0, 1, 4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false; // Prevent accidental zoom on landing page
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    controls.autoRotate = false;
  }

  // Lighting — studio preset
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(5, 5, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(-3, 3, -3);
  scene.add(fill);

  // Load model
  const loader = new GLTFLoader();
  loader.load('models/product.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Auto-fit
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
  });

  // Resize
  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);

  // Animate
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
</script>

<noscript>
  <style>.hero-3d { display: none; } .hero { background: #141414; }</style>
</noscript>

</body>
</html>
```

## Example 2: Split Layout (Pattern C)

3D model on the left (sticky), scrollable content on the right. Works in any framework — shown as plain HTML.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Deep Dive</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --color-bg: #0a0a0a;
      --color-surface: #141414;
      --color-text: #fafafa;
      --color-text-muted: #888;
      --color-primary: #2563eb;
      --font: 'Inter', system-ui, sans-serif;
    }

    body {
      font-family: var(--font);
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
    }

    .split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
    }

    .split-3d {
      position: sticky;
      top: 0;
      height: 100vh;
      background: var(--color-surface);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    .split-3d canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .split-content {
      padding: 6rem 3rem;
    }

    .split-content h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
    }

    .split-content .subtitle {
      font-size: 1.125rem;
      color: var(--color-text-muted);
      margin-bottom: 3rem;
    }

    .detail-block {
      margin-bottom: 3rem;
      padding-bottom: 3rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .detail-block:last-child { border-bottom: none; }

    .detail-block h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .detail-block p {
      color: var(--color-text-muted);
      font-size: 0.9375rem;
    }

    .specs-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .specs-table td {
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.9375rem;
    }

    .specs-table td:first-child {
      color: var(--color-text-muted);
      width: 40%;
    }

    .cta-button {
      display: inline-block;
      padding: 0.875rem 2rem;
      background: var(--color-primary);
      color: #fff;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s;
    }
    .cta-button:hover { background: #1d4ed8; }

    /* Mobile: stack vertically */
    @media (max-width: 767px) {
      .split { grid-template-columns: 1fr; }
      .split-3d {
        position: relative;
        height: 50vh;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .split-content { padding: 3rem 1.5rem; }
      .split-content h1 { font-size: 1.75rem; }
    }
  </style>
</head>
<body>

<div class="split">
  <div class="split-3d" id="viewer-3d" aria-hidden="true"></div>
  <div class="split-content">
    <h1>Product Name</h1>
    <p class="subtitle">A short tagline that captures the product's value.</p>

    <div class="detail-block">
      <h2>Design</h2>
      <p>Description of the product's design philosophy and what makes it unique. This is real HTML content that search engines can index.</p>
    </div>

    <div class="detail-block">
      <h2>Materials</h2>
      <p>Details about materials, construction, and quality. Users can rotate the 3D model on the left to see every angle while reading.</p>
    </div>

    <div class="detail-block">
      <h2>Specifications</h2>
      <table class="specs-table">
        <tr><td>Dimensions</td><td>120 x 80 x 45 mm</td></tr>
        <tr><td>Weight</td><td>340g</td></tr>
        <tr><td>Material</td><td>Anodized aluminum</td></tr>
        <tr><td>Finish</td><td>Matte ceramic coat</td></tr>
      </table>
    </div>

    <div class="detail-block">
      <a href="#" class="cta-button">Order Now</a>
    </div>
  </div>
</div>

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/"
  }
}
</script>
<script type="module">
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  const container = document.getElementById('viewer-3d');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x141414);

  const camera = new THREE.PerspectiveCamera(
    45, container.clientWidth / container.clientHeight, 0.1, 100
  );
  camera.position.set(0, 0.8, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enableZoom = true;
  controls.minDistance = 1.5;
  controls.maxDistance = 6;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    controls.autoRotate = false;
  }

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(4, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-3, 2, -2);
  scene.add(fill);

  // Load
  new GLTFLoader().load('models/product.glb', (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);
  });

  // Resize
  new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }).observe(container);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
</script>

</body>
</html>
```
