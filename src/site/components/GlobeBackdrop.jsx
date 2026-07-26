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
//   starts under prefers-reduced-motion — the globe still renders, static.
// - The canvas fades in over 1.2s so it never pops.
const SIZE = 820;

const LONDON = [51.5449, -0.2405];
const LUSAKA = [-15.3875, 28.3228];

export default function GlobeBackdrop({ className = '' }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      glowColor: [0.992, 0.98, 0.957], // cream-50 — the glow dissolves into the page
      markerColor: [1, 0.47, 0.086], // orange-500
      opacity: 0.9,
      markers: [
        { location: LONDON, size: 0.06 },
        { location: LUSAKA, size: 0.06 }
      ],
      arcs: [{ from: LONDON, to: LUSAKA }],
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
  }, []);

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
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
