import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const anatomyRoot = process.env.ANATOMY_ROOT ?? join(homedir(), '.agents/skills/anatomy');
const k = await import(pathToFileURL(join(anatomyRoot, 'kit/iso-kit.mjs')).href);
const dest = fileURLToPath(new URL('../public/assets/projects/', import.meta.url));
mkdirSync(dest, { recursive: true });

const WIDTH = 600;
const HEIGHT = 340;
const PALETTE = {
  '--anatomy-paper': '#f4f6f1',
  '--anatomy-top': '#ffffff',
  '--anatomy-shade-0': '#bcc8be',
  '--anatomy-shade-1': '#d1d9ce',
  '--anatomy-shade-2': '#e0e6dc',
  '--anatomy-shade-3': '#edf0e8',
  '--anatomy-hi': '#334f43',
  '--anatomy-mid': '#788e7d',
  '--anatomy-lo': '#9dac9d',
  '--anatomy-faint': '#cad2c7',
  '--anatomy-lit': '#254e3b',
  '--anatomy-lit-top': '#d9e7d7',
  '--anatomy-lit-shade': '#a8bea8',
  '--anatomy-halo': '#9dac9d',
  '--anatomy-halo-opacity': '.35',
  '--anatomy-dot': '#334f43',
  '--anatomy-weight': '.7px',
};

function scene({ bounds, bottom = -18, top, label, name, azimuth = 48 }) {
  const P = k.fitProjection(k.boxCorners(bounds, bottom, top), WIDTH, HEIGHT, {
    pad: 28,
    azimuth,
    elevation: 30,
  });
  const parts = [];
  const box = (x, y, w, d, z, h, tone = 'mid', lit = false, bevel = 0.45) => {
    const plan = { x, y, w, d, r: Math.min(1.8, w / 5, d / 5) };
    parts.push(k.solidSvg(k.slabOf(plan, z, h, P, 4, bevel), { tone, lit, crease: 'faint' }));
  };
  const dots3 = (points, tone = 'hi', size = 0.62) => {
    parts.push(k.dotsSvg(points.map(([x, y, z]) => k.iso([x, y, z], P)), { tone, size }));
  };
  const closed = (x, y, w, d, z, tone = 'lo') => {
    const plan = { x, y, w, d, r: 1.2 };
    const inset = Math.min(1.3, w / 4, d / 4);
    parts.push(k.lineSvg(k.planOutline(k.insetPlan(plan, inset), z, P, 4), { tone }));
  };
  const topLine = (x1, y1, x2, y2, z, tone = 'lo') => {
    parts.push(k.lineSvg(k.lineOnTop([x1, y1], [x2, y2], z, P), { tone, free: true }));
  };
  const emit = (motion = '') => {
    let svg = k.figureSvg({
      width: WIDTH,
      height: HEIGHT,
      label,
      body: motion ? [`<style>${motion}@media(prefers-reduced-motion:reduce){.moving{animation:none!important}}</style>`, ...parts] : parts,
      standalone: 'light',
      className: `project-object project-object-${name}`,
    });
    const vars = Object.entries(PALETTE).map(([key, value]) => `${key}:${value}`).join(';');
    const openTagEnd = svg.indexOf('>');
    svg = `${svg.slice(0, openTagEnd)} style="${vars}"${svg.slice(openTagEnd)}`;
    const license = readFileSync(join(anatomyRoot, 'LICENSE'), 'utf8');
    writeFileSync(join(dest, `${name}.svg`), `<!-- Anatomy kit styles. ${license} -->\n${svg}`);
    const solids = (svg.match(/class="iso-solid/g) ?? []).length;
    console.log(`${name}.svg: ${solids} solid parts`);
  };
  return { P, parts, box, dots3, closed, topLine, emit };
}

function citadel() {
  // Archive cabinet: frame, four labeled drawers, file folders and one pulled tray.
  const g = scene({
    name: 'citadel',
    label: 'Isometric archive cabinet with four file drawers, organized folders, and one drawer pulled open.',
    bounds: { x: -130, y: -76, w: 260, d: 158, r: 7 },
    top: 130,
  });
  const { box, dots3, closed, parts, emit } = g;
  parts.unshift(`<path class="iso-halo" d="${k.haloOf({ x: -130, y: -76, w: 260, d: 158, r: 7 }, -10, 10, g.P)}"/>`);

  for (const x of [-113, 102]) {
    for (const y of [-58, 54]) box(x, y, 11, 11, -18, 8, 'lo');
  }
  box(-130, -76, 260, 158, -10, 10, 'mid');
  closed(-123, -69, 246, 144, 0, 'lo');

  // Back, side cheeks, front stiles, header and shelf rails form a real cabinet frame.
  box(-100, -48, 200, 8, 1, 119, 'lo');
  box(-106, -40, 9, 86, 0, 124, 'hi');
  box(97, -40, 9, 86, 0, 124, 'hi');
  box(-106, 38, 212, 8, 0, 124, 'mid');
  box(-106, -40, 212, 9, 122, 8, 'hi');
  box(-97, -32, 194, 67, 0, 3, 'lo');
  for (const z of [27, 55, 83, 111]) box(-97, 34, 194, 11, z, 4, 'lo');

  const drawers = [
    { z: 4, y: -32, pull: 15, lit: false },
    { z: 32, y: -32, pull: 15, lit: true },
    { z: 60, y: -32, pull: 15, lit: false },
    { z: 88, y: -21, pull: 26, lit: false },
  ];
  for (const [index, drawer] of drawers.entries()) {
    const y = drawer.y;
    const front = y + 67;
    const frontTone = drawer.lit ? 'hi' : 'mid';
    box(-89, y, 178, 67, drawer.z, 3, 'lo');
    box(-89, y, 7, 67, drawer.z + 2, 12, 'mid');
    box(82, y, 7, 67, drawer.z + 2, 12, 'mid');
    box(-82, y, 164, 6, drawer.z + 2, 12, 'lo');
    box(-89, front - 7, 178, 10, drawer.z + 2, 17, frontTone, drawer.lit);
    // Three file folders sit upright in each open-topped drawer.
    for (let file = 0; file < 3; file += 1) {
      const x = -66 + file * 54;
      const folderY = y + 18 + (file % 2) * 8;
      box(x, folderY, 16, 3, drawer.z + 4, 12 + (file % 2) * 2, file === 1 ? 'hi' : 'mid');
      box(x + 2, folderY + 3, 12, 2, drawer.z + 10, 2, 'lo');
    }
    // Pulls use two feet and a square bar, with a shallow card holder above.
    box(-8, front + 3, 4, 4, drawer.z + 9, 3, 'lo');
    box(4, front + 3, 4, 4, drawer.z + 9, 3, 'lo');
    box(-8, front + 6, 16, 3, drawer.z + 9, 3, 'hi');
    box(-18, front + 2, 36, 2, drawer.z + 14, 3, 'lo');
    closed(-16, front + 1.9, 32, 2, drawer.z + 16, 'faint');
    dots3([[-77, front + 0.8, drawer.z + 10], [77, front + 0.8, drawer.z + 10]], 'hi', 0.55);
    if (index === 3) {
      // Rails beneath the extended drawer show how it slides from the case.
      box(-78, -30, 4, 72, drawer.z - 2, 2, 'hi');
      box(74, -30, 4, 72, drawer.z - 2, 2, 'hi');
    }
  }
  // Cabinet top and corner fasteners finish the case.
  box(-106, -43, 212, 90, 124, 6, 'mid');
  dots3([[-98, -35, 130], [98, -35, 130], [-98, 39, 130], [98, 39, 130]], 'hi');
  emit();
}

function kairen() {
  // DealRail bench: offer tray, terminal, escrow rack, press and receipt tray.
  const g = scene({
    name: 'kairen',
    label: 'Isometric settlement bench with an offer tray, upright terminal, block stamp press, escrow rack, and receipt tray.',
    bounds: { x: -148, y: -96, w: 296, d: 192, r: 7 },
    top: 128,
  });
  const { box, dots3, closed, topLine, parts, emit } = g;
  parts.unshift(`<path class="iso-halo" d="${k.haloOf({ x: -148, y: -96, w: 296, d: 192, r: 7 }, -9, 9, g.P)}"/>`);

  for (const x of [-129, 116]) for (const y of [-76, 64]) box(x, y, 13, 12, -18, 8, 'lo');
  box(-148, -96, 296, 192, -10, 10, 'mid');
  closed(-141, -89, 282, 178, 0);

  // A raised terminal holds a blank display, control shelf and rectangular keys.
  box(-52, -83, 104, 36, 0, 48, 'lo');
  box(-46, -80, 92, 7, 47, 4, 'hi');
  box(-42, -72, 84, 5, 16, 27, 'hi', true);
  box(-38, -66, 76, 2, 20, 19, 'lo');
  closed(-38, -66, 76, 2, 38, 'faint');
  box(-42, -46, 84, 9, 11, 4, 'mid');
  for (let key = 0; key < 7; key += 1) box(-34 + key * 11, -43, 6, 4, 6, 3, key === 3 ? 'hi' : 'lo');
  dots3([[-46, -70, 44], [46, -70, 44], [-46, -46, 44], [46, -46, 44]], 'hi', 0.55);

  // The press frame stands over one work card. Its square platen hangs above the tray.
  box(-30, -2, 10, 15, 2, 72, 'hi');
  box(20, -2, 10, 15, 2, 72, 'hi');
  box(-34, -5, 68, 21, 72, 10, 'mid');
  box(-11, -1, 22, 13, 49, 24, 'hi', true);
  box(-8, 2, 16, 10, 42, 7, 'lo');
  box(-18, 15, 36, 17, 31, 6, 'hi');
  box(-25, 30, 50, 36, 4, 3, 'lo');
  for (const x of [-25, 18]) box(x, 30, 7, 36, 7, 15, 'mid');
  box(-18, 59, 36, 7, 7, 15, 'lo');
  box(-13, 38, 26, 23, 8, 1, 'faint');
  topLine(-8, 44, 8, 44, 9, 'lo');
  topLine(-8, 50, 4, 50, 9, 'lo');
  dots3([[-25, 32, 18], [25, 32, 18], [-25, 62, 18], [25, 62, 18]], 'hi', 0.56);

  // Offer tray holds short task slips on the left side of the work surface.
  box(-132, 10, 70, 63, 3, 3, 'lo');
  box(-132, 10, 5, 63, 6, 12, 'mid');
  box(-67, 10, 5, 63, 6, 12, 'mid');
  box(-127, 10, 65, 5, 6, 12, 'lo');
  box(-127, 68, 65, 5, 6, 12, 'lo');
  for (let slip = 0; slip < 4; slip += 1) {
    box(-121 + slip * 4, 21 + slip * 2, 44, 34, 7 + slip * 1.3, 1.4, slip === 2 ? 'hi' : 'faint');
    topLine(-113 + slip * 4, 30 + slip * 2, -87 + slip * 4, 30 + slip * 2, 8.5 + slip * 1.3, 'lo');
  }

  // The right rack holds a sealed settlement packet and finished receipts.
  box(65, 10, 69, 63, 3, 3, 'lo');
  box(65, 10, 5, 63, 6, 12, 'mid');
  box(129, 10, 5, 63, 6, 12, 'mid');
  box(70, 10, 59, 5, 6, 12, 'lo');
  box(70, 68, 59, 5, 6, 12, 'lo');
  box(79, 20, 39, 38, 7, 2, 'hi', true);
  box(83, 23, 31, 32, 9, 1, 'faint');
  topLine(88, 31, 107, 31, 10, 'mid');
  topLine(88, 38, 103, 38, 10, 'lo');
  topLine(88, 45, 108, 45, 10, 'lo');
  for (let receipt = 0; receipt < 3; receipt += 1) {
    box(82 + receipt * 3, 59 + receipt * 2, 34, 9, 7 + receipt, 1.1, 'mid');
  }
  // Small square escrow rack at the back keeps the sealed packet off the paper path.
  box(68, -35, 61, 25, 0, 24, 'lo');
  box(73, -29, 51, 19, 24, 3, 'mid');
  for (let slot = 0; slot < 3; slot += 1) {
    box(77 + slot * 15, -25, 10, 12, 27, 3, slot === 1 ? 'hi' : 'mid');
    box(79 + slot * 15, -22, 6, 2, 30, 9, 'lo');
  }
  dots3([[73, -30, 25], [124, -30, 25], [73, -11, 25], [124, -11, 25]], 'hi', 0.55);
  emit();
}

function intentVault() {
  // Secure appliance: vented compute sleds, tamper bars and a supported shield panel.
  const g = scene({
    name: 'intentvault',
    label: 'Isometric private-computation appliance with vented compute sleds, tamper bars, and a removable side shield on its stand.',
    bounds: { x: -132, y: -78, w: 264, d: 164, r: 7 },
    top: 104,
  });
  const { box, dots3, closed, parts, emit } = g;
  parts.unshift(`<path class="iso-halo" d="${k.haloOf({ x: -132, y: -78, w: 264, d: 164, r: 7 }, -10, 10, g.P)}"/>`);

  for (const x of [-113, 82]) for (const y of [-58, 58]) box(x, y, 20, 14, -18, 8, 'lo');
  box(-132, -78, 264, 164, -10, 10, 'mid');
  closed(-124, -70, 248, 148, 0);

  // Open rails and a back shield expose the compute sleds without a product screen.
  box(-94, -48, 9, 88, 0, 82, 'hi');
  box(85, -48, 9, 88, 0, 82, 'hi');
  box(-85, -48, 170, 9, 75, 9, 'lo');
  box(-85, -48, 170, 9, 0, 7, 'lo');
  box(-84, -39, 168, 5, 6, 72, 'faint');

  for (const [row, z] of [12, 34, 56].entries()) {
    box(-78, -32, 156, 67, z, 13, row === 1 ? 'hi' : 'mid', row === 1);
    box(-73, 30, 146, 9, z + 2, 8, row === 1 ? 'hi' : 'lo', row === 1);
    // Vents are short solid slots, each tied to the face of its sled.
    for (let vent = 0; vent < 8; vent += 1) box(-61 + vent * 16, 39, 9, 2, z + 5, 2, 'lo', false, 0.15);
    // Captive pull tabs, fastener dots and recessed service-card plates identify each sled.
    box(-10, 40, 20, 4, z + 3, 3, 'hi');
    box(-66, 37, 20, 2, z + 3, 4, 'faint');
    box(46, 37, 20, 2, z + 3, 4, 'faint');
    dots3([[-68, 40, z + 10], [68, 40, z + 10]], 'hi', 0.54);
  }

  // Two blank tamper bars cross the service seam. Their tabs rest on the cabinet face.
  for (const z of [9, 75]) {
    box(-86, 44, 172, 5, z, 3, 'lo');
    box(-90, 43, 6, 7, z - 1, 5, 'hi');
    box(84, 43, 6, 7, z - 1, 5, 'hi');
    dots3([[-87, 48, z + 1], [87, 48, z + 1]], 'hi', 0.52);
  }

  // A removed shield stands in two feet beside the appliance.
  box(101, -1, 27, 8, 0, 4, 'lo');
  box(102, 1, 6, 6, 4, 4, 'mid');
  box(120, 1, 6, 6, 4, 4, 'mid');
  box(101, 0, 27, 7, 8, 70, 'hi', true);
  box(105, 7, 19, 2, 17, 42, 'mid');
  for (let mark = 0; mark < 5; mark += 1) box(108, 10 + mark * 7, 13, 2, 21, 2, 'lo', false, 0.15);
  dots3([[104, 4, 13], [124, 4, 13], [104, 4, 71], [124, 4, 71]], 'hi', 0.55);

  // Short side vents and top retainers show the case was made for a sealed module.
  for (let vent = 0; vent < 7; vent += 1) box(-104, -32 + vent * 10, 6, 5, 18, 2, 'lo', false, 0.15);
  for (const x of [-76, 67]) box(x, -42, 9, 8, 84, 5, 'mid');
  box(-82, -46, 164, 5, 89, 5, 'lo');
  dots3([[-78, -40, 94], [78, -40, 94], [-78, -2, 94], [78, -2, 94]], 'hi', 0.55);
  emit();
}

function agentsmith() {
  // Skill bench: catalog cubbies, reusable cards, a slotted tool rack and work trays.
  const g = scene({
    name: 'agentsmith',
    label: 'Isometric workshop bench with organized skill cards, reusable template folders, a slotted tool rack, and sorted work trays.',
    bounds: { x: -148, y: -94, w: 296, d: 188, r: 7 },
    top: 118,
  });
  const { box, dots3, closed, topLine, parts, emit } = g;
  parts.unshift(`<path class="iso-halo" d="${k.haloOf({ x: -148, y: -94, w: 296, d: 188, r: 7 }, -10, 10, g.P)}"/>`);

  for (const x of [-129, 116]) for (const y of [-74, 62]) box(x, y, 13, 12, -18, 8, 'lo');
  box(-148, -94, 296, 188, -10, 10, 'mid');
  closed(-141, -87, 282, 174, 0);

  // Backboard and rails make this an organizer bench, not another storage cabinet.
  box(-126, -75, 252, 8, 0, 78, 'lo');
  box(-130, -79, 260, 8, 76, 7, 'hi');
  box(-130, -78, 8, 12, 0, 80, 'mid');
  box(122, -78, 8, 12, 0, 80, 'mid');
  for (const z of [24, 49]) box(-122, -66, 244, 5, z, 3, 'faint');
  dots3([[-122, -70, 72], [122, -70, 72], [-122, -68, 6], [122, -68, 6]], 'hi', 0.55);

  // Four cubbies hold upright work cards, with real floors, dividers and front lips.
  for (let cubby = 0; cubby < 4; cubby += 1) {
    const x = -116 + cubby * 59;
    box(x, -64, 53, 35, 27, 3, 'mid');
    box(x, -64, 4, 35, 30, 20, 'lo');
    box(x + 49, -64, 4, 35, 30, 20, 'lo');
    box(x, -64, 53, 4, 30, 20, 'lo');
    box(x, -33, 53, 4, 30, 8, 'hi');
    for (let card = 0; card < 3; card += 1) {
      const cardX = x + 9 + card * 12;
      box(cardX, -56 + card * 2, 9, 2, 33, 14 + (card % 2) * 3, card === 1 ? 'hi' : 'faint');
      box(cardX + 1.5, -53 + card * 2, 6, 2, 38, 2, 'lo');
    }
    dots3([[x + 4, -31, 35], [x + 49, -31, 35]], 'hi', 0.5);
  }

  // A right-hand tool board carries square pegs and short holders for reusable tools.
  box(79, -51, 39, 6, 30, 42, 'mid');
  box(83, -44, 5, 8, 34, 33, 'lo');
  box(96, -44, 5, 8, 34, 33, 'lo');
  box(109, -44, 5, 8, 34, 33, 'lo');
  for (let row = 0; row < 3; row += 1) {
    const z = 38 + row * 10;
    for (let col = 0; col < 3; col += 1) {
      const x = 82 + col * 13;
      box(x, -36, 7, 7, z, 2, (row + col) % 4 === 0 ? 'hi' : 'lo');
    }
  }
  box(76, -35, 45, 7, 28, 4, 'lo');

  // Low front trays separate draft cards, templates and finished workflow sheets.
  const trays = [
    { x: -132, tone: 'mid', lit: false },
    { x: -43, tone: 'hi', lit: true },
    { x: 46, tone: 'mid', lit: false },
  ];
  for (const [index, tray] of trays.entries()) {
    const x = tray.x;
    box(x, 4, 80, 66, 3, 3, 'lo');
    box(x, 4, 5, 66, 6, 10, 'mid');
    box(x + 75, 4, 5, 66, 6, 10, 'mid');
    box(x + 5, 4, 70, 5, 6, 10, 'lo');
    box(x + 5, 65, 70, 5, 6, 10, 'lo');
    for (let sheet = 0; sheet < 4; sheet += 1) {
      const y = 14 + sheet * 3;
      box(x + 11 + sheet * 2, y, 52, 42, 7 + sheet, 1, sheet === 2 ? tray.tone : 'faint', sheet === 2 && tray.lit);
      topLine(x + 18, y + 10, x + 49, y + 10, 8 + sheet, 'lo');
      topLine(x + 18, y + 17, x + 42, y + 17, 8 + sheet, 'faint');
    }
    // Index tabs are clipped to the front face of each tray.
    box(x + 28, 69, 24, 3, 7, 5, tray.lit ? 'hi' : 'lo');
    dots3([[x + 8, 8, 13], [x + 72, 8, 13]], 'hi', 0.52);
    if (index === 1) closed(x + 29, 70, 22, 2, 10, 'faint');
  }

  // Side drawers and a narrow template rack sit under the backboard.
  for (const x of [-119, 84]) {
    box(x, -10, 35, 14, 3, 19, 'lo');
    box(x + 3, 5, 29, 4, 7, 11, 'mid');
    box(x + 14, 9, 8, 3, 12, 3, 'hi');
    dots3([[x + 3, 8, 13], [x + 32, 8, 13]], 'hi', 0.5);
  }
  box(-34, -71, 68, 4, 79, 7, 'mid');
  for (let tag = 0; tag < 5; tag += 1) box(-28 + tag * 12, -67, 7, 2, 83, 5, 'hi');
  emit();
}

citadel();
kairen();
intentVault();
agentsmith();

function falconOS() {
  // Evidence console: bolted chassis, three signal modules, and a sliding risk gate.
  const g = scene({ name: 'falconos', label: 'Isometric risk-check console with three evidence modules and a moving verification gate.', bounds: { x: -122, y: -70, w: 244, d: 140, r: 5 }, top: 92 });
  const { box, closed, dots3, parts, emit } = g;
  for (const x of [-110, 98]) for (const y of [-58, 47]) box(x, y, 12, 12, -15, 7, 'lo');
  box(-122, -70, 244, 140, -8, 8, 'mid');
  closed(-116, -64, 232, 128, 0);
  for (const x of [-103, -28, 47]) {
    box(x, -47, 58, 78, 0, 9, 'mid');
    box(x + 4, -43, 50, 70, 9, 39, 'mid');
    box(x + 8, -39, 42, 62, 48, 3, 'hi');
    closed(x + 9, -38, 40, 60, 51);
    for (let i = 0; i < 5; i++) box(x + 13, -32 + i * 9, 30, 3, 51, 1, 'lo');
    for (let i = 0; i < 3; i++) box(x + 10 + i * 14, 28, 9, 5, 13, 5, 'hi', i === 1);
    dots3([[x + 8, -39, 52], [x + 49, -39, 52], [x + 8, 21, 52], [x + 49, 21, 52]], 'hi', .6);
  }
  for (const y of [-58, 43]) {
    box(-112, y, 224, 7, 55, 5, 'mid');
    for (const x of [-112, 104]) box(x, y, 8, 7, 0, 55, 'mid');
  }
  // Gate rides along the x rails; its short travel stays inside the chassis.
  parts.push('<g class="moving evidence-gate">');
  box(-97, -60, 12, 112, 60, 5, 'hi', true);
  for (const y of [-61, 42]) box(-101, y, 20, 12, 57, 11, 'hi');
  box(-96, -20, 10, 32, 65, 12, 'hi', true);
  parts.push('</g>');
  const a = k.iso([0, 0, 0], g.P), b = k.iso([180, 0, 0], g.P);
  emit(`.evidence-gate{animation:evidence-pass 7s ease-in-out infinite}@keyframes evidence-pass{0%,15%,100%{transform:translate(0,0)}50%,65%{transform:translate(${b[0]-a[0]}px,${b[1]-a[1]}px)}}`);
}

function fundwise() {
  // Shared-payment sorter: three receipt trays, a divider rack, and a payout drawer.
  const g = scene({ name: 'fundwise', label: 'Isometric shared-payment sorter with three receipt trays and a moving settlement drawer.', bounds: { x: -125, y: -72, w: 250, d: 160, r: 5 }, top: 84 });
  const { box, closed, dots3, parts, emit } = g;
  for (const x of [-112, 99]) for (const y of [-59, 62]) box(x, y, 13, 13, -15, 7, 'lo');
  box(-125, -72, 250, 148, -8, 8, 'mid');
  closed(-119, -66, 238, 136, 0);
  box(-113, -59, 226, 9, 0, 72, 'mid');
  for (const x of [-113, 105]) box(x, -50, 8, 110, 0, 45, 'mid');
  for (const x of [-97, -29, 39]) {
    box(x, -42, 58, 67, 0, 6, 'mid');
    for (const side of [0, 54]) box(x + side, -42, 4, 67, 6, 18, 'mid');
    box(x + 4, -42, 50, 4, 6, 18, 'mid');
    for (let sheet = 0; sheet < 3; sheet++) {
      box(x + 8, -33 + sheet * 2, 42, 45, 6 + sheet * 2, 1.5, 'hi');
      closed(x + 10, -31 + sheet * 2, 38, 41, 7.5 + sheet * 2, 'faint');
    }
    box(x + 19, 22, 20, 6, 6, 6, 'hi');
    box(x + 18, -50, 22, 3, 54, 11, 'hi');
    dots3([[x + 6, -45, 66], [x + 51, -45, 66]], 'hi', .6);
  }
  box(-106, 35, 212, 26, 0, 6, 'lo');
  parts.push('<g class="moving payout-drawer">');
  box(-99, 35, 198, 25, 6, 5, 'mid');
  box(-99, 57, 198, 5, 6, 15, 'hi');
  box(-20, 62, 40, 5, 11, 6, 'hi', true);
  for (let i = 0; i < 4; i++) box(-72 + i * 38, 39, 28, 14, 11, 3, 'hi');
  parts.push('</g>');
  const a = k.iso([0, 0, 0], g.P), b = k.iso([0, 14, 0], g.P);
  emit(`.payout-drawer{animation:shared-settlement 5s ease-in-out infinite}@keyframes shared-settlement{0%,15%,100%{transform:translate(0,0)}45%,65%{transform:translate(${b[0]-a[0]}px,${b[1]-a[1]}px)}}`);
}

falconOS();
fundwise();

function lastLight() {
  // Two-player tabletop arcade: a cabinet, recessed board, controls, and moving player piece.
  const g = scene({ name: 'lastlight', label: 'Isometric two-player tabletop arcade with a moving player piece on a recessed game board.', bounds: { x: -116, y: -78, w: 232, d: 156, r: 6 }, top: 68 });
  const { box, closed, dots3, parts, emit } = g;
  for (const x of [-101, 88]) for (const y of [-63, 50]) box(x, y, 13, 13, -16, 9, 'lo');
  box(-116, -78, 232, 156, -7, 8, 'mid');
  box(-108, -70, 216, 140, 1, 31, 'mid');
  for (const x of [-108, 102]) box(x, -70, 6, 140, 32, 9, 'hi');
  for (const y of [-70, 64]) box(-102, y, 204, 6, 32, 9, 'hi');
  box(-74, -46, 148, 92, 32, 3, 'lo');
  closed(-72, -44, 144, 88, 35, 'hi');
  // The grid is made of shallow inlaid tiles inside the board, not floating marks.
  for (let row = 0; row < 4; row++) for (let column = 0; column < 6; column++) {
    box(-66 + column * 22, -38 + row * 20, 20, 18, 35, .7, 'lo');
  }
  for (const x of [-100, 78]) {
    box(x, -41, 22, 82, 32, 4, 'mid');
    box(x + 6, -27, 10, 13, 36, 2, 'lo');
    box(x + 9, -24, 4, 7, 38, 12, 'hi');
    box(x + 5, -27, 12, 13, 50, 5, 'hi');
    for (let button = 0; button < 3; button++) box(x + 6, 5 + button * 10, 10, 7, 36, 3, 'hi', button === 1);
  }
  for (const y of [-65, 52]) {
    box(-22, y, 44, 10, 32, 3, 'mid');
    for (let lamp = 0; lamp < 4; lamp++) box(-16 + lamp * 9, y + 3, 5, 4, 35, 1, 'hi');
  }
  dots3([[-103, -65, 41], [104, -65, 41], [-103, 65, 41], [104, 65, 41]], 'hi', .65);
  // A small opponent stays at the far end of the board.
  box(40, 23, 14, 12, 36, 5, 'hi');
  box(43, 25, 8, 8, 41, 5, 'mid');
  parts.push('<g class="moving player-piece">');
  box(-57, -29, 14, 12, 36, 5, 'hi', true);
  box(-54, -27, 8, 8, 41, 5, 'hi', true);
  parts.push('</g>');
  const a = k.iso([0, 0, 0], g.P), b = k.iso([66, 20, 0], g.P);
  emit(`.player-piece{animation:lastlight-play 6s ease-in-out infinite}@keyframes lastlight-play{0%,15%,100%{transform:translate(0,0)}45%,65%{transform:translate(${b[0]-a[0]}px,${b[1]-a[1]}px)}}`);
}

lastLight();
