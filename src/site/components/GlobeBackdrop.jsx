'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

// The hero's animated backdrop: a dotted WebGL globe (cobe, 5KB) in the
// brand's sea tones with the two offices marked in orange and one quiet arc
// between them. Chosen over three.js deliberately: this is atmosphere, not a
// feature, and 5KB of shader beats 600KB of scene graph for a background.
//
// Restraint rules:
// - pointer-events-none and aria-hidden: it is decoration, full stop.
// - Rotation pauses when the hero scrolls out of view (IO flag), and never
//   starts under prefers-reduced-motion - the globe still renders, static.
// - The canvas fades in over 1.2s so it never pops.
const SIZE = 820;

// Fallback matching site-settings offices (London, Lusaka) so a missing prop
// still renders the two markers. [lon, lat], same order as the settings store.
const DEFAULT_OFFICE_COORDS = [
  [-0.2405, 51.5449],
  [28.3228, -15.3875]
];

export default function GlobeBackdrop({
  className = '',
  parallax = 0,
  officeCoords = DEFAULT_OFFICE_COORDS
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Parallax: the wrapper drifts down at a fraction of the scroll speed, so
  // the globe recedes slower than the page and stays in view behind the next
  // section. Direct style writes on rAF - never React state per frame - and
  // nothing moves under prefers-reduced-motion.
  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (wrapRef.current) {
          wrapRef.current.style.transform = `translateY(${window.scrollY * parallax}px)`;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [parallax]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Site settings store office coords as [lon, lat] (the GeoJSON
    // convention); cobe wants [lat, lon]. This is the ONE place the axes
    // flip - everywhere else keeps the settings order.
    const locations = (officeCoords || [])
      .filter((pair) => Array.isArray(pair) && pair.length === 2)
      .map(([lon, lat]) => [lat, lon]);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Start facing Europe/Africa so both markers are in view on load.
    let phi = 5.9;
    let visible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: SIZE * 2,
      height: SIZE * 2,
      phi,
      theta: 0.28,
      dark: 0,
      diffuse: 1.7,
      mapSamples: 22000,
      // The first pass rendered a flat pale disc: base sea-300 left the land
      // dots with no contrast against the sphere face. Darker base + brighter
      // map makes the dot matrix legible, which is what says "globe".
      mapBrightness: 11,
      // A whisper of ocean dots so the sphere reads as textured everywhere,
      // even when the visible arc is mid-Atlantic.
      mapBaseBrightness: 0.06,
      baseColor: [0.36, 0.55, 0.66], // between sea-400 and sea-500
      glowColor: [0.992, 0.98, 0.957], // cream-50 - the glow dissolves into the page
      markerColor: [1, 0.47, 0.086], // orange-500
      opacity: 0.9,
      markers: locations.map((location) => ({ location, size: 0.06 })),
      arcs:
        locations.length >= 2 ? [{ from: locations[0], to: locations[1] }] : [],
      arcColor: [0.25, 0.49, 0.61], // sea-500
      arcWidth: 0.4,
      arcHeight: 0.35,
      onRender: (state) => {
        if (!reduce && visible) phi += 0.0016;
        state.phi = phi;
      }
    });

    const t = setTimeout(() => setReady(true), 80);

    return () => {
      clearTimeout(t);
      io.disconnect();
      globe.destroy();
    };
    // Built once per mount on purpose: officeCoords comes from a server page
    // and never changes within a pageview, and rebuilding the WebGL scene on a
    // prop identity change would flash the backdrop.
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none select-none will-change-transform ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={SIZE * 2}
        height={SIZE * 2}
        style={{
          width: SIZE,
          height: SIZE,
          opacity: ready ? 1 : 0,
          transition: 'opacity 1.2s var(--ease-decelerate)'
        }}
      />
    </div>
  );
}
