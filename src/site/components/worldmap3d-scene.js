import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { geoPath, geoNaturalEarth1, geoCentroid, geoArea } from 'd3-geo';
import { feature } from 'topojson-client';
import topology from 'world-atlas/countries-110m.json';

// Tokens from src/app.css and app/globals.css.
const C = {
  land: 0x234454, // navy-800, a step lighter than the navy-900 section
  worked: 0x407c9b, // sea-500
  office: 0xff7816, // orange-500
  arc: 0xf9b233, // sun-400
  sky: 0xa3c0d0, // navy-200
  ground: 0x1a3340, // navy-900
  light: 0xfdfaf4 // cream-50
};

const W = 100;
const LAND_H = 0.35;
const WORKED_H = 1.6;
const OFFICE_H = 2.4;
const INTRO_MS = 2400;
const RISE_MS = 900;
const FOV = 28;
const E0 = 85; // camera elevation at the start of the intro, degrees
const E1 = 55; // final elevation: the map tilts 35 degrees from top-down
const rad = (d) => (d * Math.PI) / 180;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (v) => 1 - Math.pow(1 - clamp01(v), 3);

function buildProjection() {
  const projection = geoNaturalEarth1().fitWidth(W, { type: 'Sphere' });
  const [[, y0], [, y1]] = geoPath(projection).bounds({ type: 'Sphere' });
  const [tx, ty] = projection.translate();
  projection.translate([tx - W / 2, ty - (y0 + y1) / 2]);
  return projection;
}

function extrudedGeometry(projection, f, depth) {
  const sp = new THREE.ShapePath();
  const ctx = {
    moveTo: (x, y) => sp.moveTo(x, -y),
    lineTo: (x, y) => sp.lineTo(x, -y),
    closePath() {}
  };
  geoPath(projection, ctx)(f);
  const shapes = sp.toShapes();
  if (!shapes.length) return null;
  const g = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: false });
  g.rotateX(-Math.PI / 2); // extrusion now points up; screen y becomes world z
  return g;
}

function largestCentroid(projection, f) {
  const g = f.geometry;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  let best = polys[0];
  let bestArea = -1;
  for (const coordinates of polys) {
    const a = geoArea({ type: 'Polygon', coordinates });
    if (a > bestArea) {
      bestArea = a;
      best = coordinates;
    }
  }
  const [x, y] = projection(geoCentroid({ type: 'Polygon', coordinates: best }));
  return new THREE.Vector3(x, 0, y);
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function createScene({ stage, host, tooltip, countries, reduced, onFirstFrame }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 2, 1, 600);
  scene.add(new THREE.HemisphereLight(C.sky, C.ground, 1.6));
  const sun = new THREE.DirectionalLight(C.light, 2.2);
  sun.position.set(-40, 80, 50);
  scene.add(sun);

  const projection = buildProjection();
  const lookup = new Map(countries.map((c) => [String(Number(c.id)), c]));
  const feats = feature(topology, topology.objects.countries).features.filter(
    (f) => Number(f.id) !== 10 // Antarctica
  );

  const [[bx0, bz0], [bx1, bz1]] = geoPath(projection).bounds({ type: 'FeatureCollection', features: feats });

  // Land the team has not worked in: one merged geometry.
  const landGeos = [];
  const entities = [];
  for (const f of feats) {
    const match = lookup.get(String(Number(f.id)));
    if (!match) {
      const g = extrudedGeometry(projection, f, LAND_H);
      if (g) landGeos.push(g);
      continue;
    }
    const g = extrudedGeometry(projection, f, 1);
    if (!g) continue;
    const color = match.office ? C.office : C.worked;
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0,
      roughness: 0.7,
      metalness: 0
    });
    const mesh = new THREE.Mesh(g, mat);
    const height = match.office ? OFFICE_H : WORKED_H;
    mesh.scale.y = 0.001;
    scene.add(mesh);
    entities.push({
      name: match.name,
      office: match.office,
      mesh,
      mat,
      height,
      c: largestCentroid(projection, f),
      delay: 0,
      lift: 0,
      hover: 0
    });
  }
  const landGeo = mergeGeometries(landGeos, false);
  landGeos.forEach((g) => g.dispose());
  const landMat = new THREE.MeshStandardMaterial({ color: C.land, roughness: 0.9, metalness: 0 });
  scene.add(new THREE.Mesh(landGeo, landMat));

  // Arcs from the nearest office, beacons on the offices.
  const offices = entities.filter((e) => e.office);
  const glow = glowTexture();
  const extras = [glow];
  const arcs = [];
  const beacons = [];
  let maxD = 1;
  for (const e of entities) {
    if (e.office || !offices.length) continue;
    let near = offices[0];
    for (const o of offices) if (o.c.distanceTo(e.c) < e.c.distanceTo(near.c)) near = o;
    e.near = near;
    e.dist = near.c.distanceTo(e.c);
    maxD = Math.max(maxD, e.dist);
  }
  for (const e of entities) {
    if (e.office) continue;
    e.delay = ((e.dist || 0) / maxD) * 1600;
    if (!e.near) continue;
    const from = new THREE.Vector3(e.near.c.x, OFFICE_H + 0.1, e.near.c.z);
    const to = new THREE.Vector3(e.c.x, WORKED_H + 0.1, e.c.z);
    const mid = from.clone().lerp(to, 0.5);
    mid.y += 3 + e.dist * 0.26;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const SEG = 40;
    const RAD = 4;
    const tube = new THREE.TubeGeometry(curve, SEG, 0.07, RAD, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: C.arc,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });
    const tubeMesh = new THREE.Mesh(tube, tubeMat);
    scene.add(tubeMesh);
    const dotMat = new THREE.SpriteMaterial({
      map: glow,
      color: C.arc,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const dot = new THREE.Sprite(dotMat);
    dot.scale.setScalar(1.0);
    dot.visible = false;
    scene.add(dot);
    arcs.push({
      e,
      curve,
      tube,
      tubeMesh,
      dot,
      SEG,
      RAD,
      phase: Math.random(),
      speed: 0.09 + Math.random() * 0.05
    });
  }
  for (const o of offices) {
    const h = 16;
    const bg = new THREE.CylinderGeometry(0.12, 0.12, h, 8, 1, true);
    const pos = bg.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const orange = new THREE.Color(C.office);
    for (let i = 0; i < pos.count; i++) {
      const k = 1 - (pos.getY(i) + h / 2) / h;
      col.set([orange.r * k, orange.g * k, orange.b * k], i * 3);
    }
    bg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const bm = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beam = new THREE.Mesh(bg, bm);
    beam.position.set(o.c.x, OFFICE_H + h / 2, o.c.z);
    scene.add(beam);
    const rg = new THREE.RingGeometry(1, 1.25, 48);
    rg.rotateX(-Math.PI / 2);
    const rm = new THREE.MeshBasicMaterial({
      color: C.office,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring = new THREE.Mesh(rg, rm);
    ring.position.set(o.c.x, OFFICE_H + 0.08, o.c.z);
    scene.add(ring);
    beacons.push({ o, beam, bm, ring, rm, phase: Math.random() });
  }

  // Camera
  let width = 1;
  let height = 1;
  let pointerX = 0;
  let pointerY = 0;
  let px = 0;
  let py = 0;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  // Fit: place a probe camera so the land bounding box fills the canvas
  // width (3% margin) and sits centred, at any aspect.
  const probe = new THREE.PerspectiveCamera(FOV, 1, 1, 600);
  // Hull-ish sample of the real land outline: extreme points per column and
  // per row bucket. Tighter than the bounding box corners, which overstate the
  // near edge under perspective.
  const corners = [];
  {
    const N = 48;
    const cols = Array.from({ length: N }, () => [Infinity, -Infinity, null, null]);
    const rows = Array.from({ length: N }, () => [Infinity, -Infinity, null, null]);
    const visit = (ring) => {
      for (const ll of ring) {
        const pt = projection(ll);
        if (!pt) continue;
        const [x, z] = pt;
        const ci = Math.min(N - 1, Math.max(0, Math.floor(((x - bx0) / (bx1 - bx0)) * N)));
        const ri = Math.min(N - 1, Math.max(0, Math.floor(((z - bz0) / (bz1 - bz0)) * N)));
        if (z < cols[ci][0]) { cols[ci][0] = z; cols[ci][2] = pt; }
        if (z > cols[ci][1]) { cols[ci][1] = z; cols[ci][3] = pt; }
        if (x < rows[ri][0]) { rows[ri][0] = x; rows[ri][2] = pt; }
        if (x > rows[ri][1]) { rows[ri][1] = x; rows[ri][3] = pt; }
      }
    };
    for (const f of feats) {
      const g = f.geometry;
      const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
      // Skip specks (Fiji straddles the antimeridian and would pin both edges).
      for (const poly of polys) {
        if (geoArea({ type: 'Polygon', coordinates: poly }) > 0.003) visit(poly[0]);
      }
    }
    for (const b of [...cols, ...rows]) {
      for (const pt of [b[2], b[3]]) {
        if (!pt) continue;
        corners.push(new THREE.Vector3(pt[0], 0, pt[1]), new THREE.Vector3(pt[0], OFFICE_H, pt[1]));
      }
    }
  }
  const cx = (Math.min(...corners.map((c) => c.x)) + Math.max(...corners.map((c) => c.x))) / 2;
  const cz = (Math.min(...corners.map((c) => c.z)) + Math.max(...corners.map((c) => c.z))) / 2;
  const v = new THREE.Vector3();
  const fitCache = new Map();
  const fitFor = (elev) => {
    const key = `${elev}|${width}|${height}`;
    if (fitCache.has(key)) return fitCache.get(key);
    probe.aspect = width / height;
    probe.updateProjectionMatrix();
    const e = rad(elev);
    const dir = new THREE.Vector3(0, Math.sin(e), Math.cos(e));
    const target = new THREE.Vector3(cx, 0, cz);
    let dist = 100;
    const extents = () => {
      probe.position.copy(target).addScaledVector(dir, dist);
      probe.lookAt(target);
      probe.updateMatrixWorld(true);
      let mx = 0;
      let xlo = Infinity;
      let xhi = -Infinity;
      let lo = Infinity;
      let hi = -Infinity;
      for (const c of corners) {
        v.copy(c).project(probe);
        mx = Math.max(mx, Math.abs(v.x));
        xlo = Math.min(xlo, v.x);
        xhi = Math.max(xhi, v.x);
        lo = Math.min(lo, v.y);
        hi = Math.max(hi, v.y);
      }
      return { mx, lo, hi, xlo, xhi };
    };
    for (let pass = 0; pass < 3; pass++) {
      let lo = 10;
      let hi = 800;
      for (let i = 0; i < 30; i++) {
        dist = (lo + hi) / 2;
        const x = extents();
        const fits = x.mx <= 0.97 && Math.max(Math.abs(x.lo), Math.abs(x.hi)) <= 0.97;
        if (fits) hi = dist; else lo = dist;
      }
      dist = hi;
      const x = extents();
      const shift = ((x.lo + x.hi) / 2) * dist * Math.tan(rad(FOV / 2));
      target.addScaledVector(probe.up.clone().applyQuaternion(probe.quaternion), shift);
      const shiftX = ((x.xlo + x.xhi) / 2) * dist * Math.tan(rad(FOV / 2)) * probe.aspect;
      target.addScaledVector(new THREE.Vector3(1, 0, 0).applyQuaternion(probe.quaternion), shiftX);
    }
    const out = { dist, target };
    fitCache.clear();
    fitCache.set(key, out);
    return out;
  };
  const placeCamera = (p, now) => {
    const k = easeOut(p);
    const elev = E0 + (E1 - E0) * k;
    const { dist, target } = fitFor(elev);
    let a = 0;
    let el = elev;
    if (!reduced) {
      px += (pointerX - px) * 0.05;
      py += (pointerY - py) * 0.05;
      a = rad(2.5) * Math.sin(now / 3800) * k + rad(3) * px;
      el += 1.2 * Math.sin(now / 5200) * k - 1.5 * py;
    }
    const e = rad(el);
    camera.position.set(
      target.x + dist * Math.cos(e) * Math.sin(a),
      target.y + dist * Math.sin(e),
      target.z + dist * Math.cos(e) * Math.cos(a)
    );
    camera.lookAt(target);
  };

  // Progress of the intro. Reduced motion jumps to the end.
  let introStart = reduced ? -Infinity : null;
  const introP = (now) => (introStart === null ? 0 : clamp01((now - introStart) / INTRO_MS));

  function update(now) {
    const p = introP(now);
    placeCamera(p, now);
    const since = introStart === null ? -1 : now - introStart;
    for (const e of entities) {
      const rise = reduced ? 1 : easeOut((since - e.delay) / RISE_MS);
      e.e_rise = rise;
      e.hover += ((e.lift ? 1 : 0) - e.hover) * (reduced ? 1 : 0.18);
      e.mesh.scale.y = Math.max(0.001, e.height * rise + e.hover * 0.6);
      e.mat.emissiveIntensity = e.hover * 0.35;
    }
    for (const a of arcs) {
      const drawn = reduced ? 1 : clamp01((since - a.e.delay - RISE_MS * 0.6) / 1100);
      a.tubeMesh.visible = drawn > 0;
      a.tube.setDrawRange(0, Math.floor(drawn * a.SEG) * a.RAD * 6);
      if (reduced) {
        a.dot.visible = false;
      } else {
        a.dot.visible = drawn >= 1;
        if (a.dot.visible) {
          a.curve.getPoint(((now / 1000) * a.speed + a.phase) % 1, a.dot.position);
        }
      }
    }
    for (const b of beacons) {
      const r = b.o.e_rise ?? 0;
      const pulse = reduced ? 0.7 : 0.75 + 0.25 * Math.sin(now / 500 + b.phase * 6);
      b.bm.opacity = r * pulse * 0.6;
      const k = reduced ? 0.3 : ((now / 2400) + b.phase) % 1;
      b.ring.scale.setScalar(1 + k * 3.2);
      b.rm.opacity = r * (1 - k) * 0.8;
    }
  }

  function draw(now) {
    update(now);
    renderer.render(scene, camera);
  }

  // Sizing
  const resize = () => {
    const r = stage.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (!running) draw(performance.now());
  };

  // Loop control: runs only while the stage is on screen and the tab is visible.
  let running = false;
  let inView = false;
  let raf = 0;
  const loop = (now) => {
    if (!running) return;
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const want = inView && !document.hidden && !reduced;
    if (want && !running) {
      running = true;
      raf = requestAnimationFrame(loop);
    } else if (!want && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };
  const io = new IntersectionObserver(([en]) => {
    inView = en.isIntersecting;
    if (inView && introStart === null) introStart = performance.now() + 150;
    sync();
  }, { threshold: 0.2 });
  io.observe(stage);
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  document.addEventListener('visibilitychange', sync);

  // Pointer: hover on fine pointers, tap toggle on touch. Wheel and touch
  // scrolling stay with the page.
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let current = null;
  const setCurrent = (e, clientX, clientY) => {
    if (current !== e) {
      if (current) current.lift = 0;
      current = e;
      if (e) e.lift = 1;
      canvas.style.cursor = e ? 'pointer' : '';
      if (reduced) draw(performance.now());
    }
    if (!e) {
      tooltip.style.opacity = '0';
      return;
    }
    const r = stage.getBoundingClientRect();
    tooltip.textContent = e.office ? `${e.name} (Office)` : e.name;
    const tw = tooltip.offsetWidth;
    const x = Math.min(Math.max(clientX - r.left + 14, 0), r.width - tw);
    tooltip.style.transform = `translate(${x}px, ${Math.max(clientY - r.top - 36, 0)}px)`;
    tooltip.style.opacity = '1';
  };
  const pick = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(entities.map((e) => e.mesh), false)[0];
    return hit ? entities.find((e) => e.mesh === hit.object) : null;
  };
  let lastMove = 0;
  const onMove = (ev) => {
    if (ev.pointerType === 'touch') return;
    const r = canvas.getBoundingClientRect();
    if (finePointer) {
      pointerX = ((ev.clientX - r.left) / r.width) * 2 - 1;
      pointerY = ((ev.clientY - r.top) / r.height) * 2 - 1;
    }
    const now = performance.now();
    if (now - lastMove < 30) return;
    lastMove = now;
    setCurrent(pick(ev.clientX, ev.clientY), ev.clientX, ev.clientY);
  };
  const onLeave = () => {
    pointerX = pointerY = 0;
    setCurrent(null);
  };
  let down = null;
  const onDown = (ev) => {
    if (ev.pointerType === 'touch') down = [ev.clientX, ev.clientY];
  };
  const onUp = (ev) => {
    if (ev.pointerType !== 'touch' || !down) return;
    const moved = Math.hypot(ev.clientX - down[0], ev.clientY - down[1]);
    down = null;
    if (moved > 8) return;
    const hit = pick(ev.clientX, ev.clientY);
    setCurrent(hit && hit === current ? null : hit, ev.clientX, ev.clientY);
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);

  resize();
  draw(performance.now());
  requestAnimationFrame(() => onFirstFrame());

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      extras.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
}
