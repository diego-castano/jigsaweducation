'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import createGlobe from 'cobe';
import Icon from '../../components/Icon';

// The home hero's right-hand side. Design feedback, 15 September 2026:
// "Rather than having one 'hero photograph' on the home page, would it be
// possible to have maybe three smaller images which interlink in some way -
// possibly interlinking with the blue globe, if that's moved up and to the
// right hand side?" The aim is to show range, in places and in activities,
// instead of one image that sums the work up.
//
// So: a stage holding the dotted cobe globe, bleeding off the top right, and
// three field photographs around it. A thread runs from each photograph to
// the country it was taken in. The globe sways a few degrees either way and
// the threads stay pinned to their countries as it turns.
//
// Layout is in stage units, 1000 across by STAGE_H down. The stage keeps that
// ratio and the SVG shares the viewBox, so threads land exactly at any width.
// The old backdrop's restraint rules still hold: globe and threads are
// aria-hidden, motion pauses off screen and never starts under
// prefers-reduced-motion, and the canvas fades in rather than popping.

const STAGE_W = 1000;
const STAGE_H = 1060;

// The globe's square canvas in stage units. cobe draws the sphere at 0.8 of
// the half-canvas and lifts markers 0.05 above the surface.
const GLOBE = { x: 250, y: -40, size: 980 };
const MARKER_RADIUS = 0.85;

// Three slots, all 4:3 like the source photographs. `anchor` is where the
// thread leaves the photo, just outside its cream ring.
const SLOTS = [
  { x: 0, y: 70, w: 370, anchor: [384, 208] },
  { x: 540, y: 600, w: 440, anchor: [700, 586] },
  { x: 60, y: 640, w: 340, anchor: [414, 740] }
];

const SWAY = 0.28; // radians either side, about 16 degrees
const PERIOD = 28; // seconds per full sway
const FRAME_MS = 33; // about 30fps: plenty for a slow sway, half the GPU work

const RAD = Math.PI / 180;
const round = (n) => Math.round(n * 10) / 10;
const pct = (value, total) => `${(value / total) * 100}%`;

// cobe's own projection (function O in cobe/dist/index.esm.js) unrolled for
// one [lon, lat] point: its stage position, and depth, z > 0 facing us.
function project([lon, lat], phi, theta) {
  const la = lat * RAD;
  const lo = lon * RAD - Math.PI;
  const px = -Math.cos(la) * Math.cos(lo) * MARKER_RADIUS;
  const py = Math.sin(la) * MARKER_RADIUS;
  const pz = Math.cos(la) * Math.sin(lo) * MARKER_RADIUS;
  const cp = Math.cos(phi);
  const sp = Math.sin(phi);
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const x = cp * px + sp * pz;
  const y = sp * st * px + ct * py - cp * st * pz;
  const z = -sp * ct * px + st * py + cp * ct * pz;
  return {
    x: GLOBE.x + ((x + 1) / 2) * GLOBE.size,
    y: GLOBE.y + ((1 - y) / 2) * GLOBE.size,
    z
  };
}

// Turn the globe to face the average of the photographs' countries, tilted no
// further than is comfortable, so every pin sits on the near side.
function facing(points) {
  let vx = 0;
  let vy = 0;
  let vz = 0;
  for (const [lon, lat] of points) {
    vx += Math.cos(lat * RAD) * Math.cos(lon * RAD);
    vy += Math.cos(lat * RAD) * Math.sin(lon * RAD);
    vz += Math.sin(lat * RAD);
  }
  const length = Math.hypot(vx, vy, vz);
  const lon = length > 1e-6 ? Math.atan2(vy, vx) : 30 * RAD;
  const lat = length > 1e-6 ? Math.asin(vz / length) : 10 * RAD;
  return { phi: -Math.PI / 2 - lon, theta: Math.min(0.5, Math.max(-0.35, lat)) };
}

const permutations = (items) =>
  items.length <= 1
    ? [items]
    : items.flatMap((item, i) =>
        permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest])
      );

// Which photo takes which slot: the arrangement with the shortest total thread
// length, which is also the one where threads never cross.
function arrange(photos, orientation) {
  let best = photos.map((_, i) => i);
  let bestCost = Infinity;
  for (const order of permutations(best)) {
    const cost = order.reduce((sum, photoIndex, slot) => {
      const coords = photos[photoIndex].coords;
      if (!coords) return sum;
      const point = project(coords, orientation.phi, orientation.theta);
      const [ax, ay] = SLOTS[slot].anchor;
      return sum + Math.hypot(point.x - ax, point.y - ay);
    }, 0);
    if (cost < bestCost) {
      bestCost = cost;
      best = order;
    }
  }
  return best;
}

// A quadratic curve from photo to pin, bowed away from the globe's centre like
// a flight path.
function threadPath([ax, ay], { x: mx, y: my }) {
  const dx = mx - ax;
  const dy = my - ay;
  const length = Math.hypot(dx, dy) || 1;
  let nx = -dy / length;
  let ny = dx / length;
  const midX = (ax + mx) / 2;
  const midY = (ay + my) / 2;
  if (nx * (midX - (GLOBE.x + GLOBE.size / 2)) + ny * (midY - (GLOBE.y + GLOBE.size / 2)) < 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = Math.min(80, length * 0.16);
  return `M${round(ax)} ${round(ay)}Q${round(midX + nx * bow)} ${round(midY + ny * bow)} ${round(mx)} ${round(my)}`;
}

// Threads and pins fade as their country turns towards the limb.
const depthOpacity = (z) => String(Math.min(1, Math.max(0, (z - 0.05) / 0.2)));

export default function HeroGlobe({ photos = [], className = '' }) {
  const stageRef = useRef(null);
  const globeRef = useRef(null);
  const threadRefs = useRef([]);
  const pinRefs = useRef([]);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(null);

  // Photos come from a server page and never change within a pageview, so
  // everything derived from them is computed once, identically on the server
  // and in the browser (coordinates are rounded, so hydration matches).
  const shown = useMemo(() => photos.slice(0, SLOTS.length), [photos]);
  const orientation = useMemo(() => facing(shown.map((p) => p.coords).filter(Boolean)), [shown]);
  const order = useMemo(() => arrange(shown, orientation), [shown, orientation]);
  const initial = useMemo(
    () =>
      order.map((photoIndex, slot) => {
        const coords = shown[photoIndex].coords;
        if (!coords) return null;
        const point = project(coords, orientation.phi, orientation.theta);
        return { point, d: threadPath(SLOTS[slot].anchor, point) };
      }),
    [shown, orientation, order]
  );

  useEffect(() => {
    const stage = stageRef.current;
    const host = globeRef.current;
    if (!stage || !host) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvasSize = () => (stage.clientWidth * GLOBE.size) / STAGE_W;

    // A fresh canvas per mount. cobe wraps its canvas in a div of its own, and
    // reusing one canvas across remounts (Fast Refresh, Strict Mode) leaves
    // stale WebGL state bound to the old context.
    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'display:block;width:100%;height:100%;opacity:0;transition:opacity 1.2s var(--ease-decelerate)';
    host.append(canvas);

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: canvasSize(),
      height: canvasSize(),
      phi: orientation.phi,
      theta: orientation.theta,
      dark: 0,
      diffuse: 1.7,
      mapSamples: 16000,
      mapBrightness: 11,
      mapBaseBrightness: 0.06,
      baseColor: [0.36, 0.55, 0.66], // between sea-400 and sea-500
      glowColor: [0.992, 0.98, 0.957], // cream-50: the glow dissolves into the page
      markerColor: [1, 0.47, 0.086], // orange-500, unused: the pins are drawn in SVG
      opacity: 0.9,
      // No cobe markers or office arc: the only points on this globe are the
      // three photographs' countries, so nothing reads as an unexplained dot.
      markers: [],
      arcs: []
    });

    // Direct attribute writes per frame, never React state.
    const draw = (phi) => {
      order.forEach((photoIndex, slot) => {
        const coords = shown[photoIndex].coords;
        const thread = threadRefs.current[slot];
        const pin = pinRefs.current[slot];
        if (!coords || !thread || !pin) return;
        const point = project(coords, phi, orientation.theta);
        const opacity = depthOpacity(point.z);
        const d = threadPath(SLOTS[slot].anchor, point);
        for (const path of thread.children) path.setAttribute('d', d);
        thread.style.opacity = opacity;
        pin.setAttribute('transform', `translate(${round(point.x)} ${round(point.y)})`);
        pin.style.opacity = opacity;
      });
    };

    let raf = 0;
    let visible = true;
    let last = -Infinity;
    const start = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || now - last < FRAME_MS) return;
      last = now;
      const phi = orientation.phi + SWAY * Math.sin(((now - start) / 1000) * ((2 * Math.PI) / PERIOD));
      globe.update({ phi });
      draw(phi);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      const size = canvasSize();
      globe.update({ width: size, height: size });
    });
    ro.observe(stage);

    if (reduce) draw(orientation.phi);
    else raf = requestAnimationFrame(frame);

    const t = setTimeout(() => {
      canvas.style.opacity = '1';
      setReady(true);
    }, 80);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      globe.destroy();
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      (canvas.parentElement === host ? canvas : canvas.parentElement)?.remove();
    };
  }, [shown, orientation, order]);

  return (
    <div ref={stageRef} className={`relative ${className}`} style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
      <div
        ref={globeRef}
        className="absolute pointer-events-none select-none"
        style={{
          left: pct(GLOBE.x, STAGE_W),
          top: pct(GLOBE.y, STAGE_H),
          width: pct(GLOBE.size, STAGE_W),
          aspectRatio: '1 / 1'
        }}
        aria-hidden="true"
      />

      <svg
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        className={`absolute inset-0 h-full w-full overflow-visible pointer-events-none transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        {order.map((photoIndex, slot) => {
          const start = initial[slot];
          if (!start) return null;
          const on = active === slot;
          const [ax, ay] = SLOTS[slot].anchor;
          // The thread is drawn twice: a soft cream halo underneath, then the
          // line itself, so it stays crisp where it crosses the blue globe.
          return (
            <g key={slot}>
              <g
                ref={(el) => {
                  threadRefs.current[slot] = el;
                }}
              >
                <path
                  d={start.d}
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="stroke-cream-50/80 stroke-[4px]"
                />
                <path
                  d={start.d}
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className={`transition-[stroke] duration-300 ${
                    on ? 'stroke-orange-500 stroke-[1.75px]' : 'stroke-navy-900/75 stroke-[1.25px]'
                  }`}
                />
              </g>
              <circle cx={ax} cy={ay} r="5" className={`transition-[fill] duration-300 ${on ? 'fill-orange-500' : 'fill-navy-900'}`} />
              <g
                ref={(el) => {
                  pinRefs.current[slot] = el;
                }}
                transform={`translate(${round(start.point.x)} ${round(start.point.y)})`}
              >
                <circle
                  r="17"
                  className={`fill-orange-500/25 origin-center [transform-box:fill-box] ${on ? 'animate-ping' : ''}`}
                />
                <circle r="7.5" className="fill-orange-500 stroke-cream-50 stroke-[2px]" vectorEffect="non-scaling-stroke" />
              </g>
            </g>
          );
        })}
      </svg>

      {order.map((photoIndex, slot) => {
        const photo = shown[photoIndex];
        const box = SLOTS[slot];
        return (
          <Link
            key={`${slot}-${photo.src}`}
            href={photo.href}
            onMouseEnter={() => setActive(slot)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(slot)}
            onBlur={() => setActive(null)}
            className="group absolute block rounded-xl focus:outline-none"
            style={{ left: pct(box.x, STAGE_W), top: pct(box.y, STAGE_H), width: pct(box.w, STAGE_W) }}
          >
            <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-cream-200 ring-4 ring-cream-50 shadow-[0_22px_40px_-26px_rgba(26,51,64,0.6)] group-focus-visible:ring-orange-500">
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ objectPosition: photo.objectPosition }}
                decoding="async"
                fetchPriority={slot === 0 ? 'high' : undefined}
                className="absolute inset-0 h-full w-full object-cover grayscale-[0.55] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03] group-focus-visible:grayscale-0"
              />
              <span
                className="absolute inset-0 bg-navy-900 mix-blend-multiply opacity-25 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
                aria-hidden="true"
              />
            </span>
            <span className="mt-2.5 flex items-start justify-between gap-2">
              <span className="min-w-0">
                {photo.country && (
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-orange-600">
                    {photo.country}
                  </span>
                )}
                {photo.caption && (
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-700 transition-colors group-hover:text-navy-900 max-sm:sr-only">
                    {photo.caption}
                  </span>
                )}
              </span>
              <Icon
                name="arrow-up-right"
                size={13}
                className="mt-px shrink-0 text-ink-500 transition-colors group-hover:text-orange-600"
              />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
