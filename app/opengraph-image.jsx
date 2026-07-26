import { ImageResponse } from 'next/og';
import { SITE } from '../src/data/site';

// The current site has no og:image at all, and its og:url is set to the
// relative path "/pages/home" — so every link shared on LinkedIn, which is the
// only social platform Jigsaw uses, previews as a bare grey box.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE.name} — ${SITE.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FDFAF4',
          padding: '80px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 999,
              background: '#ff7816',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FDFAF4',
              fontSize: 52,
              fontWeight: 700
            }}
          >
            J
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: '#1a3340' }}>Jigsaw</div>
            <div style={{ fontSize: 20, color: '#6B6B61', letterSpacing: 3 }}>
              EDUCATION EVIDENCE
            </div>
          </div>
        </div>

        <div style={{ fontSize: 68, color: '#1a3340', lineHeight: 1.15, maxWidth: 900 }}>
          {SITE.tagline}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 64, height: 6, background: '#ff7816' }} />
          <div style={{ fontSize: 24, color: '#44443D' }}>London · Lusaka</div>
        </div>
      </div>
    ),
    size
  );
}
