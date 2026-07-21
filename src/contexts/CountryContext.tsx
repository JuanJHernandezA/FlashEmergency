import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ICoordinates } from '../types';
import type { ILocationDetails, MeasurementSystem } from '../types/location';
import { reverseGeocodeDetailed } from '../services/geocoding';
import { getEmergencyNumbers, type ICountryEmergency } from '../constants/emergencyNumbers';
import { getMeasurementSystem } from '../utils/locationFormatter';

interface ICountryContextValue {
  country: { country: string; isoCode: string } | null;
  location: ILocationDetails | null;
  emergency: ICountryEmergency;
  measurementSystem: MeasurementSystem;
  isDetecting: boolean;
  detectCountry: (coordinates: ICoordinates) => Promise<void>;
}

const CountryContext = createContext<ICountryContextValue | null>(null);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<ILocationDetails | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const hasDetected = useRef(false);

  const isoCode = location?.isoCode ?? '';
  const emergency = getEmergencyNumbers(isoCode);
  const measurementSystem = getMeasurementSystem(isoCode);

  const country = location
    ? { country: location.country, isoCode: location.isoCode }
    : null;

  const detectCountry = useCallback(async (coordinates: ICoordinates) => {
    if (hasDetected.current) return;
    hasDetected.current = true;
    setIsDetecting(true);

    try {
      const result = await reverseGeocodeDetailed(coordinates);
      if (result) {
        setLocation(result);
      }
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return (
    <CountryContext.Provider value={{ country, location, emergency, measurementSystem, isDetecting, detectCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry(): ICountryContextValue {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
