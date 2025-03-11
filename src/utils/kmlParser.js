import { kml } from '@tmcw/togeojson';
import { length } from '@turf/turf';

export const parseKML = (kmlText) => {
  const parser = new DOMParser();
  const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
  return kml(kmlDoc);
};

export const getSummary = (geoJson) => {
  const counts = {};
  geoJson.features.forEach(feature => {
    const type = feature.geometry?.type || 'Unknown';
    counts[type] = (counts[type] || 0) + 1;
  });
  return counts;
};

export const getDetailed = (geoJson) => {
  const lineTypes = ['LineString', 'MultiLineString'];
  return geoJson.features
    .filter(f => lineTypes.includes(f.geometry?.type))
    .map(feature => ({
      type: feature.geometry.type,
      length: length(feature, { units: 'kilometers' })
    }));
};