import type { MeasurementSystem } from '../types/location';

const METERS_PER_MILE = 1609.344;
const IMPERIAL_COUNTRIES = ['US', 'LR', 'MM'];

export function getMeasurementSystem(isoCode: string): MeasurementSystem {
  return IMPERIAL_COUNTRIES.includes(isoCode.toUpperCase()) ? 'imperial' : 'metric';
}

export function formatDistance(meters: number, system: MeasurementSystem): string {
  if (system === 'imperial') {
    const miles = meters / METERS_PER_MILE;
    if (miles < 0.1) {
      const feet = Math.round(meters * 3.28084);
      return `${feet} ft`;
    }
    return `${miles.toFixed(1)} mi`;
  }

  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatTemperature(celsius: number, system: MeasurementSystem): string {
  if (system === 'imperial') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function getTemperatureUnitLabel(system: MeasurementSystem): string {
  return system === 'imperial' ? 'Fahrenheit (°F)' : 'Celsius (°C)';
}

export function getDistanceUnitLabel(system: MeasurementSystem): string {
  return system === 'imperial' ? 'Miles (mi)' : 'Kilometers (km)';
}
