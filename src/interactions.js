// OpenDesign's animation and gallery logic. React owns setup and teardown.
export function initializeInteractions() {
  const controller = new AbortController();
  const observers = [];
  const frames = new Set();
  function listen(target, type, handler, options = {}) {
    target.addEventListener(type, handler, { ...options, signal: controller.signal });
  }
  function requestFrame(callback) {
    const id = requestAnimationFrame(() => {
      frames.delete(id);
      if (!controller.signal.aborted) callback();
    });
    frames.add(id);
  }
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-links');
  const menuIcon = menuButton.querySelector('use');
  const smallScreen = window.matchMedia('(max-width: 767px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const work = document.getElementById('work');
  const stage = document.getElementById('work-stage');
  const track = document.getElementById('work-track');
  const viewport = document.getElementById('work-viewport');
  const cards = [...track.querySelectorAll('.work-card')];
  const controls = document.getElementById('work-controls');
  const previous = document.getElementById('work-prev');
  const next = document.getElementById('work-next');
  const hint = document.getElementById('work-hint');
  const progress = document.getElementById('work-progress');
  const progressFill = document.getElementById('work-progress-fill');
  const announcement = document.getElementById('work-announcement');
  const consoleArt = document.getElementById('sarthi-console');
  const player = consoleArt.querySelector('.bot');
  const playerMotion = { jump: 40, stride: 4, travel: 16 };
  const spriteCanvas = player.querySelector('.player-sprite');
  const spriteSize = { width: 112, height: 180, scale: 2, columns: 5 };
  let spriteAtlas = null;
  let spriteContext = null;
  let shownPlayerFrame = -1;

  // Each entry is one held pose. Arms and legs have elbow/knee and hand/foot coordinates.
  // Frames: idle 0, walk 1-8, crouch 9-11, jump 12-16, land 17-19, wave 20-24.
  const playerPoses = [
    {},
    { leftArm: [18, 124, 14, 142], rightArm: [94, 126, 98, 148], leftLeg: [36, 160, 28, 174], rightLeg: [74, 162, 80, 170] },
    { headY: 2, bodyY: 112, leftArm: [20, 128, 22, 150], rightArm: [92, 122, 92, 142], leftLeg: [38, 164, 34, 174], rightLeg: [70, 160, 70, 166] },
    { headY: 4, bodyY: 114, leftArm: [22, 132, 28, 150], rightArm: [92, 122, 86, 138], leftLeg: [42, 164, 40, 174], rightLeg: [64, 160, 60, 168] },
    { headY: 2, bodyY: 112, leftArm: [22, 126, 28, 144], rightArm: [96, 122, 100, 140], leftLeg: [46, 164, 48, 174], rightLeg: [64, 162, 60, 174] },
    { leftArm: [18, 126, 14, 148], rightArm: [94, 124, 98, 142], leftLeg: [38, 162, 32, 170], rightLeg: [76, 160, 84, 174] },
    { headY: 2, bodyY: 112, leftArm: [20, 122, 20, 142], rightArm: [92, 128, 90, 150], leftLeg: [42, 160, 42, 166], rightLeg: [74, 164, 78, 174] },
    { headY: 4, bodyY: 114, leftArm: [20, 122, 26, 138], rightArm: [90, 132, 84, 150], leftLeg: [48, 160, 52, 168], rightLeg: [70, 164, 72, 174] },
    { headY: 2, bodyY: 112, leftArm: [16, 122, 12, 140], rightArm: [90, 126, 84, 144], leftLeg: [48, 162, 52, 174], rightLeg: [66, 164, 64, 174] },
    { headY: 4, bodyY: 114, leftArm: [18, 134, 24, 146], rightArm: [94, 134, 88, 146], leftLeg: [34, 164, 36, 174], rightLeg: [78, 164, 76, 174] },
    { headY: 8, bodyY: 118, leftArm: [16, 140, 24, 148], rightArm: [96, 140, 88, 148], leftLeg: [30, 166, 34, 174], rightLeg: [82, 166, 78, 174] },
    { headY: 12, bodyY: 122, leftArm: [14, 144, 20, 154], rightArm: [98, 144, 92, 154], leftLeg: [28, 168, 34, 174], rightLeg: [84, 168, 78, 174] },
    { headY: 2, bodyY: 112, leftArm: [16, 116, 12, 104], rightArm: [96, 116, 100, 104], leftLeg: [40, 164, 36, 174], rightLeg: [72, 164, 76, 174], frontArm: true },
    { bodyY: 108, leftArm: [14, 112, 10, 94], rightArm: [98, 112, 102, 94], leftLeg: [34, 152, 42, 162], rightLeg: [78, 152, 70, 162], frontArm: true },
    { bodyY: 106, leftArm: [14, 108, 12, 88], rightArm: [98, 108, 100, 88], leftLeg: [32, 148, 44, 158], rightLeg: [80, 148, 68, 158], frontArm: true },
    { headY: 2, bodyY: 108, leftArm: [14, 118, 12, 106], rightArm: [98, 118, 100, 106], leftLeg: [36, 156, 38, 168], rightLeg: [76, 156, 74, 168], frontArm: true },
    { headY: 4, bodyY: 112, leftArm: [16, 128, 12, 140], rightArm: [96, 128, 100, 140], leftLeg: [36, 164, 32, 174], rightLeg: [76, 164, 80, 174] },
    { headY: 12, bodyY: 122, leftArm: [14, 138, 12, 148], rightArm: [98, 138, 100, 148], leftLeg: [28, 168, 32, 174], rightLeg: [84, 168, 80, 174] },
    { headY: 8, bodyY: 118, leftArm: [18, 134, 16, 148], rightArm: [94, 134, 96, 148], leftLeg: [32, 164, 34, 174], rightLeg: [80, 164, 78, 174] },
    { headY: 2, bodyY: 112, leftArm: [18, 130, 18, 148], rightArm: [94, 130, 94, 148], leftLeg: [38, 164, 38, 174], rightLeg: [74, 164, 74, 174] },
    { rightArm: [98, 124, 104, 110], frontArm: true },
    { headY: 2, rightArm: [98, 112, 104, 88], frontArm: true },
    { headX: 2, headY: 2, rightArm: [96, 108, 90, 84], frontArm: true },
    { rightArm: [98, 118, 104, 100], frontArm: true },
    { rightArm: [96, 128, 100, 134], frontArm: true }
  ];
  const playerClips = {
    idle: { start: 0, end: .02, frames: [0] },
    walking: { start: .02, end: .32, frames: [1, 2, 3, 4, 5, 6, 7, 8], loops: 2 },
    crouching: { start: .32, end: .42, frames: [9, 10, 11] },
    jumping: { start: .42, end: .72, frames: [12, 13, 14, 15, 16] },
    landing: { start: .72, end: .84, frames: [17, 18, 19] },
    greeting: { start: .84, end: 1, frames: [20, 21, 22, 21, 22, 23, 24, 0] }
  };
  function showPlayerFrame(frame) {
    if (!spriteAtlas || !spriteContext || frame === shownPlayerFrame) return;
    const width = spriteCanvas.width;
    const height = spriteCanvas.height;
    spriteContext.clearRect(0, 0, width, height);
    spriteContext.drawImage(spriteAtlas, (frame % spriteSize.columns) * width, Math.floor(frame / spriteSize.columns) * height, width, height, 0, 0, width, height);
    shownPlayerFrame = frame;
    player.dataset.frame = String(frame);
  }
  function preparePlayerFrames() {
    try {
      const atlas = document.createElement('canvas');
      const frameWidth = spriteSize.width * spriteSize.scale;
      const frameHeight = spriteSize.height * spriteSize.scale;
      atlas.width = frameWidth * spriteSize.columns;
      atlas.height = frameHeight * Math.ceil(playerPoses.length / spriteSize.columns);
      const pen = atlas.getContext('2d');
      const screen = spriteCanvas.getContext('2d');
      if (!pen || !screen) return;
      const style = getComputedStyle(player);
      const color = name => style.getPropertyValue(name).trim();
      const ink = color('--sprite-outline');
      const cyan = color('--sprite-cyan');
      const blue = color('--sprite-blue');
      const deep = color('--sprite-deep');
      const seam = color('--sprite-seam');
      const skin = color('--sprite-skin');
      const skinLight = color('--sprite-skin-light');
      const skinShadow = color('--sprite-skin-shadow');
      const light = color('--sky');
      const rect = (x, y, width, height, fill) => {
        pen.fillStyle = fill;
        pen.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, Math.round(width / 2) * 2, Math.round(height / 2) * 2);
      };
      // The hood, face, clothes and limbs all share the same two-pixel grid.
      function drawPixelHead(offsetX, offsetY) {
        const x = 20 + offsetX;
        const y = 34 + offsetY;
        // Stepped hood silhouette, with a continuous collar at its base.
        rect(x + 16, y, 36, 4, ink);
        rect(x + 8, y + 4, 52, 4, ink);
        rect(x + 4, y + 8, 60, 8, ink);
        rect(x, y + 16, 68, 44, ink);
        rect(x + 4, y + 60, 60, 8, ink);
        rect(x + 12, y + 68, 48, 4, ink);
        rect(x + 20, y + 72, 32, 4, ink);
        rect(x + 16, y + 4, 36, 4, cyan);
        rect(x + 8, y + 8, 48, 8, cyan);
        rect(x + 4, y + 16, 56, 40, blue);
        rect(x + 8, y + 56, 48, 8, blue);
        rect(x + 16, y + 64, 36, 4, blue);
        rect(x + 20, y + 68, 32, 4, cyan);
        rect(x + 4, y + 20, 6, 32, cyan);
        rect(x + 12, y + 14, 4, 38, deep);
        rect(x + 8, y + 52, 8, 8, deep);
        rect(x + 16, y + 60, 8, 8, deep);
        rect(x + 18, y + 36, 42, 28, ink);
        rect(x + 24, y + 60, 30, 10, ink);
        // Small face, dark glasses, nose and mouth. No portrait image is sampled.
        rect(x + 22, y + 40, 34, 22, skin);
        rect(x + 26, y + 62, 26, 4, skin);
        rect(x + 30, y + 66, 18, 4, skinShadow);
        rect(x + 50, y + 50, 6, 12, skinShadow);
        rect(x + 22, y + 40, 6, 4, ink);
        rect(x + 22, y + 42, 14, 10, ink);
        rect(x + 42, y + 42, 14, 10, ink);
        rect(x + 36, y + 44, 6, 4, ink);
        rect(x + 24, y + 44, 8, 2, deep);
        rect(x + 44, y + 44, 8, 2, deep);
        rect(x + 36, y + 50, 6, 8, skinLight);
        rect(x + 42, y + 54, 4, 4, skinShadow);
        rect(x + 30, y + 62, 12, 2, ink);
        rect(x + 28, y + 56, 6, 2, skinLight);
        // The raised blue visor is a few flat pixel clusters with a copper rim.
        rect(x + 16, y + 14, 56, 28, ink);
        rect(x + 20, y + 16, 48, 24, seam);
        rect(x + 22, y + 18, 44, 20, deep);
        rect(x + 24, y + 20, 40, 14, blue);
        rect(x + 24, y + 20, 32, 2, light);
        rect(x + 26, y + 22, 6, 2, cyan);
        rect(x + 24, y + 28, 2, 4, ink);
      }
      // Square dabs form the joints without smoothing between the pixels.
      function pixelLine(points, size, fill) {
        for (let segment = 1; segment < points.length; segment++) {
          const [ax, ay] = points[segment - 1];
          const [bx, by] = points[segment];
          const steps = Math.max(1, Math.ceil(Math.max(Math.abs(bx - ax), Math.abs(by - ay)) / 2));
          for (let step = 0; step <= steps; step++) {
            const x = Math.round((ax + (bx - ax) * step / steps) / 2) * 2;
            const y = Math.round((ay + (by - ay) * step / steps) / 2) * 2;
            rect(x - size / 2, y - size / 2, size, size, fill);
          }
        }
      }
      function arm(shoulder, joints) {
        const [ex, ey, hx, hy] = joints;
        const points = [shoulder, [ex, ey], [hx, hy]];
        pixelLine(points, 14, ink);
        pixelLine(points, 8, blue);
        pixelLine([shoulder, [ex, ey]], 4, cyan);
        rect(hx - 6, hy - 6, 12, 12, ink);
        rect(hx - 4, hy - 4, 8, 8, skin);
      }
      function leg(hip, joints) {
        const [kx, ky, fx, fy] = joints;
        const points = [hip, [kx, ky], [fx, fy]];
        pixelLine(points, 14, ink);
        pixelLine(points, 8, deep);
        rect(fx - 10, fy - 6, 20, 10, ink);
        rect(fx - 8, fy + 2, 24, 4, ink);
        rect(fx - 6, fy - 4, 12, 4, cyan);
        rect(fx - 6, fy + 2, 18, 2, light);
      }
      const neutral = { headX: 0, headY: 0, bodyY: 110, leftArm: [18, 128, 18, 148], rightArm: [94, 128, 94, 148], leftLeg: [40, 162, 40, 174], rightLeg: [72, 162, 72, 174] };
      playerPoses.forEach((definition, index) => {
        const pose = { ...neutral, ...definition };
        const y = pose.bodyY;
        pen.save();
        pen.translate((index % spriteSize.columns) * frameWidth, Math.floor(index / spriteSize.columns) * frameHeight);
        pen.scale(spriteSize.scale, spriteSize.scale);
        pen.beginPath();
        pen.rect(0, 0, spriteSize.width, spriteSize.height);
        pen.clip();
        pen.imageSmoothingEnabled = false;
        leg([42, y + 36], pose.leftLeg);
        leg([70, y + 36], pose.rightLeg);
        arm([28, y + 8], pose.leftArm);
        if (!pose.frontArm) arm([84, y + 8], pose.rightArm);
        rect(26, y, 60, 42, ink);
        rect(30, y + 4, 52, 34, cyan);
        rect(30, y + 4, 4, 30, light);
        rect(76, y + 4, 6, 34, deep);
        rect(42, y - 10, 28, 14, ink);
        rect(44, y - 8, 4, 10, blue);
        rect(64, y - 8, 4, 10, seam);
        rect(54, y + 4, 4, 34, ink);
        rect(58, y + 4, 2, 34, seam);
        for (const x of [34, 62]) {
          rect(x, y + 12, 14, 16, deep);
          rect(x + 2, y + 14, 10, 10, blue);
          rect(x + 2, y + 12, 10, 2, light);
        }
        drawPixelHead(pose.headX, pose.headY);
        if (pose.frontArm) arm([84, y + 8], pose.rightArm);
        pen.restore();
      });
      screen.imageSmoothingEnabled = false;
      spriteAtlas = atlas;
      spriteContext = screen;
      showPlayerFrame(0);
      player.classList.add('is-framed');
      if (!reducedMotion.matches) paintHero();
    } catch {
      // The CSS pixel character remains visible if canvas is unavailable.
      spriteAtlas = null;
      spriteContext = null;
      player.classList.remove('is-framed');
    }
  }
  const stepDuration = parseFloat(getComputedStyle(root).getPropertyValue('--enter')) || 240;
  let pinned = false;
  let maxX = 0;
  let position = 0;
  let activeCard = -1;
  let offsets = [];
  let stops = [];
  let startY = 0;
  let scrollQueued = false;
  let resizeQueued = false;
  let heroVisible = true;
  let booted = false;
  let stepTimer;
  let manualTargetY = null;
  root.classList.add('js');
  menuButton.hidden = false;

  function setMenu(open, returnFocus = false) {
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuIcon.setAttribute('href', open ? '#close' : '#menu');
    if (returnFocus) menuButton.focus();
    root.style.setProperty('--header-space', header.offsetHeight + 'px');
    scheduleMeasure();
  }
  listen(menuButton, 'click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  listen(menu, 'click', event => {
    const link = event.target.closest('a');
    if (!link || !smallScreen.matches) return;
    setMenu(false);
    const fragment = link.getAttribute('href');
    if (fragment.startsWith('#')) {
      const target = document.getElementById(fragment.slice(1));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  });
  listen(document, 'keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false, true);
  });
  listen(document, 'click', event => {
    if (menu.classList.contains('is-open') && !header.contains(event.target)) setMenu(false);
  });
  listen(header, 'focusout', () => {
    requestFrame(() => {
      if (menu.classList.contains('is-open') && !header.contains(document.activeElement)) setMenu(false);
    });
  });

  function selectCard(index) {
    if (index === activeCard) return;
    activeCard = index;
    cards.forEach((card, i) => card.classList.toggle('is-current', i === activeCard));
  }
  // Native rail scrolling and page scrolling feed this one position state.
  function renderPosition(value) {
    position = clamp(value, 0, maxX);
    if (pinned) track.style.transform = 'translate3d(' + (-position) + 'px,0,0)';
    const fraction = maxX > 0 ? position / maxX : 0;
    progressFill.style.transform = 'scaleX(' + fraction + ')';
    progress.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
    previous.setAttribute('aria-disabled', String(position <= 2));
    next.setAttribute('aria-disabled', String(maxX <= 2 || position >= maxX - 2));
    const focused = cards.findIndex(card => card.contains(document.activeElement));
    const focusedVisible = focused >= 0 && offsets[focused] >= position - 2 && offsets[focused] + cards[focused].offsetWidth <= position + viewport.clientWidth + 2;
    let index = 0;
    if (focusedVisible) index = focused;
    else if (maxX > 0 && position >= maxX - 2) index = cards.length - 1;
    else offsets.forEach((offset, i) => { if (offset <= position + 2) index = i; });
    selectCard(index);
  }
  function clearStep() {
    clearTimeout(stepTimer);
    manualTargetY = null;
    track.classList.remove('is-stepping');
  }
  function paintHero() {
    if (reducedMotion.matches || !heroVisible) return;
    const rect = consoleArt.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const amount = clamp((window.innerHeight * .8 - rect.top) / (rect.height + window.innerHeight * .35), 0, 1);
    consoleArt.style.setProperty('--hill-x', (-amount * 8).toFixed(1) + 'px');
    consoleArt.style.setProperty('--coin-y', (-Math.sin(amount * Math.PI) * 8).toFixed(1) + 'px');

    // Keep the full action within the player's visible travel through the viewport.
    const playerRect = player.getBoundingClientRect();
    const origin = window.scrollY + playerRect.top;
    const start = Math.max(0, origin - window.innerHeight * .68);
    const finish = Math.max(start + 160, origin - header.offsetHeight - 32);
    const progress = clamp((window.scrollY - start) / (finish - start), 0, 1);
    const walk = clamp(progress / .32, 0, 1);
    const stride = progress > .02 && progress < .32 ? Math.round(Math.sin(walk * Math.PI * 6)) * playerMotion.stride : 0;
    const crouch = progress >= .32 && progress < .42 ? Math.sin((progress - .32) / .1 * Math.PI) : 0;
    const flight = clamp((progress - .42) / .3, 0, 1);
    const air = 4 * flight * (1 - flight);
    const landing = clamp((progress - .72) / .12, 0, 1);
    const impact = progress >= .72 && progress < .84 ? Math.sin(landing * Math.PI) : 0;
    const pixel = value => Math.round(value / 2) * 2 + 'px';
    const state = progress < .02 ? 'idle' : progress < .32 ? 'walking' : progress < .42 ? 'crouching' : progress < .72 ? 'jumping' : progress < .84 ? 'landing' : 'greeting';
    const clip = playerClips[state];
    const clipProgress = clamp((progress - clip.start) / (clip.end - clip.start), 0, 1);
    const frameCount = clip.frames.length * (clip.loops || 1);
    const frameStep = Math.min(frameCount - 1, Math.floor(clipProgress * frameCount));
    showPlayerFrame(clip.frames[frameStep % clip.frames.length]);
    const pose = {
      '--bot-x': pixel(playerMotion.travel * (.5 * walk + .5 * flight)),
      '--bot-y': pixel(-air * playerMotion.jump - (stride ? 2 : 0)),
      '--bot-scale-x': (1 + crouch * .08 + impact * .12 - air * .02).toFixed(3),
      '--bot-scale-y': (1 - crouch * .12 - impact * .16 + air * .04).toFixed(3),
      '--head-y': pixel(-air * 2),
      '--foot-left-x': pixel(stride),
      '--foot-right-x': pixel(-stride),
      '--foot-left-y': pixel(-Math.max(0, stride) - air * 4),
      '--foot-right-y': pixel(-Math.max(0, -stride) - air * 4),
      '--arm-left': (air > .1 ? 32 : stride * 4) + 'deg',
      '--arm-right': (air > .1 ? -32 : -stride * 4) + 'deg',
      '--shadow-scale': (1 - air * .45).toFixed(3),
      '--shadow-opacity': (.28 - air * .12).toFixed(3),
      '--dust-x': pixel(landing * 16),
      '--dust-y': pixel(-impact * 8),
      '--dust-opacity': (impact * .6).toFixed(3)
    };
    Object.entries(pose).forEach(([property, value]) => consoleArt.style.setProperty(property, value));
    consoleArt.dataset.playerState = state;
    consoleArt.dataset.phase = String(Math.min(2, Math.floor(progress * 3)));
    if (!booted && playerRect.top < window.innerHeight - 32 && playerRect.bottom > header.offsetHeight) {
      booted = true;
      consoleArt.classList.add('is-booting');
    }
  }
  function updateScroll() {
    scrollQueued = false;
    if (pinned) {
      if (manualTargetY !== null && Math.abs(window.scrollY - manualTargetY) > 2) clearStep();
      renderPosition(window.scrollY - startY);
    }
    paintHero();
  }
  function scheduleScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestFrame(updateScroll);
  }
  function measure() {
    resizeQueued = false;
    const oldFraction = maxX > 0 ? position / maxX : 0;
    const wasPinned = pinned;
    const wasInGallery = wasPinned && window.scrollY >= startY && window.scrollY <= startY + maxX;
    clearStep();
    pinned = false;
    work.classList.remove('is-pinned');
    work.style.removeProperty('height');
    track.style.removeProperty('transform');
    const headerHeight = header.offsetHeight;
    root.style.setProperty('--header-space', headerHeight + 'px');
    maxX = Math.max(0, track.scrollWidth - track.clientWidth);
    // Resolve controls before measuring the complete sticky stage.
    controls.hidden = reducedMotion.matches || maxX <= 2;
    const stageHeight = stage.offsetHeight;
    const firstOffset = cards[0].offsetLeft;
    offsets = cards.map(card => card.offsetLeft - firstOffset);
    stops = [...new Set(offsets.map(value => Math.round(clamp(value, 0, maxX))))];
    if (maxX > 0 && stops[stops.length - 1] < maxX) stops.push(maxX);
    pinned = desktop.matches && !reducedMotion.matches && maxX > 8 && stageHeight + headerHeight + 16 < window.innerHeight;
    if (pinned) {
      work.classList.add('is-pinned');
      work.style.height = (stageHeight + maxX) + 'px';
      track.scrollLeft = 0;
      viewport.scrollLeft = 0;
      startY = window.scrollY + work.getBoundingClientRect().top - headerHeight;
      if (wasInGallery) window.scrollTo({ top: startY + oldFraction * maxX, behavior: 'auto' });
      hint.textContent = 'SCROLL OR USE ARROWS';
      renderPosition(window.scrollY - startY);
    } else {
      hint.textContent = smallScreen.matches ? 'SWIPE OR USE ARROWS' : 'EXPLORE WITH ARROWS';
      track.scrollLeft = clamp(oldFraction * maxX, 0, maxX);
      if (wasInGallery) window.scrollTo({ top: window.scrollY + work.getBoundingClientRect().top - headerHeight, behavior: 'auto' });
      renderPosition(track.scrollLeft);
    }
    if (reducedMotion.matches) {
      consoleArt.removeAttribute('style');
      consoleArt.dataset.phase = '0';
      consoleArt.dataset.playerState = 'idle';
      showPlayerFrame(0);
      consoleArt.classList.remove('is-booting');
    } else paintHero();
  }
  function scheduleMeasure() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestFrame(measure);
  }
  function moveTo(value, animate) {
    const destination = clamp(value, 0, maxX);
    if (pinned) {
      clearStep();
      track.classList.toggle('is-stepping', animate && !reducedMotion.matches);
      manualTargetY = startY + destination;
      // Page position and visual position stay identical after a button press.
      window.scrollTo({ top: manualTargetY, behavior: 'auto' });
      renderPosition(window.scrollY - startY);
      stepTimer = setTimeout(clearStep, stepDuration);
    } else {
      track.scrollTo({ left: destination, behavior: animate && !reducedMotion.matches ? 'smooth' : 'auto' });
      if (!animate || reducedMotion.matches) renderPosition(track.scrollLeft);
    }
  }
  function step(direction) {
    if (direction < 0 && position <= 2 || direction > 0 && position >= maxX - 2) return;
    const destination = direction > 0
      ? stops.find(value => value > position + 2) ?? maxX
      : [...stops].reverse().find(value => value < position - 2) ?? 0;
    moveTo(destination, true);
    announcement.textContent = direction > 0 ? 'Showing more projects.' : 'Showing previous projects.';
  }
  listen(previous, 'click', () => step(-1));
  listen(next, 'click', () => step(1));
  listen(track, 'keydown', event => {
    if (event.target !== track || reducedMotion.matches) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      moveTo(event.key === 'Home' ? 0 : maxX, true);
    }
  });
  listen(track, 'scroll', () => {
    if (!pinned) renderPosition(track.scrollLeft);
  }, { passive: true });
  listen(track, 'focusin', event => {
    const card = event.target.closest('.work-card');
    if (!card || reducedMotion.matches) return;
    const index = cards.indexOf(card);
    const left = offsets[index];
    const right = left + card.offsetWidth;
    if (pinned) { track.scrollLeft = 0; viewport.scrollLeft = 0; }
    if (left < position - 2) moveTo(left, false);
    else if (right > position + viewport.clientWidth + 2) moveTo(right - viewport.clientWidth, false);
    selectCard(index);
  });
  preparePlayerFrames();
  listen(window, 'scroll', scheduleScroll, { passive: true });
  listen(window, 'resize', scheduleMeasure, { passive: true });
  listen(window, 'pageshow', scheduleMeasure);
  listen(reducedMotion, 'change', scheduleMeasure);
  listen(smallScreen, 'change', () => setMenu(false));
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(scheduleMeasure);
    observers.push(resizeObserver);
    [header, document.querySelector('.hero'), document.querySelector('.services'), stage].forEach(element => resizeObserver.observe(element));
  }
  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      consoleArt.classList.toggle('is-offscreen', !heroVisible);
      if (heroVisible) scheduleScroll();
    });
    observers.push(heroObserver);
    heroObserver.observe(consoleArt);
    const revealObserver = new IntersectionObserver(entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion.matches && !entry.target.contains(document.activeElement)) {
          entry.target.style.setProperty('--arrival-delay', 'calc(var(--stagger) * ' + Math.min(order++, 2) + ')');
          entry.target.classList.add('has-arrived');
        }
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    observers.push(revealObserver);
    document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
    const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const sectionIds = ['services', 'work', 'about', 'contact'];
    const visibleSections = new Set();
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleSections.add(entry.target.id);
        else visibleSections.delete(entry.target.id);
      });
      const current = sectionIds.filter(id => visibleSections.has(id)).pop();
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
    observers.push(navObserver);
    sectionIds.forEach(id => navObserver.observe(document.getElementById(id)));
  }
  measure();
  return () => {
    controller.abort();
    observers.forEach(observer => observer.disconnect());
    frames.forEach(cancelAnimationFrame);
    clearStep();
    root.classList.remove('js');
    root.style.removeProperty('--header-space');
    menu.classList.remove('is-open');
    menuButton.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuIcon.setAttribute('href', '#menu');
    work.classList.remove('is-pinned');
    work.style.removeProperty('height');
    track.style.removeProperty('transform');
    cards.forEach(card => card.classList.remove('is-current'));
    controls.hidden = true;
    consoleArt.removeAttribute('style');
    consoleArt.classList.remove('is-booting', 'is-offscreen');
    consoleArt.dataset.phase = '0';
    delete consoleArt.dataset.playerState;
    player.classList.remove('is-framed');
    delete player.dataset.frame;
    document.querySelectorAll('[data-reveal]').forEach(element => {
      element.classList.remove('has-arrived');
      element.style.removeProperty('--arrival-delay');
    });
    document.querySelectorAll('.nav-link').forEach(link => link.removeAttribute('aria-current'));
  };
}
