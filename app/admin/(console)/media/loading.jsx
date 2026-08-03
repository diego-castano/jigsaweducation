// Media library skeleton: header, toolbar and a grid of square tiles in the
// site's shimmer pattern, so the route never flashes blank.

export default function MediaLoading() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading the media library">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <div className="shimmer h-9 w-40 rounded-xl" />
          <div className="shimmer mt-3 h-4 w-80 max-w-full rounded-full" />
        </div>
        <div className="shimmer h-3 w-16 rounded-full" />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div className="shimmer h-11 w-full max-w-xs rounded-full" />
        <div className="shimmer h-11 w-28 rounded-full" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="shimmer aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}
