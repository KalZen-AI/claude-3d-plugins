# Scene — Reference

Lighting preset values, camera path math, and layout formulas.

## Lighting presets

### Studio

```javascript
// Key light — main illumination from upper-right
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);

// Fill light — soften shadows from upper-left
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-3, 3, -3);

// Rim light — edge separation from behind
const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(0, 3, -5);

// Ambient — base illumination
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
```

### Dramatic

```javascript
// Strong key from one side
const keyLight = new THREE.SpotLight(0xffeedd, 2.5, 20, Math.PI / 6, 0.5);
keyLight.position.set(5, 8, 2);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);

// Very dim fill — keep shadows deep
const fillLight = new THREE.DirectionalLight(0x4466aa, 0.2);
fillLight.position.set(-5, 2, -3);

// Minimal ambient
const ambient = new THREE.AmbientLight(0x111122, 0.15);
```

### Natural

```javascript
// Hemisphere — sky-ground gradient
const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B7355, 1.0);

// Sun — warm directional
const sunLight = new THREE.DirectionalLight(0xFFF4E6, 1.2);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;
```

### Minimal

```javascript
// Clean, even lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.6);

// Single key light
const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(3, 5, 3);
```

## Layout formulas

### Grid

```javascript
function gridLayout(count, spacing = 2) {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const positions = [];

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      x: (col - (cols - 1) / 2) * spacing,
      y: 0,
      z: (row - (rows - 1) / 2) * spacing,
    });
  }

  return positions;
}
```

### Circular

```javascript
function circularLayout(count, radius = 3) {
  const positions = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    positions.push({
      x: radius * Math.cos(angle),
      y: 0,
      z: radius * Math.sin(angle),
      rotationY: angle + Math.PI, // face center
    });
  }

  return positions;
}
```

### Linear

```javascript
function linearLayout(count, spacing = 2.5) {
  const positions = [];
  const offset = ((count - 1) * spacing) / 2;

  for (let i = 0; i < count; i++) {
    positions.push({
      x: i * spacing - offset,
      y: 0,
      z: 0,
    });
  }

  return positions;
}
```

### Shelf / pedestal

```javascript
function shelfLayout(count, spacing = 2.5, pedestalHeight = 0.5) {
  const base = linearLayout(count, spacing);

  return base.map((pos) => ({
    ...pos,
    y: pedestalHeight,
    pedestal: {
      width: 1,
      height: pedestalHeight,
      depth: 1,
      y: pedestalHeight / 2,
    },
  }));
}
```

## Camera path math

### CatmullRomCurve3 for smooth paths

```javascript
const points = [
  new THREE.Vector3(0, 2, 5),   // start: front view
  new THREE.Vector3(4, 3, 3),   // upper-right
  new THREE.Vector3(5, 2, 0),   // right side
  new THREE.Vector3(3, 1.5, -4), // behind-right
  new THREE.Vector3(0, 2, -5),  // behind
  new THREE.Vector3(-4, 3, -2), // behind-left
  new THREE.Vector3(-5, 2, 0),  // left side
  new THREE.Vector3(-3, 1.5, 3), // front-left
];

const curve = new THREE.CatmullRomCurve3(points, true); // true = closed loop

// Get position at progress (0–1)
function getCameraPosition(progress) {
  return curve.getPointAt(progress);
}
```

### Click-to-focus animation

```javascript
function focusOnModel(model, camera, controls, duration = 1.0) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const offset = size * 2;

  // Camera position: step back from center
  const direction = new THREE.Vector3()
    .subVectors(camera.position, center)
    .normalize();
  const targetPos = center.clone().add(direction.multiplyScalar(offset));

  // Animate with GSAP (or manual lerp)
  gsap.to(camera.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration,
    ease: 'power2.inOut',
  });
  gsap.to(controls.target, {
    x: center.x,
    y: center.y,
    z: center.z,
    duration,
    ease: 'power2.inOut',
  });
}
```

## Bounding box normalization

Scale all models so their longest dimension equals a target size:

```javascript
function normalizeModel(model, targetSize = 1) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetSize / maxDim;

  model.scale.setScalar(scale);

  // Re-center after scaling
  const newBox = new THREE.Box3().setFromObject(model);
  const center = newBox.getCenter(new THREE.Vector3());
  model.position.sub(center);
  model.position.y += newBox.getSize(new THREE.Vector3()).y / 2; // sit on ground
}
```
