'use client';

import { useCallback, useState } from 'react';

// Drop-in <img> replacement: shows the shared `.shimmer` skeleton until the
// photo loads, then fades it in with `.img-fade` (globals.css already turns
// that fade off under prefers-reduced-motion). On a load error it settles on
// a plain cream-200 panel rather than a broken-image glyph.
//
// The fade lives on a wrapper span around the <img>, not on the <img> itself.
// `.img-fade` sets the `transition` shorthand, which would otherwise stomp
// any transition classes callers pass through `imgClassName` (TeamCard's
// duotone-lift and CaseStudyCard's hover-scale both rely on their own
// `transition-*` utilities surviving untouched on the image element).
export default function SmartImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  // Ref callback, not useEffect: catches images the browser already has in
  // cache (or resolves synchronously) before onLoad would otherwise fire, so
  // the shimmer never gets stuck on top of an image that's already there.
  const imgRef = useCallback((node) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setStatus('loaded');
    }
  }, []);

  if (!src) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-cream-200" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {status !== 'loaded' && (
        <div
          className={`absolute inset-0 ${status === 'error' ? 'bg-cream-200' : 'shimmer'}`}
          aria-hidden="true"
        />
      )}
      {status !== 'error' && (
        <span className={`block w-full h-full img-fade ${status === 'loaded' ? 'img-loaded' : ''}`}>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading={loading}
            decoding={decoding}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            className={`w-full h-full ${imgClassName}`}
            {...rest}
          />
        </span>
      )}
    </div>
  );
}
