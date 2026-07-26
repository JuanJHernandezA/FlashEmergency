import type { ICoordinates, IEmergencyService, EmergencyCategory } from '../types';

const OVERPASS_ENDPOINTS = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

const CATEGORY_QUERIES: Record<EmergencyCategory, string> = {
  hospital: '["amenity"="hospital"]',
  clinic: '["amenity"="clinic"]',
  pharmacy: '["amenity"="pharmacy"]',
  police: '["amenity"="police"]',
  fire_station: '["amenity"="fire_station"]',
};

interface IOverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface IOverpassResponse {
  elements: IOverpassElement[];
}

function buildQuery(coordinates: ICoordinates, radiusMeters: number): string {
  const { latitude, longitude } = coordinates;
  const around = `(around:${radiusMeters},${latitude},${longitude})`;

  const filters = Object.values(CATEGORY_QUERIES)
    .map(
      (filter) =>
        `node${filter}${around};way${filter}${around};relation${filter}${around};`,
    )
    .join('');

  return `[out:json][timeout:20];(${filters});out center;`;
}

function getCategory(tags: Record<string, string>): EmergencyCategory {
  const amenity = tags.amenity;
  if (amenity === 'hospital') return 'hospital';
  if (amenity === 'clinic') return 'clinic';
  if (amenity === 'pharmacy') return 'pharmacy';
  if (amenity === 'police') return 'police';
  if (amenity === 'fire_station') return 'fire_station';
  return 'hospital';
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function queryOverpass(query: string): Promise<IOverpassResponse> {
  const body = 'data=' + encodeURIComponent(query);

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: IOverpassResponse = await response.json();

      if (data && Array.isArray(data.elements)) {
        return data;
      }

      throw new Error('Invalid response structure');
    } catch (err) {
      console.warn(`Overpass endpoint failed: ${endpoint}`, err instanceof Error ? err.message : err);
      continue;
    }
  }

  throw new Error('All Overpass API endpoints are unavailable.');
}

export async function fetchNearbyServices(
  coordinates: ICoordinates,
  radiusMeters: number = 5000,
): Promise<IEmergencyService[]> {
  const query = buildQuery(coordinates, radiusMeters);
  const data = await queryOverpass(query);

  const services: IEmergencyService[] = data.elements
    .filter((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      return lat !== undefined && lon !== undefined && el.tags;
    })
    .map((el) => {
      const lat = (el.lat ?? el.center?.lat)!;
      const lon = (el.lon ?? el.center?.lon)!;
      const tags = el.tags!;
      const distance = calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        lat,
        lon,
      );

      return {
        id: String(el.id),
        name: tags.name || tags['name:en'] || getCategoryLabel(getCategory(tags)),
        category: getCategory(tags),
        distance: Math.round(distance),
        address: tags['addr:street']
          ? `${tags['addr:street']} ${tags['addr:housenumber'] || ''}`.trim()
          : undefined,
        latitude: lat,
        longitude: lon,
      };
    })
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

  return services;
}

export function getCategoryLabel(category: EmergencyCategory): string {
  const labels: Record<EmergencyCategory, string> = {
    hospital: 'Hospital',
    clinic: 'Clinic',
    pharmacy: 'Pharmacy',
    police: 'Police Station',
    fire_station: 'Fire Station',
  };
  return labels[category];
}
