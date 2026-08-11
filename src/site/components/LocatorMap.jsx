import { geoPath, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';
import topology from 'world-atlas/countries-110m.json';

// A country outline with a pin, rendered from the same TopoJSON the home map
// uses. Not an embedded Google Map on purpose: an iframe there sets third-party
// cookies before the visitor has agreed to anything, which is a poor fit for a
// client whose Policies page leads on data protection - and whose current
// cookie banner is already opt-out and questionable under UK GDPR.
//
// Server-rendered: no JavaScript ships for this.
const WIDTH = 320;
const HEIGHT = 220;

export default function LocatorMap({ countryId, coords, label }) {
  const collection = feature(topology, topology.objects.countries);
  const shape = collection.features.find((f) => f.id === countryId);
  if (!shape) return null;

  const projection = geoMercator().fitExtent(
    [
      [16, 16],
      [WIDTH - 16, HEIGHT - 16]
    ],
    shape
  );
  const path = geoPath(projection);
  const [x, y] = projection(coords);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      role="img"
      aria-label={label}
    >
      <rect width={WIDTH} height={HEIGHT} fill="#F2EDE0" />
      <path d={path(shape)} fill="#d8e6ec" stroke="#87b1c4" strokeWidth={1} />
      <circle cx={x} cy={y} r={11} fill="#ff7816" opacity={0.22} />
      <circle cx={x} cy={y} r={5} fill="#ff7816" stroke="#FDFAF4" strokeWidth={2} />
    </svg>
  );
}
