// ===== UI.JS — HUD, Minimap, Modal, Achievements =====

class GameUI {
  constructor() {
    this.visitedBuildings = new Set();
    this.achievementQueue = [];
    this.processingAch = false;
    this.nearBuilding = null;
    this.modalOpen = false;
    this.musicOn = false;
    this.weatherOn = false;
    this.dayMode = false;
    this.lastSpeedUpdate = 0;

    // Minimap canvas
    this.mmCanvas = document.getElementById('minimap-canvas');
    this.mmCtx = this.mmCanvas.getContext('2d');

    // Speed arc canvas
    this.arcCanvas = document.getElementById('speed-arc');
    this.arcCtx = this.arcCanvas ? this.arcCanvas.getContext('2d') : null;

    this._initEvents();
    this._initAudio();
  }

  _initEvents() {
    // Modal close
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) this.closeModal();
    });

    // HUD buttons
    document.getElementById('music-btn').addEventListener('click', () => this.toggleMusic());
    document.getElementById('weather-btn').addEventListener('click', () => this.toggleWeather());
    document.getElementById('time-btn').addEventListener('click', () => {
      this.dayMode = !this.dayMode;
      const btn = document.getElementById('time-btn');
      btn.textContent = this.dayMode ? '☀ DAY MODE' : '⬤ NIGHT MODE';
      btn.classList.toggle('active', this.dayMode);
      return this.dayMode;
    });

    // Touch enter
    document.getElementById('touch-enter-btn').addEventListener('click', () => {
      if (this.nearBuilding) this.openBuilding(this.nearBuilding);
    });
    document.getElementById('t-enter').addEventListener('click', () => {
      if (this.nearBuilding) this.openBuilding(this.nearBuilding);
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (this.modalOpen) this.closeModal();
        else if (this.nearBuilding) this.openBuilding(this.nearBuilding);
        e.preventDefault();
      }
      if (e.key === 'Escape') this.closeModal();
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    });
  }

  _initAudio() {
    // Web Audio API ambient engine sound + music
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.engineGain = this.audioCtx.createGain();
      this.engineGain.gain.value = 0;
      this.engineGain.connect(this.audioCtx.destination);
      this._startEngineSound();
    } catch(e) {
      this.audioCtx = null;
    }
  }

  _startEngineSound() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 80;
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    osc.connect(filter);
    filter.connect(this.engineGain);
    osc.start();
    this.engineOsc = osc;
    this.engineFilter = filter;
  }

  updateEngineSound(speed, maxSpeed) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    const ratio = Math.min(speed / maxSpeed, 1);
    this.engineGain.gain.value = 0.015 + ratio * 0.02;
    if (this.engineOsc) {
      this.engineOsc.frequency.value = 60 + ratio * 120;
    }
  }

  toggleMusic() {
    this.musicOn = !this.musicOn;
    const btn = document.getElementById('music-btn');
    btn.textContent = this.musicOn ? '♪ MUSIC: ON' : '♪ MUSIC: OFF';
    btn.classList.toggle('active', this.musicOn);

    if (this.musicOn && this.audioCtx) {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      this._startCityMusic();
    } else if (this.musicGain) {
      this.musicGain.gain.value = 0;
    }
  }

  _startCityMusic() {
    if (!this.audioCtx || this.musicStarted) return;
    this.musicStarted = true;
    this.musicGain = this.audioCtx.createGain();
    this.musicGain.gain.value = 0.06;
    this.musicGain.connect(this.audioCtx.destination);

    // Simple ambient synth chord
    const freqs = [65.41, 82.41, 98, 130.81, 164.81]; // C2 chord
    freqs.forEach((f, i) => {
      const o = this.audioCtx.createOscillator();
      o.type = i % 2 === 0 ? 'sine' : 'triangle';
      o.frequency.value = f;
      const g = this.audioCtx.createGain();
      g.gain.value = 0.3 - i * 0.04;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      o.connect(filter);
      filter.connect(g);
      g.connect(this.musicGain);
      o.start();
    });
  }

  toggleWeather() {
    this.weatherOn = !this.weatherOn;
    const w = document.getElementById('weather');
    w.innerHTML = '';
    if (this.weatherOn) {
      for (let i = 0; i < 100; i++) {
        const d = document.createElement('div');
        d.className = 'rain-drop';
        const h = 10 + Math.random() * 25;
        d.style.cssText = `left:${Math.random() * 100}%;height:${h}px;animation-duration:${0.3 + Math.random() * 0.4}s;animation-delay:${Math.random() * 1}s;opacity:${0.4 + Math.random() * 0.4}`;
        w.appendChild(d);
      }
    }
    document.getElementById('weather-btn').classList.toggle('active', this.weatherOn);
  }

  setNearBuilding(building) {
    if (this.nearBuilding === building) return;
    this.nearBuilding = building;
    const indicator = document.getElementById('building-indicator');
    const enterBtn = document.getElementById('touch-enter-btn');
    if (building) {
      document.getElementById('bi-label').textContent = building.label;
      document.getElementById('bi-sublabel').textContent = building.sublabel;
      indicator.classList.add('visible');
      if (enterBtn) enterBtn.classList.add('visible');
    } else {
      indicator.classList.remove('visible');
      if (enterBtn) enterBtn.classList.remove('visible');
    }
  }

  openBuilding(def) {
    if (!def) return;
    if (this.modalOpen) return;

    // Achievement for first visit
    if (!this.visitedBuildings.has(def.id)) {
      this.visitedBuildings.add(def.id);
      this.updateProgress();
      setTimeout(() => this.showAchievement(def.achievement), 400);
    }

    const content = SECTION_CONTENT[def.section];
    if (!content) return;

    document.getElementById('modal-content').innerHTML = `
      <div style="text-align:center;margin-bottom:18px">
        <div class="modal-icon">${content.icon}</div>
        <div class="modal-title" style="color:${content.color}">${content.title}</div>
        <div class="modal-subtitle">${content.subtitle}</div>
      </div>
      <div class="modal-divider"></div>
      ${content.render()}
    `;

    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('open');
    this.modalOpen = true;

    // Animate skill bars
    setTimeout(() => {
      document.querySelectorAll('.skill-fill').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }, 300);
  }

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    this.modalOpen = false;
  }

  updateProgress() {
    const pct = (this.visitedBuildings.size / BUILDING_DEFS.length) * 100;
    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('prog-num').textContent = `${this.visitedBuildings.size} / ${BUILDING_DEFS.length} BUILDINGS`;
    if (this.visitedBuildings.size === BUILDING_DEFS.length) {
      setTimeout(() => this.showAchievement('🏆 Full City Explorer — AP City Conquered!'), 1000);
    }
  }

  showAchievement(text) {
    this.achievementQueue.push(text);
    if (!this.processingAch) this._processAch();
  }

  _processAch() {
    if (!this.achievementQueue.length) { this.processingAch = false; return; }
    this.processingAch = true;
    const box = document.getElementById('achievement-box');
    document.getElementById('ach-name').textContent = this.achievementQueue[0];
    box.classList.add('show');
    setTimeout(() => {
      box.classList.remove('show');
      this.achievementQueue.shift();
      setTimeout(() => this._processAch(), 500);
    }, 3500);
  }

  updateKeyIndicators(keys) {
    const map = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    const alt  = { up: 'w', down: 's', left: 'a', right: 'd' };
    Object.keys(map).forEach(dir => {
      const el = document.getElementById('key-' + dir);
      if (el) el.classList.toggle('active', !!(keys[map[dir]] || keys[alt[dir]]));
    });
  }

  updateSpeed(speed, maxSpeed) {
    const kmh = Math.round(speed * 10);
    document.getElementById('speed-val').textContent = kmh;

    if (this.arcCtx) {
      const ctx = this.arcCtx;
      ctx.clearRect(0, 0, 80, 80);
      const ratio = Math.min(speed / maxSpeed, 1);
      const startAngle = Math.PI * 0.75;
      const endAngle = startAngle + Math.PI * 1.5 * ratio;

      // Background arc
      ctx.beginPath();
      ctx.arc(40, 40, 32, startAngle, startAngle + Math.PI * 1.5);
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Speed arc
      if (ratio > 0) {
        const gradient = ctx.createLinearGradient(0, 0, 80, 80);
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(0.5, '#b04fff');
        gradient.addColorStop(1, ratio > 0.8 ? '#ff3da6' : '#00ffd4');
        ctx.beginPath();
        ctx.arc(40, 40, 32, startAngle, endAngle);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
  }

  drawMinimap(carPos, carAngle, buildingDefs, visitedSet) {
    const ctx = this.mmCtx;
    const W = 160, H = 160;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(5,5,20,0.95)';
    ctx.fillRect(0, 0, W, H);

    // World scale: world is -220 to 220 = 440 units, map is 160px
    const scale = W / 440;
    const ox = W / 2 - carPos.x * scale;
    const oy = H / 2 - carPos.z * scale;

    // Roads
    ctx.strokeStyle = '#1a1a30';
    ctx.lineWidth = 4;
    [[0, -220, 0, 220], [-220, 0, 220, 0],
     [-60, -100, -60, 100], [60, -100, 60, 100],
     [-100, -60, 100, -60], [-100, 60, 100, 60]
    ].forEach(([x1, z1, x2, z2]) => {
      ctx.beginPath();
      ctx.moveTo(x1 * scale + ox, z1 * scale + oy);
      ctx.lineTo(x2 * scale + ox, z2 * scale + oy);
      ctx.stroke();
    });

    // Buildings
    buildingDefs.forEach(def => {
      const visited = visitedSet.has(def.id);
      const bx = def.position.x * scale + ox - def.size.w * scale * 0.5;
      const bz = def.position.z * scale + oy - def.size.d * scale * 0.5;
      const bw = def.size.w * scale;
      const bd = def.size.d * scale;

      ctx.fillStyle = visited ? def.colorHex + 'cc' : def.colorHex + '44';
      ctx.fillRect(bx, bz, bw, bd);

      if (visited) {
        ctx.strokeStyle = def.colorHex;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, bz, bw, bd);
      }
    });

    // Car dot
    const cx = W / 2;
    const cy = H / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(carAngle);
    // Arrow shape
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(3, 4);
    ctx.lineTo(0, 2);
    ctx.lineTo(-3, 4);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Circular mask
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Border ring
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,212,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    ctx.fillStyle = 'rgba(0,212,255,0.45)';
    ctx.font = '7px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('AP CITY', W / 2, 14);
  }

  isDayMode() { return this.dayMode; }
  isModalOpen() { return this.modalOpen; }
}
