// Route-group skeleton: the site's shimmer pattern arranged like a console
// screen, so navigation between admin pages never flashes blank.

export default function ConsoleLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-10" aria-busy="true" aria-label="Loading">
      <div>
        <div className="shimmer h-3 w-44 rounded-full" />
        <div className="shimmer mt-3 h-9 w-72 rounded-xl" />
        <div className="shimmer mt-3 h-4 w-96 max-w-full rounded-full" />
      </div>

      <div>
        <div className="shimmer h-6 w-24 rounded-full" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer h-20 rounded-2xl" />
          ))}
        </div>
      </div>

      <div>
        <div className="shimmer h-6 w-28 rounded-full" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
