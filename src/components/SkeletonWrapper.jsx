import { Suspense, useEffect, useState } from 'react';

/**
 * Wraps a lazy-loaded section with a boneyard `<Skeleton>` if available,
 * else falls back to a shimmer placeholder. Boneyard is loaded lazily on
 * first mount — keeps the initial bundle lean and works without snapshots.
 */

function Fallback({ minHeight = 320, label = 'Loading…' }) {
  return (
    <div className="bone-fallback flex items-center justify-center" style={{ minHeight }} role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function SkeletonWrapper({ name, minHeight, children }) {
  const [BoneyardSkeleton, setBoneyardSkeleton] = useState(null);

  useEffect(() => {
    let cancelled = false;
    import('boneyard-js/react')
      .then((m) => {
        if (!cancelled && m && m.Skeleton) setBoneyardSkeleton(() => m.Skeleton);
      })
      .catch(() => {
        // Boneyard not installed or failed — silently fall back to shimmer
      });
    return () => { cancelled = true; };
  }, []);

  const fallback = BoneyardSkeleton
    ? <BoneyardSkeleton name={name || 'section'} loading />
    : <Fallback minHeight={minHeight} />;

  return <Suspense fallback={fallback}>{children}</Suspense>;
}

export { Fallback };
