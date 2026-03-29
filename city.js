// ===== CITY.JS — 3D City Construction with Three.js =====

class APCity {
  constructor(scene) {
    this.scene = scene;
    this.buildingMeshes = [];
    this.trees = [];
    this.streetLights = [];
    this.glowObjects = [];
    this.neonLights = [];
    this.time = 0;
    this.isNight = true;

    this._buildMaterials();
    this._buildGround();
    this._buildRoads();
    this._buildBuildings();
    this._buildTrees();
    this._buildStreetLights();
    this._buildSkybox();
    this._buildFog();
    this._buildAmbience();
  }

  _buildMaterials() {
    this.matRoad = new THREE.MeshLambertMaterial({ color: 0x111122 });
    this.matSidewalk = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
    this.matGround = new THREE.MeshLambertMaterial({ color: 0x0a0e1a });
    this.matLine = new THREE.MeshBasicMaterial({ color: 0xffb700, transparent: true, opacity: 0.6 });
  }

  _buildGround() {
    // Main ground plane
    const geoGround = new THREE.PlaneGeometry(600, 600, 1, 1);
    const ground = new THREE.Mesh(geoGround, this.matGround);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grass patches
    const geoGrass = new THREE.PlaneGeometry(50, 50);
    const matGrass = new THREE.MeshLambertMaterial({ color: 0x0d1a0d });
    const grassPositions = [
      [-70, -70], [70, -70], [-70, 70], [70, 70],
      [0, -80], [0, 80], [-100, 0], [100, 0]
    ];
    grassPositions.forEach(([x, z]) => {
      const g = new THREE.Mesh(geoGrass, matGrass);
      g.rotation.x = -Math.PI / 2;
      g.position.set(x, 0.01, z);
      g.receiveShadow = true;
      this.scene.add(g);
    });
  }

  _buildRoads() {
    const roadConfigs = [
      // Main cross roads
      { x: 0, z: 0, w: 300, d: 12, axis: 'x' },  // Horizontal main
      { x: 0, z: 0, w: 12, d: 300, axis: 'z' },  // Vertical main
      // Secondary roads
      { x: -60, z: 0, w: 12, d: 200, axis: 'z' },
      { x: 60, z: 0, w: 12, d: 200, axis: 'z' },
      { x: 0, z: -60, w: 200, d: 12, axis: 'x' },
      { x: 0, z: 60, w: 200, d: 12, axis: 'x' },
      // Ring road segments
      { x: -110, z: 0, w: 12, d: 100, axis: 'z' },
      { x: 110, z: 0, w: 12, d: 100, axis: 'z' },
    ];

    roadConfigs.forEach(r => {
      const geo = new THREE.BoxGeometry(r.w, 0.2, r.d);
      const road = new THREE.Mesh(geo, this.matRoad);
      road.position.set(r.x, 0.1, r.z);
      road.receiveShadow = true;
      this.scene.add(road);

      // Sidewalks alongside roads
      const swMat = new THREE.MeshLambertMaterial({ color: 0x1e1e30 });
      if (r.axis === 'x') {
        [-1, 1].forEach(side => {
          const swGeo = new THREE.BoxGeometry(r.w, 0.3, 3);
          const sw = new THREE.Mesh(swGeo, swMat);
          sw.position.set(r.x, 0.15, r.z + side * (r.d / 2 + 1.5));
          sw.receiveShadow = true;
          this.scene.add(sw);
        });
        // Road markings
        this._addRoadMarkings(r.x, r.z, r.w, r.d, 'x');
      } else {
        [-1, 1].forEach(side => {
          const swGeo = new THREE.BoxGeometry(3, 0.3, r.d);
          const sw = new THREE.Mesh(swGeo, swMat);
          sw.position.set(r.x + side * (r.w / 2 + 1.5), 0.15, r.z);
          sw.receiveShadow = true;
          this.scene.add(sw);
        });
        this._addRoadMarkings(r.x, r.z, r.w, r.d, 'z');
      }
    });

    // Intersections
    const intGeo = new THREE.BoxGeometry(12, 0.22, 12);
    const intPositions = [
      [0, 0], [-60, 0], [60, 0], [0, -60], [0, 60],
      [-60, -60], [60, -60], [-60, 60], [60, 60]
    ];
    intPositions.forEach(([x, z]) => {
      const mesh = new THREE.Mesh(intGeo, this.matRoad);
      mesh.position.set(x, 0.11, z);
      this.scene.add(mesh);
    });
  }

  _addRoadMarkings(x, z, w, d, axis) {
    const dashCount = axis === 'x' ? Math.floor(w / 8) : Math.floor(d / 8);
    const dashGeo = new THREE.BoxGeometry(
      axis === 'x' ? 4 : 0.3,
      0.01,
      axis === 'x' ? 0.3 : 4
    );
    for (let i = 0; i < dashCount; i++) {
      const dash = new THREE.Mesh(dashGeo, this.matLine);
      if (axis === 'x') {
        dash.position.set(x - w / 2 + 4 + i * 8, 0.21, z);
      } else {
        dash.position.set(x, 0.21, z - d / 2 + 4 + i * 8);
      }
      this.scene.add(dash);
    }
  }

  _buildBuildings() {
    BUILDING_DEFS.forEach(def => {
      const mesh = this._createBuilding(def);
      this.buildingMeshes.push({ def, mesh, glowIntensity: 0 });
    });
  }

  _createBuilding(def) {
    const group = new THREE.Group();
    const { w, h, d } = def.size;
    const { x, z } = def.position;

    // Base foundation
    const baseGeo = new THREE.BoxGeometry(w + 2, 1, d + 2);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x1a1a28 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.5, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Main building body
    const buildingGeo = new THREE.BoxGeometry(w, h, d);
    const buildingMat = new THREE.MeshPhongMaterial({
      color: 0x0d1228,
      emissive: new THREE.Color(def.color),
      emissiveIntensity: 0.03,
      shininess: 60
    });
    const building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.set(0, h / 2 + 1, 0);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    // Building outline / edge glow strip
    const edgeGeo = new THREE.EdgesGeometry(buildingGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: def.color,
      transparent: true,
      opacity: 0.4
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.position.set(0, h / 2 + 1, 0);
    group.add(edges);

    // Windows
    this._addWindows(group, def, w, h, d);

    // Roof elements based on style
    this._addRoofDetails(group, def, w, h, d);

    // Neon sign strip at top
    const neonGeo = new THREE.BoxGeometry(w + 0.5, 0.8, d + 0.5);
    const neonMat = new THREE.MeshBasicMaterial({
      color: def.color,
      transparent: true,
      opacity: 0.7
    });
    const neonStrip = new THREE.Mesh(neonGeo, neonMat);
    neonStrip.position.set(0, h + 1.4, 0);
    group.add(neonStrip);
    this.neonLights.push({ mesh: neonStrip, mat: neonMat, baseColor: def.color });

    // Antenna / signal light
    const antGeo = new THREE.CylinderGeometry(0.1, 0.1, h * 0.15);
    const antMat = new THREE.MeshBasicMaterial({ color: 0x444466 });
    const antenna = new THREE.Mesh(antGeo, antMat);
    antenna.position.set(0, h + 1 + h * 0.075, 0);
    group.add(antenna);

    const blinkGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const blinkMat = new THREE.MeshBasicMaterial({ color: def.color });
    const blink = new THREE.Mesh(blinkGeo, blinkMat);
    blink.position.set(0, h + 1 + h * 0.15 + 0.5, 0);
    group.add(blink);
    this.glowObjects.push({ mesh: blink, mat: blinkMat, phase: Math.random() * Math.PI * 2 });

    // Point light for building glow (low intensity default)
    const light = new THREE.PointLight(def.color, 0, 30);
    light.position.set(0, h / 2 + 1, 0);
    group.add(light);

    // Label sprite (floating text simulation with plane)
    this._addBuildingLabel(group, def, h);

    group.position.set(x, 0, z);
    this.scene.add(group);

    return { group, building, buildingMat, edges, edgeMat, light, neonStrip, neonMat };
  }

  _addWindows(group, def, w, h, d) {
    const windowRows = Math.max(2, Math.floor(h / 7));
    const windowColsX = Math.max(2, Math.floor(w / 5));
    const windowColsZ = Math.max(2, Math.floor(d / 5));
    const winGeo = new THREE.PlaneGeometry(2, 2.5);

    const faces = [
      { normal: [0, 0, 1], offset: d / 2 + 0.05, cols: windowColsX, rotY: 0 },
      { normal: [0, 0, -1], offset: -(d / 2 + 0.05), cols: windowColsX, rotY: Math.PI },
      { normal: [1, 0, 0], offset: w / 2 + 0.05, cols: windowColsZ, rotY: Math.PI / 2 },
      { normal: [-1, 0, 0], offset: -(w / 2 + 0.05), cols: windowColsZ, rotY: -Math.PI / 2 }
    ];

    faces.forEach(face => {
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < face.cols; col++) {
          const lit = Math.random() > 0.35;
          if (!lit) continue;
          const winMat = new THREE.MeshBasicMaterial({
            color: def.color,
            transparent: true,
            opacity: 0.3 + Math.random() * 0.4
          });
          const win = new THREE.Mesh(winGeo, winMat);
          const span = face.cols > 1 ? (w - 4) / (face.cols - 1) : 0;
          const xOff = face.normal[2] !== 0 ? (-w / 2 + 2 + col * span) : face.offset;
          const zOff = face.normal[0] !== 0 ? (-d / 2 + 2 + col * span) : face.offset;
          const crossOff = face.normal[2] !== 0 ? face.offset : 0;

          win.position.set(
            face.normal[0] !== 0 ? face.offset : xOff,
            3 + row * (h / windowRows),
            face.normal[2] !== 0 ? crossOff : zOff
          );
          win.rotation.y = face.rotY;
          group.add(win);
          this.glowObjects.push({ mesh: win, mat: winMat, phase: Math.random() * Math.PI * 2, isWindow: true });
        }
      }
    });
  }

  _addRoofDetails(group, def, w, h, d) {
    const color = def.color;
    switch (def.style) {
      case 'tower': {
        // Pyramid top
        const pyrGeo = new THREE.ConeGeometry(w * 0.4, h * 0.2, 4);
        const pyrMat = new THREE.MeshPhongMaterial({ color: 0x0d1228, emissive: new THREE.Color(color), emissiveIntensity: 0.2 });
        const pyr = new THREE.Mesh(pyrGeo, pyrMat);
        pyr.position.set(0, h + 1 + h * 0.1, 0);
        group.add(pyr);
        break;
      }
      case 'stadium': {
        // Curved roof arc (approx with torus)
        const torusGeo = new THREE.TorusGeometry(Math.max(w, d) * 0.5, 1.5, 8, 32, Math.PI);
        const torusMat = new THREE.MeshPhongMaterial({ color: 0x111130, emissive: new THREE.Color(color), emissiveIntensity: 0.15 });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.rotation.z = Math.PI / 2;
        torus.position.set(0, h + 2, 0);
        group.add(torus);
        break;
      }
      case 'modern': {
        // Glass rooftop penthouse
        const penGeo = new THREE.BoxGeometry(w * 0.6, h * 0.15, d * 0.6);
        const penMat = new THREE.MeshPhongMaterial({ color: 0x112233, emissive: new THREE.Color(color), emissiveIntensity: 0.25, transparent: true, opacity: 0.8 });
        const pen = new THREE.Mesh(penGeo, penMat);
        pen.position.set(0, h + 1 + h * 0.075, 0);
        group.add(pen);
        break;
      }
      case 'cafe': {
        // Awning
        const awGeo = new THREE.BoxGeometry(w + 4, 0.3, 4);
        const awMat = new THREE.MeshBasicMaterial({ color });
        const aw = new THREE.Mesh(awGeo, awMat);
        aw.position.set(0, 5, d / 2 + 1);
        group.add(aw);
        break;
      }
    }
  }

  _addBuildingLabel(group, def, h) {
    // We'll handle labels via canvas overlay in city update
    // Store reference for label positioning
    group.userData = { def, labelHeight: h + 5 };
  }

  _buildTrees() {
    const treePositions = [
      // Boulevard trees
      [-25, -45], [25, -45], [-25, 45], [25, 45],
      [-45, -25], [-45, 25], [45, -25], [45, 25],
      [-35, -80], [35, -80], [-35, 80], [35, 80],
      [-80, -35], [-80, 35], [80, -35], [80, 35],
      // Park area
      [-20, 0], [20, 0], [0, -20], [0, 20],
      // Random scatter
      [-50, -100], [50, -100], [-100, -50], [100, -50],
      [-50, 100], [50, 100], [-100, 50], [100, 50],
      [-130, -20], [-130, 20], [130, -20], [130, 20],
    ];

    treePositions.forEach(([x, z]) => {
      this._createTree(x, z);
    });
  }

  _createTree(x, z) {
    const group = new THREE.Group();
    const h = 4 + Math.random() * 4;
    const r = 2 + Math.random() * 2;

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, h * 0.4, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3a2010 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = h * 0.2;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage (2 spheres for fullness)
    const foliageColor = this.isNight ? 0x0f2a15 : 0x1a4020;
    const foliageMat = new THREE.MeshLambertMaterial({
      color: foliageColor,
      emissive: new THREE.Color(0x00ff44),
      emissiveIntensity: this.isNight ? 0.04 : 0
    });
    [[0, h * 0.65, 0, r], [r * 0.3, h * 0.55, r * 0.2, r * 0.7]].forEach(([fx, fy, fz, fr]) => {
      const fGeo = new THREE.SphereGeometry(fr, 7, 7);
      const foliage = new THREE.Mesh(fGeo, foliageMat);
      foliage.position.set(fx, fy, fz);
      foliage.castShadow = true;
      group.add(foliage);
    });

    group.position.set(x, 0, z);
    group.rotation.y = Math.random() * Math.PI;
    this.scene.add(group);
    this.trees.push({ group, foliageMat });
  }

  _buildStreetLights() {
    const lightPositions = [
      [-6, -30], [6, -30], [-6, 30], [6, 30],
      [-30, -6], [-30, 6], [30, -6], [30, 6],
      [-6, -90], [6, -90], [-6, 90], [6, 90],
      [-66, -6], [-66, 6], [66, -6], [66, 6],
      [-6, -66], [6, -66], [-6, 66], [6, 66],
    ];

    lightPositions.forEach(([x, z]) => {
      this._createStreetLight(x, z);
    });
  }

  _createStreetLight(x, z) {
    const group = new THREE.Group();

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.15, 0.2, 8, 6);
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x334455 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 4;
    pole.castShadow = true;
    group.add(pole);

    // Arm
    const armGeo = new THREE.BoxGeometry(2.5, 0.2, 0.2);
    const arm = new THREE.Mesh(armGeo, poleMat);
    arm.position.set(1.2, 8, 0);
    group.add(arm);

    // Lamp head
    const lampGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffe080 });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(2.4, 8, 0);
    group.add(lamp);

    // Actual point light
    const light = new THREE.PointLight(0xffe080, this.isNight ? 1.2 : 0, 25);
    light.position.set(2.4, 8, 0);
    group.add(light);

    group.position.set(x, 0, z);
    this.scene.add(group);
    this.streetLights.push({ group, light, lamp, lampMat });
  }

  _buildSkybox() {
    // Night sky gradient via large sphere
    const skyGeo = new THREE.SphereGeometry(450, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x020210,
      side: THREE.BackSide
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyMesh);
    this.skyMat = skyMat;

    // Stars
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 400;
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = Math.abs(r * Math.cos(phi)) + 20; // keep above horizon
      starPositions[i + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.8 });
    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
    this.starMat = starMat;
  }

  _buildFog() {
    this.scene.fog = new THREE.FogExp2(0x020210, 0.008);
    this.fogRef = this.scene.fog;
  }

  _buildAmbience() {
    // Decorative ground markings - crosswalks
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const stripeGeo = new THREE.PlaneGeometry(1.5, 4);
    [[0, -6, 'x'], [0, 6, 'x'], [-6, 0, 'z'], [6, 0, 'z']].forEach(([x, z, axis]) => {
      for (let i = -3; i <= 3; i += 2) {
        const stripe = new THREE.Mesh(stripeGeo, crossMat);
        stripe.rotation.x = -Math.PI / 2;
        if (axis === 'x') {
          stripe.rotation.z = Math.PI / 2;
          stripe.position.set(x + i * 1.2, 0.22, z);
        } else {
          stripe.position.set(x, 0.22, z + i * 1.2);
        }
        this.scene.add(stripe);
      }
    });
  }

  // Call every frame
  update(deltaTime, isNight, nearBuilding) {
    this.time += deltaTime;
    this.isNight = isNight;

    // Animate blink lights & windows
    this.glowObjects.forEach(obj => {
      if (!obj.mesh.visible) return;
      if (obj.isWindow) {
        const flicker = Math.sin(this.time * 2 + obj.phase);
        obj.mat.opacity = isNight ? 0.25 + flicker * 0.15 : 0.1;
      } else {
        // Antenna blinks
        obj.mat.opacity = Math.sin(this.time * 3 + obj.phase) > 0.4 ? 1 : 0.1;
      }
    });

    // Building proximity glow
    this.buildingMeshes.forEach(bm => {
      const isNear = nearBuilding && nearBuilding.id === bm.def.id;
      const targetIntensity = isNear ? 0.35 : 0.03;
      bm.mesh.building.material.emissiveIntensity +=
        (targetIntensity - bm.mesh.building.material.emissiveIntensity) * 0.08;
      bm.mesh.light.intensity += (isNear ? 2 : 0) - bm.mesh.light.intensity;
      bm.mesh.light.intensity *= 0.92;
      if (isNear) bm.mesh.light.intensity += 2 * 0.08;

      // Edge glow
      bm.mesh.edgeMat.opacity = isNear ? (0.6 + Math.sin(this.time * 4) * 0.3) : 0.3;

      // Neon strip brightness
      bm.mesh.neonMat.opacity = isNight ? (isNear ? 0.95 : 0.55) : 0.2;
    });

    // Street lights on/off
    this.streetLights.forEach(sl => {
      const targetI = isNight ? 1.2 : 0;
      sl.light.intensity += (targetI - sl.light.intensity) * 0.05;
      sl.lampMat.color.setHex(isNight ? 0xffe080 : 0x888888);
    });

    // Tree neon glow at night
    this.trees.forEach(t => {
      t.foliageMat.emissiveIntensity = isNight ? 0.04 : 0;
    });

    // Sky color transition
    if (isNight) {
      this.skyMat.color.setHex(0x020210);
      this.fogRef.color.setHex(0x020210);
      this.starMat.opacity = 0.8;
    } else {
      this.skyMat.color.setHex(0x1a3050);
      this.fogRef.color.setHex(0x1a3050);
      this.starMat.opacity = 0;
    }
  }

  // Get building def by scene position proximity
  getBuildingDefs() {
    return BUILDING_DEFS;
  }

  setDayMode(isDaytime) {
    this.isNight = !isDaytime;
  }
}
