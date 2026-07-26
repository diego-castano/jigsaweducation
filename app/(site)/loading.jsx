// Route-transition skeleton. Next renders this in place of the page while
// the next segment loads, inside the same header/footer chrome from
// layout.jsx. It approximates page anatomy (hero block, 3-column grid)
// with the shared `.shimmer` blocks rather than a spinner, so a slow
// navigation still reads as "the page is arriving", not "something broke".
export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28"
    >
      <span className="sr-only">Loading</span>

      {/* Hero block */}
      <div className="max-w-3xl">
        <div className="h-4 w-32 rounded-full shimmer mb-6" aria-hidden="true" />
        <div className="h-12 sm:h-14 w-full rounded-xl shimmer mb-3" aria-hidden="true" />
        <div className="h-12 sm:h-14 w-2/3 rounded-xl shimmer mb-8" aria-hidden="true" />
        <div className="h-5 w-full rounded-lg shimmer mb-2" aria-hidden="true" />
        <div className="h-5 w-5/6 rounded-lg shimmer" aria-hidden="true" />
      </div>

      {/* Three-column grid */}
      <div className="grid sm:grid-cols-3 gap-6 mt-16">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-[4/3] w-full rounded-2xl shimmer" aria-hidden="true" />
            <div className="h-5 w-3/4 rounded-lg shimmer" aria-hidden="true" />
            <div className="h-4 w-full rounded-lg shimmer" aria-hidden="true" />
            <div className="h-4 w-5/6 rounded-lg shimmer" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
