// ===== MAIN.JS — Three.js Scene, Lighting, Game Loop =====
'use strict';

// ---- Scene Setup ----
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'low-power'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.domElement.id = 'three-canvas';
document.body.insertBefore(renderer.domElement, document.getElementById('hud'));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.5, 800);
camera.position.set(0, 10, 40);

// ---- Lighting ----
// Ambient (night-ish)
const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.6);
scene.add(ambientLight);

// Moon / directional
const moonLight = new THREE.DirectionalLight(0x3355aa, 0.4);
moonLight.position.set(50, 80, 30);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 500;
moonLight.shadow.camera.left = -200;
moonLight.shadow.camera.right = 200;
moonLight.shadow.camera.top = 200;
moonLight.shadow.camera.bottom = -200;
scene.add(moonLight);

// Sun (disabled at night, enabled during day)
const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
sunLight.position.set(-60, 100, -40);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
sunLight.shadow.camera.left = -200;
sunLight.shadow.camera.right = 200;
sunLight.shadow.camera.top = 200;
sunLight.shadow.camera.bottom = -200;
sunLight.intensity = 0; // off at start (night)
scene.add(sunLight);

// Hemisphere light for sky/ground color
const hemiLight = new THREE.HemisphereLight(0x1a1a30, 0x0a0a18, 0.3);
scene.add(hemiLight);

// City neon accent lights (static colored point lights)
const accentColors = [0x00d4ff, 0xb04fff, 0xff3da6, 0x00ff88, 0xffb700];
accentColors.forEach((color, i) => {
  const angle = (i / accentColors.length) * Math.PI * 2;
  const r = 60;
  const light = new THREE.PointLight(color, 0.5, 80);
  light.position.set(Math.cos(angle) * r, 6, Math.sin(angle) * r);
  scene.add(light);
});

// ---- Input ----
const keys = {};
document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });

// Touch controls
['up', 'down', 'left', 'right'].forEach(dir => {
  const btn = document.getElementById('t-' + dir);
  if (!btn) return;
  const keyMap = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
  btn.addEventListener('touchstart', e => { keys[keyMap[dir]] = true; e.preventDefault(); }, { passive: false });
  btn.addEventListener('touchend',   e => { keys[keyMap[dir]] = false; e.preventDefault(); }, { passive: false });
  btn.addEventListener('mousedown', () => keys[keyMap[dir]] = true);
  btn.addEventListener('mouseup',   () => keys[keyMap[dir]] = false);
  btn.addEventListener('mouseleave', () => keys[keyMap[dir]] = false);
});

// ---- Create Game Objects ----
let city, playerCar, ui;

function initGame() {
  city = new APCity(scene);
  playerCar = new PlayerCar(scene, camera);
  ui = new GameUI();
}

// ---- Proximity Detection ----
const ENTER_RADIUS = 22;

function checkBuildingProximity() {
  const carPos = playerCar.getPosition();
  let nearest = null;
  let nearestDist = Infinity;

  BUILDING_DEFS.forEach(def => {
    const dx = carPos.x - def.position.x;
    const dz = carPos.z - def.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < ENTER_RADIUS && dist < nearestDist) {
      nearestDist = dist;
      nearest = def;
    }
  });

  ui.setNearBuilding(nearest);
  return nearest;
}

// ---- Day/Night ----
function applyDayMode(isDay) {
  if (isDay) {
    ambientLight.intensity = 1.0;
    ambientLight.color.setHex(0x404060);
    moonLight.intensity = 0;
    sunLight.intensity = 1.2;
    hemiLight.skyColor.setHex(0x6688aa);
    hemiLight.groundColor.setHex(0x222233);
    hemiLight.intensity = 0.5;
  } else {
    ambientLight.intensity = 0.6;
    ambientLight.color.setHex(0x1a1a2e);
    moonLight.intensity = 0.4;
    sunLight.intensity = 0;
    hemiLight.skyColor.setHex(0x1a1a30);
    hemiLight.groundColor.setHex(0x0a0a18);
    hemiLight.intensity = 0.3;
  }
}

// ---- Clock ----
const clock = new THREE.Clock();
let lastDayMode = false;

// ---- Render Loop ----
function gameLoop() {
  requestAnimationFrame(gameLoop);
  const delta = clock.getDelta();

  if (!city || !playerCar || !ui) return;

  // Day/night toggle
  const isDayMode = ui.isDayMode();
  if (isDayMode !== lastDayMode) {
    applyDayMode(isDayMode);
    lastDayMode = isDayMode;
  }

  // Update car
  const speed = playerCar.update(keys, delta, !isDayMode);

  // Update city
  const nearBuilding = checkBuildingProximity();
  city.update(delta, !isDayMode, nearBuilding);

  // Update UI
  ui.updateKeyIndicators(keys);
  ui.updateSpeed(speed, playerCar.maxSpeed);
  ui.updateEngineSound(speed, playerCar.maxSpeed);
  ui.drawMinimap(
    playerCar.getPosition(),
    playerCar.angle,
    BUILDING_DEFS,
    ui.visitedBuildings
  );

  renderer.render(scene, camera);
}

// ---- Resize ----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- Loading Screen ----
const loadSteps = [
  'INITIALIZING THREE.JS ENGINE...',
  'BUILDING 3D CITY MESH...',
  'PLACING 8 BUILDINGS...',
  'COMPUTING LIGHTING & SHADOWS...',
  'LOADING PORTFOLIO DATA...',
  'STARTING ENGINE... AP CITY 3D IS READY!'
];

function runLoader() {
  const bar = document.getElementById('load-progress');
  const txt = document.getElementById('load-text');
  const pct = document.getElementById('load-pct');
  let progress = 0;
  let step = 0;

  const steps = [0, 1, 2, 3, 4, 5];
  const stepEls = steps.map(i => document.getElementById('ls' + i));

  // Init game while loading
  initGame();
  // Start render loop (hidden behind loading screen)
  gameLoop();

  const interval = setInterval(() => {
    progress += 8 + Math.random() * 15;
    if (progress > 100) progress = 100;

    bar.style.width = progress + '%';
    pct.textContent = Math.round(progress) + '%';
    txt.textContent = loadSteps[Math.min(step, loadSteps.length - 1)];

    // Mark steps done
    const stepIdx = Math.floor((progress / 100) * 6);
    for (let i = 0; i < stepIdx && i < 6; i++) {
      if (stepEls[i]) stepEls[i].classList.add('done');
    }
    step++;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        const loading = document.getElementById('loading');
        loading.classList.add('fade-out');
        setTimeout(() => {
          loading.style.display = 'none';
          ui.showAchievement('🚗 Welcome to AP City 3D — Drive. Explore. Discover!');
        }, 1000);
      }, 600);
    }
  }, 280);
}

runLoader();
