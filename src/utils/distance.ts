interface Point {
  lat: number;
  lon: number;
}

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return deg * Math.PI / 180;
}

export function distanceInKm(from: Point, to: Point): number {
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c);
}