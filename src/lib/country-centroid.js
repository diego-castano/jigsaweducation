import { feature } from 'topojson-client';
import { geoArea, geoCentroid } from 'd3-geo';
import topology from 'world-atlas/countries-110m.json';

// [lon, lat] of a country's visual centre, keyed by the zero-padded ISO numeric
// id the admin's country picker stores (src/cms/iso-countries.js reads the same
// atlas). Countries in several parts use their largest part, so France lands
// in France rather than somewhere between Paris and French Guiana.
//
// Server-side on purpose: the home hero needs three points, and shipping the
// atlas to the browser for them would cost ~100KB.
let table = null;

function build() {
  const map = new Map();
  for (const country of feature(topology, topology.objects.countries).features) {
    let geometry = country.geometry;
    if (!geometry) continue;
    if (geometry.type === 'MultiPolygon') {
      geometry = geometry.coordinates
        .map((coordinates) => ({ type: 'Polygon', coordinates }))
        .reduce((largest, part) => (geoArea(part) > geoArea(largest) ? part : largest));
    }
    const [lon, lat] = geoCentroid(geometry);
    map.set(String(country.id), [Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]);
  }
  return map;
}

export function countryCentroid(id) {
  if (id == null || id === '') return null;
  table ??= build();
  return table.get(String(id)) || null;
}
