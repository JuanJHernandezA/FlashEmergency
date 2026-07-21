import { useEffect } from 'react';
import type { ICoordinates } from '../types';

const STORAGE_KEY = 'flashemergency-last-location';

export function getLastKnownLocation(): ICoordinates | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ICoordinates) : null;
  } catch {
    return null;
  }
}

export function saveLastKnownLocation(coordinates: ICoordinates): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coordinates));
}

function useLastKnownLocation(coordinates: ICoordinates | null): void {
  useEffect(() => {
    if (coordinates) {
      saveLastKnownLocation(coordinates);
    }
  }, [coordinates]);
}

export default useLastKnownLocation;
