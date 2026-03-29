// ===== CAR.JS — 3D Car with Physics & Camera =====

class PlayerCar {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Physics state
    this.velocity = 0;
    this.angle = 0;        // Y-axis rotation in radians
    this.position = new THREE.Vector3(0, 0.6, 30); // start pos
    this.turnSpeed = 0;
    this.wheelAngle = 0;

    // Car constants
    this.maxSpeed = 28;
    this.maxReverseSpeed = 10;
    this.acceleration = 18;
    this.braking = 30;
    this.friction = 0.88;
    this.turnSensitivity = 1.6;
    this.maxTurnAngle = Math.PI / 3;

    // Camera spring
    this.camOffset = new THREE.Vector3(0, 8, 18);
    this.camTarget = new THREE.Vector3();
    this.camCurrentPos = new THREE.Vector3(0, 8, 48);
    this.camLookAt = new THREE.Vector3();

    // Build the car mesh
    this._buildCar();
    this._buildHeadlights();
    this._buildTrail();

    // World bounds
    this.bounds = { min: -220, max: 220 };
  }

  _buildCar() {
    this.carGroup = new THREE.Group();

    // Main body
    const bodyGeo = new THREE.BoxGeometry(3.2, 1.1, 6);
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x00aadd,
      emissive: new THREE.Color(0x00d4ff),
      emissiveIntensity: 0.15,
      shininess: 120,
      specular: new THREE.Color(0x44ddff)
    });
    this.bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.bodyMesh.position.y = 0.6;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.carGroup.add(this.bodyMesh);

    // Cabin / roof
    const cabinGeo = new THREE.BoxGeometry(2.6, 0.9, 3.2);
    const cabinMat = new THREE.MeshPhongMaterial({
      color: 0x003344,
      transparent: true,
      opacity: 0.85,
      shininess: 200
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.55, -0.3);
    cabin.castShadow = true;
    this.carGroup.add(cabin);

    // Windshield
    const windGeo = new THREE.BoxGeometry(2.4, 0.7, 0.1);
    const windMat = new THREE.MeshPhongMaterial({
      color: 0x80dfff,
      transparent: true,
      opacity: 0.4,
      shininess: 200
    });
    const windshield = new THREE.Mesh(windGeo, windMat);
    windshield.position.set(0, 1.5, 1.3);
    windshield.rotation.x = 0.25;
    this.carGroup.add(windshield);

    // Neon underglow
    const glowGeo = new THREE.BoxGeometry(3.4, 0.1, 6.2);
    this.glowMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.6
    });
    const glow = new THREE.Mesh(glowGeo, this.glowMat);
    glow.position.y = 0.08;
    this.carGroup.add(glow);

    // Wheels (4 of them)
    this.wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.4, 12);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const rimGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.42, 8);
    const rimMat = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 100 });

    const wheelPositions = [
      [-1.7, 0, 2.2],   // front-left
      [1.7, 0, 2.2],    // front-right
      [-1.7, 0, -2.2],  // rear-left
      [1.7, 0, -2.2],   // rear-right
    ];

    wheelPositions.forEach((pos, i) => {
      const wGroup = new THREE.Group();
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wGroup.add(wheel);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);
      wGroup.position.set(...pos);
      wGroup.position.y = 0.3;
      this.carGroup.add(wGroup);
      this.wheels.push({ group: wGroup, isFront: i < 2 });
    });

    // Exhaust pipe
    const exhaustGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.6, 6);
    const exhaustMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(-1.0, 0.3, -3.1);
    this.carGroup.add(exhaust);

    this.carGroup.position.copy(this.position);
    this.scene.add(this.carGroup);
  }

  _buildHeadlights() {
    // Front headlight cones (SpotLight)
    this.headlights = [];
    [-1, 1].forEach(side => {
      // Headlight mesh
      const hlGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffee });
      const hl = new THREE.Mesh(hlGeo, hlMat);
      hl.position.set(side * 1.2, 0.6, 3.1);
      this.carGroup.add(hl);

      // SpotLight
      const spot = new THREE.SpotLight(0xffffff, 0, 50, Math.PI / 6, 0.4, 1.5);
      spot.position.set(side * 1.2, 0.8, 3.0);
      spot.target.position.set(side * 1.5, -1, 18);
      this.carGroup.add(spot);
      this.carGroup.add(spot.target);
      this.headlights.push({ spot, hlMat });
    });

    // Tail lights
    this.tailLights = [];
    [-1, 1].forEach(side => {
      const tlGeo = new THREE.BoxGeometry(0.6, 0.3, 0.1);
      const tlMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
      const tl = new THREE.Mesh(tlGeo, tlMat);
      tl.position.set(side * 1.2, 0.7, -3.05);
      this.carGroup.add(tl);
      this.tailLights.push({ mat: tlMat });
    });

    // Car point light (ambient glow around car)
    this.carLight = new THREE.PointLight(0x00d4ff, 0, 15);
    this.carLight.position.set(0, 1, 0);
    this.carGroup.add(this.carLight);
  }

  _buildTrail() {
    // Particle trail using points
    this.trailPoints = [];
    this.trailMaxLength = 40;
  }

  update(keys, deltaTime, isNight) {
    const dt = Math.min(deltaTime, 0.05); // cap delta

    // Input
    const accelInput = (keys['ArrowUp'] || keys['w']) ? 1 : (keys['ArrowDown'] || keys['s']) ? -1 : 0;
    const turnInput = (keys['ArrowLeft'] || keys['a']) ? -1 : (keys['ArrowRight'] || keys['d']) ? 1 : 0;

    // Acceleration / braking
    if (accelInput > 0) {
      this.velocity += this.acceleration * dt;
    } else if (accelInput < 0) {
      if (this.velocity > 0.5) {
        this.velocity -= this.braking * dt;
      } else {
        this.velocity -= this.acceleration * 0.5 * dt;
      }
    } else {
      // friction
      this.velocity *= Math.pow(this.friction, dt * 60);
      if (Math.abs(this.velocity) < 0.05) this.velocity = 0;
    }

    // Speed clamp
    this.velocity = Math.max(-this.maxReverseSpeed, Math.min(this.maxSpeed, this.velocity));

    // Turning (only when moving)
    const speedFactor = Math.abs(this.velocity) / this.maxSpeed;
    const effectiveTurn = this.turnSensitivity * turnInput * speedFactor * dt * 2.5;
    if (Math.abs(this.velocity) > 0.3) {
      this.angle -= effectiveTurn * Math.sign(this.velocity);
    }

    // Wheel steering animation
    this.wheelAngle += (turnInput * 0.4 - this.wheelAngle) * 0.15;
    this.wheels.forEach(w => {
      if (w.isFront) w.group.rotation.y = this.wheelAngle;
      // Wheel spin
      w.group.rotation.z += this.velocity * dt * 0.8;
    });

    // Move car
    const moveX = Math.sin(this.angle) * this.velocity * dt;
    const moveZ = Math.cos(this.angle) * this.velocity * dt;
    this.position.x += moveX;
    this.position.z += moveZ;

    // Bounds
    this.position.x = Math.max(this.bounds.min, Math.min(this.bounds.max, this.position.x));
    this.position.z = Math.max(this.bounds.min, Math.min(this.bounds.max, this.position.z));

    // Subtle Y bob
    this.position.y = 0.6 + Math.sin(Date.now() * 0.003) * 0.04;

    // Apply to mesh
    this.carGroup.position.copy(this.position);
    this.carGroup.rotation.y = this.angle;

    // Neon underglow flicker at speed
    const speed = Math.abs(this.velocity);
    this.glowMat.opacity = 0.4 + speed / this.maxSpeed * 0.5;
    this.carLight.intensity = isNight ? 0.5 + speed / this.maxSpeed * 0.5 : 0;

    // Headlights
    this.headlights.forEach(hl => {
      hl.spot.intensity = isNight ? 3 : 0;
      hl.hlMat.color.setHex(isNight ? 0xffffee : 0x888888);
    });

    // Tail lights (brighter when braking)
    const braking = (keys['ArrowDown'] || keys['s']) && this.velocity > 1;
    this.tailLights.forEach(tl => {
      tl.mat.opacity = braking ? 1 : 0.5;
    });

    // Camera follow
    this._updateCamera();

    // Speed indicator
    return speed;
  }

  _updateCamera() {
    // Desired camera position: behind and above car
    const behindX = this.position.x - Math.sin(this.angle) * this.camOffset.z;
    const behindZ = this.position.z - Math.cos(this.angle) * this.camOffset.z;
    const desiredPos = new THREE.Vector3(behindX, this.position.y + this.camOffset.y, behindZ);

    // Spring lerp
    this.camCurrentPos.lerp(desiredPos, 0.06);
    this.camera.position.copy(this.camCurrentPos);

    // Look at car (slightly ahead)
    const lookAtX = this.position.x + Math.sin(this.angle) * 8;
    const lookAtZ = this.position.z + Math.cos(this.angle) * 8;
    this.camLookAt.set(lookAtX, this.position.y + 1.5, lookAtZ);
    this.camera.lookAt(this.camLookAt);
  }

  getPosition() {
    return this.position;
  }

  getSpeed() {
    return Math.abs(this.velocity);
  }

  getSpeedKmH() {
    return Math.round(Math.abs(this.velocity) * 10);
  }
}
