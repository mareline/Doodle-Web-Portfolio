// Torn notebook-paper strips that crumple into a ball and roll away as you scroll past them.
// One shared full-screen canvas draws every strip on top of its placeholder <div data-paper-divider>.
// Everything is driven by scroll position, so scrolling back up uncrumples the paper.
import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";

const INK = "#1a1a1a";
const PAPER = "#f3f0e8";

const ASPECT = 5.5; // strip width ÷ height
const SEG_X = 56;
const SEG_Y = 10;
const MAX_WIDTH_PX = 560;
const BALL_RADIUS = 0.085; // in strip-widths

// Scroll timeline, as fractions of the viewport height measured at the strip's centre
const START = 0.72; // flat until it rises above this line…
const END = 0.18; // …gone by this one
const CRUMPLE_END = 0.6; // first 60% of the timeline crumples, the rest rolls it away

const FOV = 30;

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// ---------- tiny seeded noise ----------

function hash3(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const u = smooth(x - xi), v = smooth(y - yi), w = smooth(z - zi);
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz);
  const front = lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v);
  const back = lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v);
  return lerp(front, back, w) * 2 - 1;
}

// Sharp creases: peaks along fold lines
const ridge = (x, y, z) => 1 - Math.abs(noise3(x, y, z));

function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- paper textures ----------

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return [canvas, canvas.getContext("2d")];
}

function paperStripTexture(label, seed) {
  const W = 1024;
  const H = Math.round(W / ASPECT);
  const [canvas, ctx] = makeCanvas(W, H);
  const random = seededRandom(seed);

  // Torn top and bottom edges
  ctx.beginPath();
  ctx.moveTo(0, 8);
  for (let x = 0; x <= W; x += 12) ctx.lineTo(x, 3 + random() * 13);
  for (let x = W; x >= 0; x -= 12) ctx.lineTo(x, H - 3 - random() * 13);
  ctx.closePath();
  ctx.fillStyle = PAPER;
  ctx.fill();

  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(26,26,26,0.13)";
  ctx.lineWidth = 2;
  for (let y = 38; y < H - 10; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(26,26,26,0.22)";
  ctx.beginPath();
  ctx.moveTo(84, 0);
  ctx.lineTo(84, H);
  ctx.stroke();
  ctx.fillStyle = "rgba(26,26,26,0.06)";
  for (let i = 0; i < 500; i++) ctx.fillRect(random() * W, random() * H, 1.5, 1.5);
  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  // Handwritten note, drawn once the handwriting font has loaded
  const writeLabel = () => {
    ctx.save();
    ctx.translate(W / 2 + 30, H / 2 + 6);
    ctx.rotate(-0.025);
    ctx.font = `700 ${Math.round(H * 0.4)}px Caveat, "Comic Sans MS", cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = INK;
    ctx.fillText(label, 0, 0);
    ctx.restore();
    texture.needsUpdate = true;
  };
  document.fonts?.load(`700 40px Caveat`).then(writeLabel, writeLabel) ?? writeLabel();

  return texture;
}

function shadowTexture() {
  const [canvas, ctx] = makeCanvas(64, 64);
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(0,0,0,0.3)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

// ---------- one strip ----------

function createStrip(el, index, shadowMap) {
  const seed = 17 + index * 31;
  const height = 1 / ASPECT;
  const geometry = new PlaneGeometry(1, height, SEG_X, SEG_Y);
  const positions = geometry.attributes.position;
  const count = positions.count;

  const flat = Float32Array.from(positions.array);
  const ball = new Float32Array(count * 3);
  const delay = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const u = flat[i * 3] + 0.5;
    const v = flat[i * 3 + 1] / height + 0.5;
    // Wrap the strip twice around a lumpy sphere: neighbouring points stay neighbours, so it folds rather than tears
    const theta = u * Math.PI * 4 + noise3(u * 3, v * 3, seed) * 0.8;
    const phi = Math.PI * (0.12 + 0.76 * v) + noise3(u * 4, v * 4, seed + 7) * 0.5;
    const r = BALL_RADIUS * (0.7 + 0.5 * ridge(u * 9, v * 9, seed + 3));
    ball[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    ball[i * 3 + 1] = r * Math.cos(phi);
    ball[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    // The ends scrunch first, the middle last
    delay[i] = 0.35 * (1 - Math.abs(u - 0.5) * 2);
  }

  const texture = paperStripTexture(el.dataset.paperDivider, seed);
  const material = new MeshStandardMaterial({
    map: texture,
    side: DoubleSide,
    flatShading: true,
    roughness: 1,
    metalness: 0,
    alphaTest: 0.5,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;

  const roller = new Group();
  roller.add(mesh);

  const shadowMaterial = new MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false });
  const shadow = new Mesh(new PlaneGeometry(1, 1), shadowMaterial);
  shadow.renderOrder = -1;

  return {
    el, seed, geometry, positions, count, flat, ball, delay, mesh, roller, shadow,
    disposables: [geometry, material, texture, shadow.geometry, shadowMaterial],
    direction: index % 2 ? -1 : 1, // alternate which way the balls roll
    progress: null,
    lastCrumple: -1,
  };
}

function crumple(strip, amount) {
  const { flat, ball, delay, count, seed } = strip;
  const out = strip.positions.array;
  for (let i = 0; i < count; i++) {
    const t = clamp01((amount - delay[i]) / 0.65);
    const e = smooth(t);
    const x = flat[i * 3];
    const y = flat[i * 3 + 1];
    // Creases pop up mid-crumple, then get swallowed into the ball
    const crease = Math.sin(Math.PI * t) * 0.07 * (ridge(x * 18, y * 22, seed + 11) - 0.5) * 2;
    out[i * 3] = lerp(x, ball[i * 3], e);
    out[i * 3 + 1] = lerp(y, ball[i * 3 + 1], e);
    out[i * 3 + 2] = lerp(0, ball[i * 3 + 2], e) + crease;
  }
  strip.positions.needsUpdate = true;
}

// ---------- scene ----------

export function createPaperDividers(canvas, elements) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  scene.add(new AmbientLight(0xffffff, 1.7));
  const sun = new DirectionalLight(0xffffff, 2.1);
  sun.position.set(-0.4, 0.8, 1);
  scene.add(sun);

  const camera = new PerspectiveCamera(FOV, 1, 1, 5000);
  const shadowMap = shadowTexture();
  const strips = elements.map((el, i) => createStrip(el, i, shadowMap));
  strips.forEach((s) => scene.add(s.shadow, s.roller));

  let vw = 0;
  let vh = 0;
  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    // Place the camera so 1 world unit = 1 CSS pixel on the z=0 plane
    camera.position.z = vh / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
    camera.updateProjectionMatrix();
  }
  resize();

  let last = performance.now();
  let drewSomething = true;

  function frame() {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    let anyVisible = false;

    for (const s of strips) {
      const rect = s.el.getBoundingClientRect();
      const visible = rect.bottom > -100 && rect.top < vh + 100;
      s.roller.visible = s.shadow.visible = visible;
      if (!visible) continue;
      anyVisible = true;

      const centerY = rect.top + rect.height / 2;
      const target = clamp01((START * vh - centerY) / ((START - END) * vh));
      // Ease toward the scroll position so fast scrolls still animate smoothly
      s.progress = s.progress === null ? target : s.progress + (target - s.progress) * (1 - Math.exp(-dt * 10));

      const crumpleAmount = clamp01(s.progress / CRUMPLE_END);
      const roll = clamp01((s.progress - CRUMPLE_END) / (1 - CRUMPLE_END));
      if (Math.abs(crumpleAmount - s.lastCrumple) > 1e-4) {
        crumple(s, crumpleAmount);
        s.lastCrumple = crumpleAmount;
      }

      const width = Math.min(rect.width * 0.8, MAX_WIDTH_PX);
      const radius = BALL_RADIUS * width;
      const e = smooth(crumpleAmount);

      // Roll off the side of the screen, with a couple of little bounces
      const dx = s.direction * roll * roll * (vw / 2 + radius * 3);
      const bounce = Math.abs(Math.sin(roll * Math.PI * 3)) * (1 - roll) * 16 * (roll > 0 ? 1 : 0);
      const x = rect.left + rect.width / 2 + dx;
      const y = centerY + e * (width / ASPECT / 2 - radius) - bounce;

      s.roller.position.set(x - vw / 2, vh / 2 - y, 0);
      s.roller.scale.setScalar(width);
      s.roller.rotation.z = -dx / radius;
      s.mesh.rotation.set(e * 0.5, e * 0.7 * s.direction, e * -0.2 * s.direction);

      s.shadow.position.set(x - vw / 2 + 8, vh / 2 - y - 10 - lerp(0, radius * 0.6, e), -20);
      s.shadow.scale.set(lerp(width * 1.08, radius * 2.6, e), lerp((width / ASPECT) * 1.5, radius * 1.1, e), 1);
    }

    if (anyVisible || drewSomething) renderer.render(scene, camera);
    drewSomething = anyVisible;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      renderer.setAnimationLoop(null);
    } else {
      last = performance.now();
      renderer.setAnimationLoop(frame);
    }
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibilityChange);
  renderer.setAnimationLoop(frame);

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      strips.forEach((s) => s.disposables.forEach((d) => d.dispose()));
      shadowMap.dispose();
      renderer.dispose();
    },
  };
}
